import { Span } from 'types';

export enum Attribute {
  ci_test = 'ci_test',
  endpoint = 'endpoint',
  error = 'error',
  hostname = 'hostname',
  httpMethod = 'http.method',
  httpStatus_code = 'http.status_code',
  httpUrl = 'http.url',
  kubeClusterName = 'kube_cluster_name',
  kubeDeployment = 'kube_deployment',
  kubeNamespace = 'kube_namespace',
  method = 'method',
  region = 'region',
  samplerParam = 'sampler.param',
  samplerType = 'sampler.type',
  serviceName = 'service_name',
  spanName = 'span_name',
  spanType = 'span_type',
  statusCode = 'status_code',
  traceId = 'trace_id',
  version = 'version',
  service = 'service',
}

export type RelatedSpansBySpanId = { [key: string]: string[] };
export type SpanBitMap = { [key: string]: Span };
export type SpanRow = string[];
export type SpanRows = SpanRow[];

export type Zoom = { scale: number };
