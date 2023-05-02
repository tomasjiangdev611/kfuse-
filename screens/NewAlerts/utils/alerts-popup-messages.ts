export const THRESHOLD_TITLE =
  'A threshold alert compares metric values to a static threshold.';
export const THRESHOLD_MESSAGE =
  'On each alert evaluation It will calculate the average/minimum/maximum/sum over the selected period and check if it is above/below the threshold. This is the standard alert case where you know what sorts of values are unexpected.';
export const THRESHOLD_DESCRIPTION =
  'An alert is triggered whenever a metric crosses a threshold.';
export const CHANGE_TITLE =
  'A change alert evaluates the difference between a value N minutes ago and now.';
export const CHANGE_MESSAGE =
  'On each alert evaluation It will calculate the raw difference (not absolute value) between the series now and N minutes ago then compute the average/minimum/maximum/sum over the selected period. An alert is triggered when this computed series crosses the threshold.';
export const CHANGE_DESCRIPTION =
  'An alert is triggered when the delta between values is higher than the threshold.';
export const OUTLIERS_TITLE =
  'Outlier monitors detect when a member of a group (e.g., hosts, availability zones, partitions) is behaving unusually compared to the rest.';
export const OUTLIERS_MESSAGE =
  'On each alert evaluation, It will check whether or not all groups are clustered together, exhibiting the same behavior. An alert is triggered whenever at least one group diverges from the rest of the groups.';
export const OUTLIERS_DESCRIPTION =
  'An alert is triggered whenever one member in a group behaves differently from its peers.';
export const ANOMALY_TITLE =
  'An anomaly alert uses past behavior to detect when a metric is behaving abnormally.';
export const ANOMALY_DESCRIPTION =
  'An alert is triggered whenever a metric deviates from an expected pattern.';
export const ANOMALY_MESSAGE =
  'Please see the details of each algorithm when selecting the algo name below "Set Conditions"';
export const RRCF_ALGORITHM_DESCRIPTION =
  'RRCF (Robust Random Cut Forest) is a machine learning algorithm used for detecting anomalies in large datasets. It uses a tree-based ensemble method to identify outliers based on their relative isolation within the dataset. The algorithm constructs a set of binary trees from random subsamples of the data, and determines the level of isolation of each point in the dataset by counting the number of trees that must be traversed before reaching that point. Anomalies are identified as points that require fewer traversals than the majority of points in the dataset, indicating that they are more isolated and potentially more unusual. The algorithm is robust to high-dimensional data, skewed distributions, and the presence of noisy or irrelevant features, making it well-suited for a wide range of applications in anomaly detection and outlier analysis.';
export const GLOBAL_HISTORY_DESCRIPTION =
  'Time window to use for the rolling dataset (from the metric query done over this time window). At any point in time, RRCF algo captures the signal behavior seen over this time window.';
export const LOCAL_HISTORY_DESCRIPTION =
  'Time window to use for capturing the signal behavior in recent past.';
export const SAVE_AS_METRIC_NAME_DESCRIPTION =
  'RRCF computed scores and anomaly computation are saved using this metric name (to maintain history beyond the global and local window)';
export const ANOMALY_INTERVAL_DESCRIPTION =
  'The interval at which this alert expression will be evaluated. This interval is automatically derived from the chosen global history time window';
export const BASIC_ALGORITHM_DESCRIPTION =
  'Basic uses rolling quantile to compute the expected range of values of a time series. It does not take into account of seasonality of the time series.';
export const BASIC_BOUNDS_DESCRIPTION =
  'The size of the expected range of values. This corresponds to the number of standard deviation from the expected value.';
export const BASIC_BAND_DESCRIPTION =
  'The threshold condition for triggering an alert. Upper considers points above the expected range of values as anomaly. Lower considers points below the expected range of values as anomaly. Both considers above and below the expected range of values as anomaly.';
export const BASIC_WINDOW_DESCRIPTION =
  'The time window to use for the rolling quantile computation.';
