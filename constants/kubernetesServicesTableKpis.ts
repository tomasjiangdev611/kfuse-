import { SelectedFacetValuesByName } from 'types';
import {
  buildPromQLClausesFromSelectedFacetValuesByName,
  formatDurationNs,
} from 'utils';

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

export const kubernetesServicesTableKpis = [
  {
    key: ServiceTableKpiKeys.requestsPerSecond,
    label: 'Requests/s',
    servicesQuery: ({
      selectedFacetValuesByName,
      stepInMs,
    }: ServicesQueryArgs): string => {
      const filterClauses = buildPromQLClausesFromSelectedFacetValuesByName(
        selectedFacetValuesByName,
      );
      const filterClausesJoined = filterClauses.length
        ? `${filterClauses.join(',')},`
        : '';
      return `sum by(kube_cluster_name, kube_namespace, service_name, server_ip, protocol)(rate(request_count{${filterClausesJoined}kube_service!="datadog-agent-kube-state-metrics", kube_service!="kfuse-agent", server_ip=~".+"}[${stepInMs}ms]))`;
    },
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
      const filterClauses = buildPromQLClausesFromSelectedFacetValuesByName(
        selectedFacetValuesByName,
      );
      const filterClausesJoined = filterClauses.length
        ? `${filterClauses.join(',')},`
        : '';
      return `histogram_quantile(0.5, sum by(kube_cluster_name, kube_namespace, service_name, server_ip, protocol, le) (rate(latency_count{${filterClausesJoined}kube_service!="datadog-agent-kube-state-metrics", kube_service!="kfuse-agent", server_ip=~".+"}[${stepInMs}ms]))) / 1000000`;
    },
  },
  // {
  //   key: ServiceTableKpiKeys.p75latency,
  //   label: 'p75 Latency',
  //   renderCell: renderCellLatency,
  //   servicesQuery: ({
  //     selectedFacetValuesByName,
  //     stepInMs,
  //   }: ServicesQueryArgs): string => {
  //     const filter = buildPromQLFilterFromSelectedFacetValuesByName(
  //       selectedFacetValuesByName,
  //     );
  //     return `histogram_quantile(0.75, sum(rate(span_latency_ms_bucket${filter}[${stepInMs}ms])) by (service_name, le))`;
  //   },
  // },
  // {
  //   key: ServiceTableKpiKeys.p90latency,
  //   label: 'p90 Latency',
  //   renderCell: renderCellLatency,
  //   servicesQuery: ({
  //     selectedFacetValuesByName,
  //     stepInMs,
  //   }: ServicesQueryArgs): string => {
  //     const filter = buildPromQLFilterFromSelectedFacetValuesByName(
  //       selectedFacetValuesByName,
  //     );
  //     return `histogram_quantile(0.90, sum(rate(span_latency_ms_bucket${filter}[${stepInMs}ms])) by (service_name, le))`;
  //   },
  // },
  // {
  //   key: ServiceTableKpiKeys.p95latency,
  //   label: 'p95 Latency',
  //   renderCell: renderCellLatency,
  //   servicesQuery: ({
  //     selectedFacetValuesByName,
  //     stepInMs,
  //   }: ServicesQueryArgs): string => {
  //     const filter = buildPromQLFilterFromSelectedFacetValuesByName(
  //       selectedFacetValuesByName,
  //     );
  //     return `histogram_quantile(0.95, sum(rate(span_latency_ms_bucket${filter}[${stepInMs}ms])) by (service_name, le))`;
  //   },
  // },
  {
    key: ServiceTableKpiKeys.p99latency,
    label: 'p99 Latency',
    renderCell: renderCellLatency,
    servicesQuery: ({
      selectedFacetValuesByName,
      stepInMs,
    }: ServicesQueryArgs): string => {
      const filterClauses = buildPromQLClausesFromSelectedFacetValuesByName(
        selectedFacetValuesByName,
      );
      const filterClausesJoined = filterClauses.length
        ? `${filterClauses.join(',')},`
        : '';
      return `histogram_quantile(0.99, sum by(kube_cluster_name, kube_namespace, service_name, server_ip, protocol, le) (rate(latency_count{${filterClausesJoined}kube_service!="datadog-agent-kube-state-metrics", kube_service!="kfuse-agent", server_ip=~".+"}[${stepInMs}ms]))) / 1000000`;
    },
  },
  {
    key: ServiceTableKpiKeys.errorRate,
    label: 'Error Rate',
    renderCell: renderCellPercent,
    servicesQuery: ({
      selectedFacetValuesByName,
      stepInMs,
    }: ServicesQueryArgs): string => {
      const filterClauses = buildPromQLClausesFromSelectedFacetValuesByName(
        selectedFacetValuesByName,
      );
      const filterClausesJoined = filterClauses.length
        ? `${filterClauses.join(',')},`
        : '';
      return `sum by(kube_cluster_name, kube_namespace, service_name, server_ip)(rate(error{${filterClausesJoined}response_code=~".+",kube_service!="datadog-agent-kube-state-metrics", kube_service!="kfuse-agent"}[${stepInMs}ms]))/sum by(kube_cluster_name, kube_namespace, service_name, server_ip)(rate(request_count{${filterClausesJoined}server_ip=~".+",kube_service!="datadog-agent-kube-state-metrics", kube_service!="kfuse-agent"}[${stepInMs}ms]))`;
    },
  },
];

export default kubernetesServicesTableKpis;
