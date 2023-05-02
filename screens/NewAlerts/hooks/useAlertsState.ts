import { useToastmasterContext } from 'components';
import dayjs from 'dayjs';
import { useRequest, useSelectedFacetValuesByNameState } from 'hooks';
import { useState } from 'react';
import {
  getGrafanaAlertsStatus,
  getGrafanaMutedAlerts,
  getGrafanaAlertManager,
  muteGrafanaAlert,
  unmuteGrafanaAlert,
} from 'requests';
import { convertTimeStringToUnixUpcoming } from 'utils';
import { DateSelection, ValueCount } from 'types';

import { RuleProps } from '../types';
import { formatGrafanaAlertsRules, mapMutedAlertsWithRules } from '../utils';

const useAlertsState = () => {
  const { addToast } = useToastmasterContext();
  const selectedFacetValuesByNameState = useSelectedFacetValuesByNameState();
  const requestGrafanaAlertsRules = useRequest(getGrafanaAlertsStatus);
  const requestGrafanaMutedAlerts = useRequest(getGrafanaMutedAlerts);
  const requestsGrafanaAlertManager = useRequest(getGrafanaAlertManager);
  const unmuteGrafanaAlertRequest = useRequest(unmuteGrafanaAlert);
  const muteGrafanaAlertRequest = useRequest(muteGrafanaAlert);

  const [isLoading, setIsLoading] = useState(false);
  const [rules, setRules] = useState<RuleProps[]>([]);
  const [alertsProperties, setAlertsProperties] = useState<{
    [key: string]: ValueCount[];
  }>({ components: [], tags: [] });

  const getPredefinedFacetValues = (facetName: string) => () => {
    return new Promise((resolve) => {
      resolve(alertsProperties[facetName.toLocaleLowerCase()]);
    });
  };

  const reloadAlerts = async () => {
    setIsLoading(true);
    const datasets = await Promise.all([
      requestGrafanaAlertsRules.call('rules'),
      requestGrafanaMutedAlerts.call(),
      requestsGrafanaAlertManager.call('contact-list'),
    ]).catch(() => {
      setIsLoading(false);
      addToast({ status: 'error', text: 'Failed to load alerts' });
    });

    if (!datasets) {
      return;
    }

    const [rulesRes, mutedRes, contactPoints] = datasets;
    const contactPointsList: string[] = contactPoints.map(
      (contactPoint) => contactPoint.name,
    );
    const formattedRules = formatGrafanaAlertsRules(
      rulesRes,
      contactPointsList,
    );

    if (mutedRes && mutedRes.length > 0) {
      const rulesWithMutedStatus = mapMutedAlertsWithRules(
        formattedRules,
        mutedRes,
      );
      setRules(rulesWithMutedStatus);
    } else {
      setRules(formattedRules);
    }

    setIsLoading(false);
  };

  const unMuteAlert = (id: string) => {
    setIsLoading(true);
    return new Promise((resolve, reject) => {
      unmuteGrafanaAlertRequest
        .call(id)
        .then(() => {
          addToast({ text: 'Alert unmuted successfully', status: 'success' });
          resolve(true);
        })
        .catch(() => {
          setIsLoading(false);
          reject();
        });
    });
  };

  const muteAlert = (rule: RuleProps, date: DateSelection) => {
    const matchers = [
      { name: 'alertname', value: rule.name, isEqual: true, isRegex: false },
    ];

    Object.keys(rule.labels || {}).forEach((key) => {
      matchers.push({
        name: key,
        value: 'true',
        isEqual: true,
        isRegex: false,
      });
    });

    const positiveLabel = date.startLabel.replace('-', '+');
    const endsAtUnix = convertTimeStringToUnixUpcoming(positiveLabel);
    const payload = {
      matchers,
      startsAt: dayjs().toISOString(),
      endsAt: dayjs.unix(endsAtUnix).toISOString(),
      createdBy: 'admin',
      comment: 'Muted by admin',
    };

    setIsLoading(true);

    return new Promise((resolve, reject) => {
      muteGrafanaAlertRequest
        .call(payload)
        .then((res) => {
          addToast({ text: 'Alert muted successfully', status: 'success' });
          resolve(res);
        })
        .catch(() => {
          setIsLoading(false);
          reject();
        });
    });
  };

  return {
    isLoading,
    getPredefinedFacetValues,
    muteAlert,
    unMuteAlert,
    reloadAlerts,
    rules,
    requestGrafanaAlertsRules,
    selectedFacetValuesByNameState,
    setAlertsProperties,
    setIsLoading,
  };
};

export default useAlertsState;
