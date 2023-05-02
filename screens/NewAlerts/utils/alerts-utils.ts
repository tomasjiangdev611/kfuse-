import dayjs from 'dayjs';
import { NavigateFunction } from 'react-router-dom';
import { DateSelection, SelectedFacetValuesByName, ValueCount } from 'types';
import { filterListWithSelectedSidebar } from 'utils';
import { RuleProps } from '../types';
import { useAlertsCreate } from '../hooks';

export const AlertsCore = [
  { name: 'Status', label: 'state', forceExpanded: true },
];

export const AlertsFacet = [
  { name: 'Status', label: 'state', forceExpanded: false },
  { name: 'Components', label: 'components', forceExpanded: false },
  { name: 'Tags', label: 'tags', forceExpanded: false },
];

export const AlertsStatus = [
  { label: 'Alerting', value: 'alerting' },
  { label: 'OK', value: 'ok' },
  { label: 'No Data', value: 'no_data' },
  { label: 'Pending', value: 'pending' },
  { label: 'Paused', value: 'paused' },
];

const getNonContactPointLabels = (
  labels: { [key: string]: string },
  contactPoints: string[],
): {
  tags: { [key: string]: string };
  contactPointLabels: string[];
} => {
  if (!labels) return { tags: {}, contactPointLabels: [] };

  const tags: { [key: string]: string } = {};
  const contactPointLabels: string[] = [];
  Object.keys(labels).forEach((key) => {
    if (contactPoints.includes(key)) {
      contactPointLabels.push(key);
    } else {
      tags[key] = labels[key];
    }
  });

  return { tags, contactPointLabels };
};

const getRuleRow = (health: string, folder: string, rule: any): RuleProps => {
  const queryRow = rule.data[0];
  return {
    datasourceUid: queryRow.datasourceUid,
    group: rule.rule_group,
    groupFile: folder,
    name: rule.title,
    ruleData: rule.data,
    status: health,
    uid: rule.uid,
    updated: rule.updated,
  };
};

export const formatGrafanaAlertsRules = (
  data: { [key: string]: any },
  contactPoints: string[],
): RuleProps[] => {
  const statusMapped: { [key: string]: string } = {
    firing: 'alerting',
    inactive: 'ok',
  };

  const alerts: RuleProps[] = [];
  const folders = Object.keys(data);
  folders.map((folder) => {
    const folderData = data[folder];
    folderData.map((group: any) => {
      group.rules.map((rule: any) => {
        const grafana_alert = rule.grafana_alert;
        let health = grafana_alert.state.toLowerCase();
        health = statusMapped[health] ? statusMapped[health] : health;

        const { tags: ruleTags, contactPointLabels } = getNonContactPointLabels(
          rule.labels,
          contactPoints,
        );

        alerts.push({
          ...getRuleRow(health, folder, grafana_alert),
          ...{
            annotations: rule.annotations,
            components: rule.annotations?.componentName || 'others',
            evaluate: { for: rule.for, every: group.interval },
            labels: rule.labels,
            contactPointLabels,
            tags: Object.keys(ruleTags),
          },
        });
      });
    });
  });

  return alerts;
};

export const filterAlertsRules = (
  rules: RuleProps[],
  selectedFacetValuesByName: SelectedFacetValuesByName,
): {
  formattedRules: RuleProps[];
  components: ValueCount[];
  status: ValueCount[];
  tags: ValueCount[];
} => {
  const components: { [key: string]: number } = { others: 0 };
  const tags: { [key: string]: number } = {};
  const status: { [key: string]: number } = {};
  const filtered = filterListWithSelectedSidebar(
    rules,
    selectedFacetValuesByName,
  );

  filtered.forEach((alert) => {
    if (components[alert.components] === undefined) {
      components[alert.components] = 1;
    } else {
      components[alert.components] += 1;
    }

    alert.tags.forEach((tag) => {
      if (tags[tag] === undefined) {
        tags[tag] = 1;
      } else {
        tags[tag] += 1;
      }
    });

    if (status[alert.status] === undefined) {
      status[alert.status] = 1;
    } else {
      status[alert.status] += 1;
    }
  });

  return {
    formattedRules: filtered,
    components: Object.keys(components).map((key) => ({
      value: key,
      count: components[key],
    })),
    status: Object.keys(status).map((key) => ({
      value: key,
      count: status[key],
    })),
    tags: Object.keys(tags).map((key) => ({
      value: key,
      count: tags[key],
    })),
  };
};

/**
 * Parse properties from query
 * @param query
 * example: max by(kube_cluster_name,kube_namespace,pod_name)(kubernetes_state_container_status_report_count_waiting{reason=\"crashloopbackoff\"})
 * @returns { "reason": "crashloopbackoff" }
 * example: kube_pod_container_status_waiting_reason{reason="CrashLoopBackOff",namespace="default",pod="test-5c7f9b9b7b-5j2xw",container="test"}
 * @returns { "reason": "CrashLoopBackOff", "namespace": "default", "pod": "test-5c7f9b9b7b-5j2xw", "container": "test" }
 * example: (avg by(kube_namespace,kube_deployment)(kubernetes_state_deployment_replicas_desired{})-avg by(kube_namespace,kube_deployment)(kubernetes_state_deployment_replicas_available{}))
 * @returns {}
 */
