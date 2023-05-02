export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Any: any;
  Map: any;
  Time: any;
};

export type AttributeFilter = {
  eq?: InputMaybe<AttributeSelector>;
  neq?: InputMaybe<AttributeSelector>;
};

export type AttributeSelector = {
  key?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

export type Edge = {
  __typename?: 'Edge';
  endFp: Scalars['String'];
  hopTime: Scalars['Float'];
  startFp: Scalars['String'];
};

export type FacetName = {
  __typename?: 'FacetName';
  /** Count of log events with the given facet with log and topo filters applied */
  count?: Maybe<Scalars['Int']>;
  /** Name of the log facet */
  name: Scalars['String'];
  /** Component which the log facet belongs to */
  source: Scalars['String'];
  /** data type of the log facet */
  type: Scalars['String'];
};

export type FacetNameList = {
  __typename?: 'FacetNameList';
  /** Empty cursor indicates there is no more data */
  cursor?: Maybe<Scalars['String']>;
  /** List of facet names for a given page */
  facetNames?: Maybe<Array<FacetName>>;
};

export type FacetSelector = {
  /** Facet name input with facet name, type and component. type and component are empty for static facets like source, level etc */
  facetName: Scalars['String'];
  /** value to compare */
  value: Scalars['String'];
};

export type Filter = {
  ParentSpanIdFilter?: InputMaybe<IdFilter>;
  and?: InputMaybe<Array<Filter>>;
  attributeFilter?: InputMaybe<AttributeFilter>;
  not?: InputMaybe<Filter>;
  or?: InputMaybe<Array<Filter>>;
  serviceFilter?: InputMaybe<ServiceFilter>;
  spanIdFilter?: InputMaybe<IdFilter>;
  traceIdFilter?: InputMaybe<IdFilter>;
};

export type Fingerprint = {
  __typename?: 'Fingerprint';
  /** count of events with the fingerprint pattern */
  count?: Maybe<Scalars['Int']>;
  /** Fingerprint hash */
  hash?: Maybe<Scalars['String']>;
  /** Fingerprint pattern */
  pattern?: Maybe<Scalars['String']>;
  /** Source/component of Fingerprint */
  source?: Maybe<Scalars['String']>;
};

export type GroupCount = {
  __typename?: 'GroupCount';
  count: Scalars['Int'];
  key: Scalars['String'];
};

export type Grouping = {
  /** label or log facet name to group by */
  groups?: InputMaybe<Array<Scalars['String']>>;
  /** drop groups from grouping clause */
  without?: InputMaybe<Scalars['Boolean']>;
};

export type IdFilter = {
  id?: InputMaybe<Scalars['String']>;
};

export type LatencyBucket = {
  __typename?: 'LatencyBucket';
  bucketStart: Scalars['Float'];
  count: Scalars['Int'];
};

export type LatencyDistribution = {
  __typename?: 'LatencyDistribution';
  buckets?: Maybe<Array<Maybe<LatencyBucket>>>;
  percentiles?: Maybe<PercentileSummary>;
};

export type LatencyMetric = {
  __typename?: 'LatencyMetric';
  latency: Scalars['Float'];
};

export type LogEvent = {
  __typename?: 'LogEvent';
  facets: Scalars['Map'];
  fpHash: Scalars['String'];
  fpPattern: Scalars['String'];
  labels: Scalars['Map'];
  level: Scalars['String'];
  message: Scalars['String'];
  timestamp: Scalars['Time'];
};

export type LogEventList = {
  __typename?: 'LogEventList';
  /** opaque cursor returned to help in pagination; empty string means no more data */
  cursor: Scalars['String'];
  /** List of log events for a given page */
  events: Array<LogEvent>;
  /** Total number of log events for a given query */
  totalCount?: Maybe<Scalars['Int']>;
};

export type LogQuery = {
  and?: InputMaybe<Array<LogQuery>>;
  contains?: InputMaybe<FacetSelector>;
  endsWith?: InputMaybe<FacetSelector>;
  eq?: InputMaybe<FacetSelector>;
  gt?: InputMaybe<FacetSelector>;
  gte?: InputMaybe<FacetSelector>;
  keyExists?: InputMaybe<Scalars['String']>;
  kpl?: InputMaybe<Scalars['String']>;
  lt?: InputMaybe<FacetSelector>;
  lte?: InputMaybe<FacetSelector>;
  neq?: InputMaybe<FacetSelector>;
  not?: InputMaybe<LogQuery>;
  or?: InputMaybe<Array<LogQuery>>;
  regex?: InputMaybe<FacetSelector>;
  startsWith?: InputMaybe<FacetSelector>;
};

export type Mutation = {
  __typename?: 'Mutation';
  deleteMetrics: Scalars['Boolean'];
  /**
   * User can either select a facet to chart its metric (eg: Latency) or
   * search for a pattern/facets and chart log count as a metric
   */
  saveMetric: Scalars['Boolean'];
  saveTransaction: Scalars['Boolean'];
};


export type MutationDeleteMetricsArgs = {
  source: Scalars['String'];
};


export type MutationSaveMetricArgs = {
  dimensions?: InputMaybe<Array<Scalars['String']>>;
  filter?: InputMaybe<LogQuery>;
  grepPattern?: InputMaybe<Scalars['String']>;
  metricFacet?: InputMaybe<Scalars['String']>;
  metricName: Scalars['String'];
  source_types: Array<Scalars['String']>;
};


export type MutationSaveTransactionArgs = {
  txn: TransactionInput;
};

export enum NormalizeFunction {
  Bytes = 'bytes',
  Duration = 'duration'
}

export type PathStat = {
  __typename?: 'PathStat';
  durations?: Maybe<Array<TransactionDuration>>;
  edges?: Maybe<Array<Edge>>;
  pathId: Scalars['String'];
  percentileDurations?: Maybe<Array<PercentileDuration>>;
  totalTransactions?: Maybe<Scalars['Int']>;
};

export type PercentileDuration = {
  __typename?: 'PercentileDuration';
  example: TransactionDuration;
  percentileLabel: Scalars['String'];
};

export type PercentileSummary = {
  __typename?: 'PercentileSummary';
  max: Scalars['Float'];
  p50: Scalars['Float'];
  p75: Scalars['Float'];
  p90: Scalars['Float'];
  p95: Scalars['Float'];
  p99: Scalars['Float'];
};

export type Point = {
  __typename?: 'Point';
  ts: Scalars['Int'];
  value: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  aggregateTable?: Maybe<Array<TableEntry>>;
  aggregateTimeSeries?: Maybe<Array<TimeSeries>>;
  /** Facet Names that can be used to filter log results */
  getFacetNames: FacetNameList;
  /** Get count facet values for given time range with filter support */
  getFacetValueCounts: Array<Maybe<ValueCount>>;
  /** Get a list of Fingerprints from logs for a given time range with filter support */
  getFpList?: Maybe<Array<Maybe<Fingerprint>>>;
  /** Get label names */
  getLabelNames?: Maybe<Array<Scalars['String']>>;
  /** Get label values for a given label name */
  getLabelValues: Array<Maybe<ValueCount>>;
  /** Get a time series of metrics derived from logs for a given time range with filter support */
  getLogMetricsTimeSeries?: Maybe<Array<Maybe<TimeSeries>>>;
  /** Get logs based on time and log filters with sorting and limit support */
  getLogs: LogEventList;
  labelNames: Array<Maybe<Scalars['String']>>;
  labelValues: Array<Maybe<ValueCount>>;
  /** get latency distribution for a service */
  latencyDistribution?: Maybe<LatencyDistribution>;
  latencyRank?: Maybe<Scalars['Int']>;
  /** Get a list of saved metrics from logs. Optionally, provide source filter */
  listSavedMetrics?: Maybe<Array<SavedMetric>>;
  listTransactions?: Maybe<Array<Transaction>>;
  /** Logs for the underlying entity */
  logSample?: Maybe<Array<Maybe<LogEvent>>>;
  /** sources within this timestamp that are emitting logs */
  logSources?: Maybe<Array<Scalars['String']>>;
  /** Get list of services long with its metrics based on time and filter */
  services?: Maybe<Array<Service>>;
  spans?: Maybe<Array<Span>>;
  traces?: Maybe<Array<Trace>>;
};


export type QueryAggregateTableArgs = {
  aggregation: Scalars['String'];
  aggregationField: Scalars['String'];
  durationSecs?: InputMaybe<Scalars['Int']>;
  filter?: InputMaybe<Filter>;
  groupBy: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  timestamp?: InputMaybe<Scalars['Time']>;
};


export type QueryAggregateTimeSeriesArgs = {
  aggregation: Scalars['String'];
  aggregationField: Scalars['String'];
  durationSecs?: InputMaybe<Scalars['Int']>;
  filter?: InputMaybe<Filter>;
  groupBy: Scalars['String'];
  rollUpSeconds: Scalars['Int'];
  timestamp?: InputMaybe<Scalars['Time']>;
};


export type QueryGetFacetNamesArgs = {
  durationSecs?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  logQuery?: InputMaybe<LogQuery>;
  source?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['Time']>;
};


export type QueryGetFacetValueCountsArgs = {
  durationSecs?: InputMaybe<Scalars['Int']>;
  facetName: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  logQuery?: InputMaybe<LogQuery>;
  timestamp?: InputMaybe<Scalars['Time']>;
};


export type QueryGetFpListArgs = {
  durationSecs?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  logQuery?: InputMaybe<LogQuery>;
  offset?: InputMaybe<Scalars['Int']>;
  timestamp?: InputMaybe<Scalars['Time']>;
};


export type QueryGetLabelNamesArgs = {
  durationSecs?: InputMaybe<Scalars['Int']>;
  logQuery?: InputMaybe<LogQuery>;
  timestamp?: InputMaybe<Scalars['Time']>;
};


export type QueryGetLabelValuesArgs = {
  contains?: InputMaybe<Scalars['String']>;
  durationSecs?: InputMaybe<Scalars['Int']>;
  includeCount?: InputMaybe<Scalars['Boolean']>;
  labelName: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  logQuery?: InputMaybe<LogQuery>;
  timestamp?: InputMaybe<Scalars['Time']>;
};


export type QueryGetLogMetricsTimeSeriesArgs = {
  durationMs?: InputMaybe<Scalars['Int']>;
  facetName?: InputMaybe<Scalars['String']>;
  facetNormalizeFunction?: InputMaybe<NormalizeFunction>;
  logQuery?: InputMaybe<LogQuery>;
  lookBackMs: Scalars['Int'];
  rangeAggregate: Scalars['String'];
  rangeAggregateGrouping?: InputMaybe<Grouping>;
  stepMs: Scalars['Int'];
  timestamp?: InputMaybe<Scalars['Time']>;
  vectorAggregate?: InputMaybe<Scalars['String']>;
  vectorAggregateGrouping?: InputMaybe<Grouping>;
};


export type QueryGetLogsArgs = {
  cursor?: InputMaybe<Scalars['String']>;
  durationSecs?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<LogQuery>;
  sortBy?: InputMaybe<Scalars['String']>;
  sortOrder?: InputMaybe<SortOrder>;
  timestamp?: InputMaybe<Scalars['Time']>;
};


export type QueryLabelNamesArgs = {
  contains?: InputMaybe<Scalars['String']>;
  durationSecs?: InputMaybe<Scalars['Int']>;
  filter?: InputMaybe<Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  timestamp?: InputMaybe<Scalars['Time']>;
};


export type QueryLabelValuesArgs = {
  durationSecs?: InputMaybe<Scalars['Int']>;
  filter?: InputMaybe<Filter>;
  labelName: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  timestamp?: InputMaybe<Scalars['Time']>;
};


export type QueryLatencyDistributionArgs = {
  durationSecs?: InputMaybe<Scalars['Int']>;
  filter?: InputMaybe<Filter>;
  maxType?: InputMaybe<Scalars['String']>;
  numBuckets: Scalars['Int'];
  serviceName: Scalars['String'];
  spanName?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['Time']>;
};


export type QueryLatencyRankArgs = {
  durationSecs?: InputMaybe<Scalars['Int']>;
  filter?: InputMaybe<Filter>;
  inputDuration?: InputMaybe<Scalars['Int']>;
  serviceName: Scalars['String'];
  spanName: Scalars['String'];
  timestamp?: InputMaybe<Scalars['Time']>;
};


export type QueryListSavedMetricsArgs = {
  source?: InputMaybe<Scalars['String']>;
};


export type QueryLogSampleArgs = {
  durationSecs?: InputMaybe<Scalars['Int']>;
  fingerprints: Array<Scalars['String']>;
  query?: InputMaybe<LogQuery>;
  timestamp?: InputMaybe<Scalars['Time']>;
};


export type QueryLogSourcesArgs = {
  durationSecs?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<LogQuery>;
  timestamp?: InputMaybe<Scalars['Time']>;
};


export type QueryServicesArgs = {
  durationSecs?: InputMaybe<Scalars['Int']>;
  filter?: InputMaybe<Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  timestamp?: InputMaybe<Scalars['Time']>;
};


export type QuerySpansArgs = {
  durationSecs?: InputMaybe<Scalars['Int']>;
  filter?: InputMaybe<Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  timestamp?: InputMaybe<Scalars['Time']>;
};


export type QueryTracesArgs = {
  durationSecs?: InputMaybe<Scalars['Int']>;
  filter?: InputMaybe<Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  timestamp?: InputMaybe<Scalars['Time']>;
};

export type SavedMetric = {
  __typename?: 'SavedMetric';
  Dimensions?: Maybe<Array<Scalars['String']>>;
  Filter?: Maybe<Scalars['String']>;
  MetricFacet?: Maybe<Scalars['String']>;
  Name: Scalars['String'];
  Source: Scalars['String'];
};

export type Service = {
  __typename?: 'Service';
  errorsPerSecond: Scalars['Float'];
  name: Scalars['String'];
  p50: Scalars['Float'];
  p90: Scalars['Float'];
  p99: Scalars['Float'];
  requestsPerSecond: Scalars['Float'];
  type?: Maybe<Scalars['String']>;
};

export type ServiceFilter = {
  eq?: InputMaybe<ServiceSelector>;
  neq?: InputMaybe<ServiceSelector>;
};

export type ServiceSelector = {
  name?: InputMaybe<Scalars['String']>;
};

export enum SortOrder {
  Asc = 'Asc',
  Desc = 'Desc'
}

export type Span = {
  __typename?: 'Span';
  name?: Maybe<Scalars['String']>;
  attributes?: Maybe<Scalars['Map']>;
  endTimeNs?: Maybe<Scalars['Int']>;
  endpoint?: Maybe<Scalars['String']>;
  latency: Scalars['Float'];
  method?: Maybe<Scalars['String']>;
  parentSpanId: Scalars['String'];
  rootSpan?: Maybe<Scalars['Boolean']>;
  serviceName?: Maybe<Scalars['String']>;
  spanId: Scalars['String'];
  startTimeNs?: Maybe<Scalars['Int']>;
  statusCode?: Maybe<Scalars['String']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  getTransactions?: Maybe<TransactionReport>;
  liveGroupTail?: Maybe<GroupCount>;
  liveGroupTailWithKpl?: Maybe<GroupCount>;
  liveTail?: Maybe<LogEvent>;
  liveTailWithKpl?: Maybe<LogEvent>;
};


export type SubscriptionGetTransactionsArgs = {
  durationSecs?: InputMaybe<Scalars['Int']>;
  timestamp?: InputMaybe<Scalars['Time']>;
  transactionInput: TransactionInput;
};


export type SubscriptionLiveGroupTailArgs = {
  groupBy?: InputMaybe<Array<Scalars['String']>>;
  logQuery?: InputMaybe<LogQuery>;
};


export type SubscriptionLiveGroupTailWithKplArgs = {
  filter?: InputMaybe<Scalars['String']>;
  groupBy?: InputMaybe<Array<Scalars['String']>>;
};


export type SubscriptionLiveTailArgs = {
  logQuery?: InputMaybe<LogQuery>;
};


export type SubscriptionLiveTailWithKplArgs = {
  filter?: InputMaybe<Scalars['String']>;
};

export type TableEntry = {
  __typename?: 'TableEntry';
  groupVal: Scalars['String'];
  value: Scalars['Float'];
};

export type TimeSeries = {
  __typename?: 'TimeSeries';
  BucketStart: Scalars['Int'];
  GroupVal: Scalars['String'];
  Value: Scalars['Float'];
  points: Array<Point>;
  tags: Scalars['Map'];
};

export type Trace = {
  __typename?: 'Trace';
  span: Span;
  traceId: Scalars['String'];
  traceMetrics: TraceMetrics;
};

export type TraceMetrics = {
  __typename?: 'TraceMetrics';
  hostExecTime?: Maybe<Scalars['Map']>;
  serviceExecTime?: Maybe<Scalars['Map']>;
  spanCount?: Maybe<Scalars['Int']>;
};

export type TraceView = {
  spans: Span[];
  traceMetrics: TraceMetrics;
};

export type Transaction = {
  __typename?: 'Transaction';
  durationMetric: Scalars['String'];
  failureMetric: Scalars['String'];
  filter?: Maybe<Scalars['String']>;
  keys: Scalars['String'];
  name: Scalars['String'];
  path?: Maybe<Scalars['String']>;
};

export type TransactionDuration = {
  __typename?: 'TransactionDuration';
  duration: Scalars['Float'];
  endTs?: Maybe<Scalars['Int']>;
  group: Scalars['Map'];
  startTs?: Maybe<Scalars['Int']>;
};

export type TransactionGroup = {
  __typename?: 'TransactionGroup';
  group?: Maybe<Scalars['Map']>;
};

export type TransactionInput = {
  durationMetric: Scalars['String'];
  failureMetric: Scalars['String'];
  filter?: InputMaybe<Scalars['String']>;
  keys: Scalars['String'];
  name: Scalars['String'];
  path: Scalars['String'];
};

export type TransactionReport = {
  __typename?: 'TransactionReport';
  averageDuration?: Maybe<Scalars['Float']>;
  failedTransactions?: Maybe<Array<TransactionGroup>>;
  name: Scalars['String'];
  pathStats?: Maybe<Array<PathStat>>;
  totalFailedTransactions?: Maybe<Scalars['Int']>;
  totalTransactions?: Maybe<Scalars['Int']>;
};

export type ValueCount = {
  __typename?: 'ValueCount';
  /** Count of value based on entityQuery, logQuery and time range */
  count?: Maybe<Scalars['Int']>;
  /** Value of the label or facet */
  value: Scalars['String'];
};
