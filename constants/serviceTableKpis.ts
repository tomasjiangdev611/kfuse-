import { SelectedFacetValuesByName } from 'types';
import {
  buildPromQLFilterFromSelectedFacetValuesByName,
  formatDurationNs,
} from 'utils';

type ServiceQueryArgs = {
  property: string;
  rateInterval: string;
  service: string;
  stepInMs: number;
};

type ServicesQueryArgs = {
  rateInterval: string;
  selectedFacetValuesByName: SelectedFacetValuesByName;
  stepInMs: number;
};

export enum ServiceTableKpiKeys {
  apdex = 'apdex',
  errorRate = 'errorRate',
  maxLatency = 'maxLatency',
  p50latency = 'p50latency',
  p75latency = 'p75latency',
  p90latency = 'p90latency',
  p95latency = 'p95latency',
  p99latency = 'p99latency',
  requests = 'requests',
  requestsPerSecond = 'requestsPerSecond',
}

const renderCellLatency = ({ value }) =>
  typeof value === 'number' ? formatDurationNs(value * 1000000, 1, 1) : '';

const renderCellPercent = ({ value }) =>
  typeof value === 'number' ? `${Math.round(value * 100)}%` : '';

const renderCellToFixed = ({ value }) =>
  typeof value === 'number' ? `${value.toFixed(2)}` : '';

