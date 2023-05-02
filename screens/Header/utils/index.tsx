import React from 'react';
import { NavigateFunction } from 'react-router-dom';
import { Play, Search } from 'react-feather';
import { AiOutlineLineChart } from 'react-icons/ai';
import { IoFingerPrintOutline } from 'react-icons/io5';
import { CgArrowsExchangeAlt } from 'react-icons/cg';
import { TracesTab } from 'types';
import { pickUrlSearchParamsByKeys } from 'utils';

import { SubMenuProps } from '../types';

export const metricsSubmenu = (navigate: NavigateFunction): SubMenuProps[] => [
  {
    key: 'Explorer',
    label: 'Explorer',
    route: '/metrics',
  },
  {
    key: 'Summary',
    label: 'Summary',
    route: '/metrics/summary',
  },
  {
    key: 'Dashboard',
    label: 'Dashboard',
    route: '/metrics/dashboard/lists',
  },
];

export const eventsSubmenu = (navigate: NavigateFunction): SubMenuProps[] => [
  {
    key: 'Explorer',
    label: 'Explorer',
    route: '/events',
  },
  {
    key: 'Analytics',
    label: 'Analytics',
    route: '/events/analytics',
  },
];

export const grafanaSubmenu = (navigate: NavigateFunction): SubMenuProps[] => [
  {
    key: 'grafana-metrics',
    label: 'Metrics',
    route: '/grafana-metrics',
  },
  {
    key: 'grafana-logs',
    label: 'Logs',
    route: '/grafana-logs',
  },
];

export const apmSubmenu = (
  navigate: NavigateFunction,
  urlSearchParams: URLSearchParams,
): SubMenuProps[] => [
  {
    key: 'services',
    label: 'Services',
    route: `/apm/services${pickUrlSearchParamsByKeys(urlSearchParams, [
      'date',
    ])}`,
  },
  {
    key: 'traces',
    label: 'Traces',
    route: `/apm/traces/${TracesTab.list}${pickUrlSearchParamsByKeys(
      urlSearchParams,
      ['date'],
    )}`,
  },
  {
    key: 'traces-analytics',
    label: 'Trace Analytics',
    route: `/apm/traces/${TracesTab.timeseries}${pickUrlSearchParamsByKeys(
      urlSearchParams,
      ['date'],
    )}`,
  },
  {
    key: 'traces-service-map',
    label: 'Service Map',
    route: `/apm/traces/${TracesTab.serviceMap}${pickUrlSearchParamsByKeys(
      urlSearchParams,
      ['date'],
    )}`,
  },
  {
    key: 'slo',
    label: 'SLOs',
    route: `/apm/slo`,
  },
];

export const cicdSubmenu = (
  navigate: NavigateFunction,
  urlSearchParams: URLSearchParams,
): SubMenuProps[] => [
  {
    key: 'pipelines',
    label: 'Pipelines',
    route: '/cicd',
  },
  {
    key: 'pipelineExecutions',
    label: 'Pipeline Executions',
    route: '/cicd',
  },
];

export const infrastructureSubmenu = (
  navigate: NavigateFunction,
): SubMenuProps[] => [
  // {
  //   key: 'infrastructure',
  //   label: 'Serverless',
  //   route: '/serverless',
  // },
  {
    key: 'infrastructure',
    label: 'Kubernetes',
    route: '/kubernetes',
  },
];

export const logsSubmenu = (navigate: NavigateFunction): SubMenuProps[] => [
  {
    key: 'search',
    icon: <Search size={16} />,
    label: 'Search',
    route: '/logs?search=true',
  },
  {
    key: 'fingerprints',
    icon: <IoFingerPrintOutline size={16} />,
    label: 'Fingerprints',
    route: '/logs/fingerprints',
  },
  {
    key: 'live-tail',
    icon: <Play size={16} />,
    label: 'Live Tail',
    route: '/logs?live-tail=true',
  },
  // {
  //   key: 'transactions',
  //   icon: <CgArrowsExchangeAlt size={16} />,
  //   label: 'Transactions',
  //   route: '/transactions',
  // },
  {
    key: 'logs-analytics',
    icon: <AiOutlineLineChart size={16} />,
    label: 'Analytics',
    route: '/logs/chart',
  },
];

export const alertsSubmenu = (navigate: NavigateFunction): SubMenuProps[] => [
  {
    key: 'rule',
    label: 'Alert Rules',
    route: '/alerts',
  },
  {
    key: 'alerts/contacts',
    label: 'Contact Points',
    route: 'alerts/contacts',
  },
];

export const kfuseSubmenu = (navigate: NavigateFunction): SubMenuProps[] => [
  {
    key: 'control-plane-overview',
    label: 'Kloudfuse Overview',
    route: '/kfuse/overview',
  },
  {
    key: 'control-plane-metrics',
    label: 'Metrics',
    route: '/kfuse/metrics',
  },
  {
    key: 'control-plane-events',
    label: 'Events',
    route: '/kfuse/events',
  },
  {
    key: 'control-plane-logs',
    label: 'Logs',
    route: '/kfuse/logs',
  },
  {
    key: 'control-plane-traces',
    label: 'Traces',
    route: '/kfuse/traces',
  },
  {
    key: 'control-plane-system',
    label: 'System',
    route: '/kfuse/system',
  },
  {
    key: 'control-plane-pinot',
    label: 'Pinot',
    route: '/kfuse/pinot',
  },
  {
    key: 'control-plane-kafka',
    label: 'Kafka',
    route: '/kfuse/kafka',
  },
];

export const kubernetesSubmenu = (
  navigate: NavigateFunction,
  urlSearchParams: URLSearchParams,
): SubMenuProps[] => [
  {
    key: 'services',
    label: 'Services',
    route: `/analytics/services${pickUrlSearchParamsByKeys(urlSearchParams, [
      'date',
    ])}`,
  },
  {
    key: 'analytics-hawkeye',
    label: 'Hawkeye',
    route: '/kfuse/hawkeye',
  },
  {
    key: 'analytics-bullseye',
    label: 'Bullseye',
    route: '/analytics/services/bullseye',
  },
];