const parsePropertiesFromQuery = (query: string) => {
  const properties: { [key: string]: string } = {};
  const regex = /(\w+)=\"(\w+)\"/g;
  let match;
  while ((match = regex.exec(query)) !== null) {
    properties[match[1]] = match[2];
  }

  return properties;
};

export const getRulesProperties = (
  rules: RuleProps[],
): {
  [key: string]: ValueCount[];
} => {
  const allProperties: { [key: string]: number } = {};
  const services: ValueCount[] = [];
  const env: ValueCount[] = [];
  const scope: ValueCount[] = [];

  rules.forEach((rule: any) => {
    const properties = parsePropertiesFromQuery(rule.query);
    Object.keys(properties).forEach((key) => {
      const value = `${key}:${properties[key]}`;
      if (allProperties[value] === undefined) {
        allProperties[value] = 1;
      } else {
        allProperties[value] += 1;
      }
    });
  });

  Object.keys(allProperties).forEach((key) => {
    if (key === 'service') {
      services.push({ value: key, count: allProperties[key] });
    } else if (key === 'env') {
      env.push({ value: key, count: allProperties[key] });
    } else {
      scope.push({ value: key, count: allProperties[key] });
    }
  });

  return { services, env, scope };
};

export const getDateForQuery = (range: {
  from: number;
  to: number;
}): DateSelection => {
  const endTimeUnix = dayjs().subtract(range.to, 'seconds').unix();
  const startTimeUnix = dayjs().subtract(range.from, 'seconds').unix();

  return {
    endTimeUnix,
    startTimeUnix,
  };
};

export const mapMutedAlertsWithRules = (
  rules: RuleProps[],
  mutedAlerts: Array<any>,
): RuleProps[] => {
  const newRules = [...rules];
  mutedAlerts.forEach((mutedAlert) => {
    if (mutedAlert.status.state === 'active') {
      const matchers = mutedAlert.matchers;
      matchers.forEach((matcher) => {
        const ruleIndex = newRules.findIndex(
          (rule) => rule.name === matcher.value && matcher.name === 'alertname',
        );
        if (ruleIndex !== -1) {
          newRules[ruleIndex].mute = { status: true, muteId: mutedAlert.id };
        }
      });
    }
  });

  return newRules;
};

export const editMetricAlert = (
  row: RuleProps,
  navigate: NavigateFunction,
  addToast: (val: { text: string; status: string }) => void,
): void => {
  if (row.annotations?.alertType == 'anomaly') {
    addToast({
      text: 'this alert cant be modified. If change has to be made, then remove and recreate the alert.',
      status: 'warn',
    });
  } else {
    const encodeAlertTypeURI = encodeURIComponent(
      JSON.stringify({ value: 'metrics' }),
    );
    navigate(`/alerts/create?alertType=${encodeAlertTypeURI}`, { state: row });
  }
};

export const editSLOAlert = (
  row: RuleProps,
  navigate: NavigateFunction,
): void => {
  const encodeAlertTypeURI = encodeURIComponent(
    JSON.stringify({ value: 'slo' }),
  );

  const sloAlertData = {
    annotations: row.annotations,
    labels: row.labels,
    name: row.name,
    contactPointLabels: row.contactPointLabels,
    group: row.group,
    groupFile: row.groupFile,
    tags: row.tags,
    uid: row.uid,
  };
  const sloAlertDataURI = encodeURIComponent(JSON.stringify(sloAlertData));
  navigate(
    `/alerts/create?alertType=${encodeAlertTypeURI}&sloAlertData=${sloAlertDataURI}`,
  );
};

export const editLogAlert = (
  row: RuleProps,
  navigate: NavigateFunction,
): void => {
  const parsedExtraData = JSON.parse(row.annotations.extraData || '{}');
  const encodeAlertTypeURI = encodeURIComponent(
    JSON.stringify({ value: 'logs' }),
  );

  if (parsedExtraData.logQL) {
    navigate(
      `/alerts/create?alertType=${encodeAlertTypeURI}&logQL=${parsedExtraData.logQL}`,
      { state: row },
    );
  } else {
    const { filterByFacets, query, searchTerms } = parsedExtraData;
    navigate(
      `/alerts/create?alertType=${encodeAlertTypeURI}&filterByFacets=${encodeURIComponent(
        JSON.stringify(filterByFacets || []),
      )}&searchTerms=${encodeURIComponent(
        JSON.stringify(searchTerms || []),
      )}&=LogsMetricsQueries=${encodeURIComponent(
        JSON.stringify(query || []),
      )}`,
      { state: row },
    );
  }
};

export const getGlobalHistoryAlertHours = (timeStr: string): number => {
  const match = timeStr.match(/^now-(\d+)h$/);
  if (match) {
    return parseInt(match[1]);
  }
  return null;
};

export const getGlobalHistoryAlertMinutes = (timeStr: string): number => {
  const match = timeStr.match(/^now-(\d+)m$/);
  if (match) {
    return parseInt(match[1]);
  }
  return null;
};

export const formatInterval = (interval: number): string => {
  if (interval >= 1) {
    return `${Math.floor(interval)}m`;
  } else {
    return `${Math.floor(interval * 60)}s`;
  }
};

export const stepCalculator = (globalHistory: number): string => {
  const globalMinutes = globalHistory * 60;
  const nearestPowerOf2 = Math.pow(2, Math.round(Math.log2(globalMinutes)));
  const result = nearestPowerOf2 / 256;
  const intervalString = formatInterval(result);
  return intervalString;
};