export const serviceTableKpis = [
  {
    key: ServiceTableKpiKeys.requests,
    label: 'Requests',
    renderCell: ({ value }) => (value ? value.toLocaleString() : '0'),
    servicesQuery: ({
      selectedFacetValuesByName,
      stepInMs,
    }: ServicesQueryArgs): string => {
      const filter = buildPromQLFilterFromSelectedFacetValuesByName(
        selectedFacetValuesByName,
      );
      return `ceil(sum by (service_name) (increase(spans_total${filter}[${stepInMs}ms])))`;
    },
    serviceQuery: ({ property, service, stepInMs }: ServiceQueryArgs): string =>
      `ceil(sum by (service_name, ${property}) (increase(spans_total{service_name="${service}"}[${stepInMs}ms])))`,
  },
  {
    key: ServiceTableKpiKeys.requestsPerSecond,
    label: 'Requests/s',
    servicesQuery: ({
      selectedFacetValuesByName,
      stepInMs,
    }: ServicesQueryArgs): string => {
      const filter = buildPromQLFilterFromSelectedFacetValuesByName(
        selectedFacetValuesByName,
      );
      return `sum by (service_name, span_type) (rate(spans_total${filter}[${stepInMs}ms]))`;
    },
    serviceQuery: ({ property, service, stepInMs }: ServiceQueryArgs): string =>
      `sum by (service_name, ${property}) (rate(spans_total{service_name="${service}"}[${stepInMs}ms]))`,
    renderCell: ({ value }) =>
      typeof value === 'number' ? `${value.toFixed(2)}/s` : '',
  },
  {
    key: ServiceTableKpiKeys.p50latency,
    label: 'p50 Latency',
    renderCell: renderCellLatency,
    servicesQuery: ({
      selectedFacetValuesByName,
      stepInMs,
    }: ServicesQueryArgs): string => {
      const filter = buildPromQLFilterFromSelectedFacetValuesByName(
        selectedFacetValuesByName,
      );
      return `histogram_quantile(0.50, sum(rate(span_latency_ms_bucket${filter}[${stepInMs}ms])) by (service_name, le))`;
    },
    serviceQuery: ({ property, service, stepInMs }: ServiceQueryArgs): string =>
      `histogram_quantile(0.50, sum(rate(span_latency_ms_bucket{service_name="${service}"}[${stepInMs}ms])) by (service_name, ${property}, le))`,
  },
  {
    key: ServiceTableKpiKeys.p75latency,
    label: 'p75 Latency',
    renderCell: renderCellLatency,
    servicesQuery: ({
      selectedFacetValuesByName,
      stepInMs,
    }: ServicesQueryArgs): string => {
      const filter = buildPromQLFilterFromSelectedFacetValuesByName(
        selectedFacetValuesByName,
      );
      return `histogram_quantile(0.75, sum(rate(span_latency_ms_bucket${filter}[${stepInMs}ms])) by (service_name, le))`;
    },
    serviceQuery: ({ property, service, stepInMs }: ServiceQueryArgs): string =>
      `histogram_quantile(0.75, sum(rate(span_latency_ms_bucket{service_name="${service}"}[${stepInMs}ms])) by (service_name, ${property}, le))`,
  },
  {
    key: ServiceTableKpiKeys.p90latency,
    label: 'p90 Latency',
    renderCell: renderCellLatency,
    servicesQuery: ({
      selectedFacetValuesByName,
      stepInMs,
    }: ServicesQueryArgs): string => {
      const filter = buildPromQLFilterFromSelectedFacetValuesByName(
        selectedFacetValuesByName,
      );
      return `histogram_quantile(0.90, sum(rate(span_latency_ms_bucket${filter}[${stepInMs}ms])) by (service_name, le))`;
    },
    serviceQuery: ({ property, service, stepInMs }: ServiceQueryArgs): string =>
      `histogram_quantile(0.90, sum(rate(span_latency_ms_bucket{service_name="${service}"}[${stepInMs}ms])) by (service_name, ${property}, le))`,
  },
  {
    key: ServiceTableKpiKeys.p95latency,
    label: 'p95 Latency',
    renderCell: renderCellLatency,
    servicesQuery: ({
      selectedFacetValuesByName,
      stepInMs,
    }: ServicesQueryArgs): string => {
      const filter = buildPromQLFilterFromSelectedFacetValuesByName(
        selectedFacetValuesByName,
      );
      return `histogram_quantile(0.95, sum(rate(span_latency_ms_bucket${filter}[${stepInMs}ms])) by (service_name, le))`;
    },
    serviceQuery: ({ property, service, stepInMs }: ServiceQueryArgs): string =>
      `histogram_quantile(0.95, sum(rate(span_latency_ms_bucket{service_name="${service}"}[${stepInMs}ms])) by (service_name, ${property}, le))`,
  },
  {
    key: ServiceTableKpiKeys.p99latency,
    label: 'p99 Latency',
    renderCell: renderCellLatency,
    servicesQuery: ({
      selectedFacetValuesByName,
      stepInMs,
    }: ServicesQueryArgs): string => {
      const filter = buildPromQLFilterFromSelectedFacetValuesByName(
        selectedFacetValuesByName,
      );
      return `histogram_quantile(0.99, sum(rate(span_latency_ms_bucket${filter}[${stepInMs}ms])) by (service_name, le))`;
    },
    serviceQuery: ({ property, service, stepInMs }: ServiceQueryArgs): string =>
      `histogram_quantile(0.99, sum(rate(span_latency_ms_bucket{service_name="${service}"}[${stepInMs}ms])) by (service_name, ${property}, le))`,
  },
  {
    key: ServiceTableKpiKeys.maxLatency,
    label: 'Max Latency',
    renderCell: renderCellLatency,
    servicesQuery: ({
      selectedFacetValuesByName,
      stepInMs,
    }: ServicesQueryArgs): string => {
      const filter = buildPromQLFilterFromSelectedFacetValuesByName(
        selectedFacetValuesByName,
      );
      return `max(max_over_time(span_max_latency_ms${filter}[${stepInMs}ms])) by (service_name)`;
    },
    serviceQuery: ({ property, service, stepInMs }: ServiceQueryArgs): string =>
      `max(max_over_time(span_max_latency_ms{service_name="${service}"}[${stepInMs}ms])) by (service_name, ${property})`,
  },
  {
    key: ServiceTableKpiKeys.errorRate,
    label: 'Error Rate',
    renderCell: renderCellPercent,
    servicesQuery: ({
      selectedFacetValuesByName,
      stepInMs,
    }: ServicesQueryArgs): string => {
      const filter = buildPromQLFilterFromSelectedFacetValuesByName(
        selectedFacetValuesByName,
      );
      return `sum by (service_name) (rate(span_errors_total${filter}[${stepInMs}ms])) / sum by (service_name) (rate(spans_total${filter}[${stepInMs}ms]))`;
    },
    serviceQuery: ({ property, service, stepInMs }: ServiceQueryArgs): string =>
      `sum by (service_name, ${property}) (rate(span_errors_total{service_name="${service}"}[${stepInMs}ms])) / sum by (service_name, ${property}) (rate(spans_total{service_name="${service}"}[${stepInMs}ms]))`,
  },
  {
    key: ServiceTableKpiKeys.apdex,
    label: 'APDEX',
    renderCell: renderCellToFixed,
    servicesQuery: ({
      selectedFacetValuesByName,
      stepInMs,
    }: ServicesQueryArgs): string => {
      const filter = buildPromQLFilterFromSelectedFacetValuesByName(
        selectedFacetValuesByName,
      );
      return `apdex(500, 2000, sum(rate(span_latency_ms_bucket${filter}[${stepInMs}ms])) by ( service_name, le))`;
    },
    serviceQuery: ({ property, service, stepInMs }: ServiceQueryArgs): string =>
      `apdex(500, 2000, sum by(service_name,${property},le) (rate(span_latency_ms_bucket{service_name="${service}"}[${stepInMs}ms])))`,
  },
];

export default serviceTableKpis;
