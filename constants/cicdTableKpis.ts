import dayjs from 'dayjs';
import { formatMilliseconds } from 'screens/Logs/utils';
import { SelectedFacetValuesByName } from 'types';
import { lastRunDuration } from '../utils/timeNs';
import {
  buildPromQLFilterFromSelectedFacetValuesByName,
  duration,
} from 'utils';

const cicdTableKpis = [
  {
    key: 'executions',
    label: 'Executions',
    servicesQuery: (
      timeDuration: string,
      selectedFacetValuesByName: SelectedFacetValuesByName,
    ) => {
      const filter = buildPromQLFilterFromSelectedFacetValuesByName(
        selectedFacetValuesByName,
      );
      return `ceil(sum by (service_name) (increase(spans_total${filter}[${timeDuration}])))`;
    },
    serviceQuery: (property: string, service: string, timeDuration: string) =>
      `ceil(sum by (service_name, ${property}) (increase(spans_total{service_name="${service}"}[${timeDuration}])))`,
    renderCell: ({ value }) => Object.entries(value)[1][1].requests,
  },
  {
    key: 'failurePercentage',
    label: 'Failure %',
    servicesQuery: (
      timeDuration: string,
      selectedFacetValuesByName: SelectedFacetValuesByName,
    ) => {
      const filter = buildPromQLFilterFromSelectedFacetValuesByName(
        selectedFacetValuesByName,
      );
      return `sum by (service_name) (increase(span_errors_total${filter}[${timeDuration}])) / sum by (service_name) (increase(spans_total${filter}[${timeDuration}]))`;
    },
    serviceQuery: (property: string, service: string, timeDuration: string) =>
      `sum by (service_name, ${property}) (increase(span_errors_total{service_name="${service}"}[${timeDuration}])) / sum by (service_name, ${property}) (increase(spans_total{service_name="${service}"}[${timeDuration}]))`,

    renderCell: ({ value }) =>
      Object.entries(value)[1][1].errorRate
        ? `${Math.round(Object.entries(value)[1][1].errorRate * 100)}%`
        : `0%`,
  },
  {
    key: 'averageBuildDuration',
    label: 'Avg Build Duration',
    servicesQuery: (
      timeDuration: string,
      selectedFacetValuesByName: SelectedFacetValuesByName,
    ) => {
      const filter = buildPromQLFilterFromSelectedFacetValuesByName(
        selectedFacetValuesByName,
      );
      return `histogram_quantile(0.50, sum(rate(span_latency_ms_bucket${filter}[${timeDuration}])) by (service_name, le))`;
    },
    serviceQuery: (property: string, service: string, timeDuration: string) =>
      `histogram_quantile(0.50, sum(rate(span_latency_ms_bucket{service_name="${service}"}[${timeDuration}])) by (service_name, ${property}, le))`,
    renderCell: ({ value }) =>
      Object.entries(value)[1][1].p50latency
        ? formatMilliseconds(Object.entries(value)[1][1].p50latency)
        : '0s',
  },
  {
    key: 'p95Duration',
    label: 'p95 Duration',
    servicesQuery: (
      timeDuration: string,
      selectedFacetValuesByName: SelectedFacetValuesByName,
    ) => {
      const filter = buildPromQLFilterFromSelectedFacetValuesByName(
        selectedFacetValuesByName,
      );
      return `histogram_quantile(0.95, sum(rate(span_latency_ms_bucket${filter}[${timeDuration}])) by (service_name, le))`;
    },
    serviceQuery: (property: string, service: string, timeDuration: string) =>
      `histogram_quantile(0.95, sum(rate(span_latency_ms_bucket{service_name="${service}"}[${timeDuration}])) by (service_name, ${property}, le))`,
    renderCell: ({ value }) =>
      Object.entries(value)[1][1].p95latency
        ? formatMilliseconds(Object.entries(value)[1][1].p95latency)
        : '0s',
  },
  {
    key: 'lastBuild',
    label: 'Last Build',
    servicesQuery: (
      timeDuration: string,
      selectedFacetValuesByName: SelectedFacetValuesByName,
    ) => {
      const filter = buildPromQLFilterFromSelectedFacetValuesByName(
        selectedFacetValuesByName,
      );
      return `histogram_quantile(0.95, sum(rate(span_latency_ms_bucket${filter}[${timeDuration}])) by (service_name, le))`;
    },
    serviceQuery: (property: string, service: string, timeDuration: string) =>
      `histogram_quantile(0.95, sum(rate(span_latency_ms_bucket{service_name="${service}"}[${timeDuration}])) by (service_name, ${property}, le))`,
    renderCell: ({ value }) => value.span.attributes.status,
  },
  {
    key: 'duration',
    label: 'Duration',
    servicesQuery: (
      timeDuration: string,
      selectedFacetValuesByName: SelectedFacetValuesByName,
    ) => {
      const filter = buildPromQLFilterFromSelectedFacetValuesByName(
        selectedFacetValuesByName,
      );
      return `histogram_quantile(0.99, sum(rate(span_latency_ms_bucket${filter}[${timeDuration}])) by (service_name, le))`;
    },
    serviceQuery: (property: string, service: string, timeDuration: string) =>
      `histogram_quantile(0.99, sum(rate(span_latency_ms_bucket{service_name="${service}"}[${timeDuration}])) by (service_name, ${property}, le))`,
    renderCell: ({ value }) =>
      duration(value.span.startTimeNs, value.span.endTimeNs),
  },
  {
    key: 'LastRun',
    label: 'Last Run',
    servicesQuery: (
      timeDuration: string,
      selectedFacetValuesByName: SelectedFacetValuesByName,
    ) => {
      const filter = buildPromQLFilterFromSelectedFacetValuesByName(
        selectedFacetValuesByName,
      );

      return `sum by (service_name) (rate(spans_total${filter}[${timeDuration}]))`;
    },
    serviceQuery: (property: string, service: string, timeDuration: string) =>
      `sum by (service_name, ${property}) (rate(spans_total{service_name="${service}"}[${timeDuration}]))`,

    renderCell: ({ value }) =>
      lastRunDuration(value.span.startTimeNs, dayjs().unix() * 1000 * 1000000) +
      ' ago',
  },
];

export default cicdTableKpis;
