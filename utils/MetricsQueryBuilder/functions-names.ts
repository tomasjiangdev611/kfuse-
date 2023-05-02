import { FunctionNamesProps } from 'types/MetricsQueryBuilder';

const functionsNames: FunctionNamesProps[] = [
  {
    name: 'Anomalies',
    category: 'Algorithms',
    description:
      'Overlay a gray band on the metric showing the expected behavior of a series based on past.',
    expression: 'anomalies()',
    shortName: 'anomalies',
    vectorType: 'range',
  },
  {
    name: 'Average',
    category: 'Aggregation',
    description: '',
    expression: 'avg_by()',
    shortName: 'avg_by',
    vectorType: 'range',
  },
  {
    name: 'Minimum',
    category: 'Aggregation',
    description: '',
    expression: 'min_by()',
    shortName: 'min_by',
    vectorType: 'range',
  },
  {
    name: 'Maximum',
    category: 'Aggregation',
    description: '',
    expression: 'max_by()',
    shortName: 'max_by',
    vectorType: 'range',
  },
  {
    name: 'Sum',
    category: 'Aggregation',
    description: '',
    expression: 'sum_by()',
    shortName: 'sum_by',
    vectorType: 'range',
  },
  {
    name: 'Count',
    category: 'Aggregation',
    description: '',
    expression: 'count_by()',
    shortName: 'count_by',
    vectorType: 'range',
  },
  {
    name: 'Standard Variance',
    category: 'Aggregation',
    description: '',
    expression: 'stdvar_by()',
    shortName: 'stdvar_by',
    vectorType: 'range',
  },
  {
    name: 'Standard Deviation',
    category: 'Aggregation',
    description: '',
    expression: 'stddev_by()',
    shortName: 'stddev_by',
    vectorType: 'range',
  },
  {
    name: 'Quantile',
    category: 'Aggregation',
    description: '',
    expression: 'quantile_by()',
    shortName: 'quantile_by',
    vectorType: 'range',
  },
  {
    name: 'Outliers',
    category: 'Algorithms',
    description: 'Highlight outliers series.',
    expression: 'outliers()',
    shortName: 'outliers',
    vectorType: 'range',
  },
  {
    name: 'Absolute Value',
    category: 'Arithmetic',
    description: 'Absolute value of the metric',
    expression: 'abs()',
    shortName: 'abs',
    vectorType: 'instant',
  },
  {
    name: 'Exponential',
    category: 'Arithmetic',
    description: 'calculates the exponential function for all elements in v',
    expression: 'exp()',
    shortName: 'exp',
    vectorType: 'instant',
  },
  {
    name: 'Floor',
    category: 'Arithmetic',
    description:
      'Rounds the sample values of all elements in v down to the nearest integer.',
    expression: 'floor()',
    shortName: 'floor',
    vectorType: 'instant',
  },
  {
    name: 'Histogram Quantile',
    category: 'Arithmetic',
    description:
      'calculates the φ-quantile (0 ≤ φ ≤ 1) from the buckets b of a histogram.',
    expression: 'histogram_quantile(φ, le)',
    shortName: 'histogram_quantile',
    vectorType: 'range',
  },
  {
    name: 'Log 2',
    category: 'Arithmetic',
    description: 'Log 2 of the metric',
    expression: 'log2()',
    shortName: 'log2',
    vectorType: 'instant',
  },
  {
    name: 'Log 10',
    category: 'Arithmetic',
    description: 'Log 10 of the metric',
    expression: 'log10()',
    shortName: 'log10',
    vectorType: 'instant',
  },
  {
    name: 'Scalar',
    category: 'Arithmetic',
    description:
      'Given a single-element input vector, scalar(v instant-vector) returns the sample value of that single element as a scalar.',
    expression: 'scalar()',
    shortName: 'scalar',
    vectorType: 'instant',
  },
  {
    name: 'ln',
    category: 'Arithmetic',
    description: 'Calculates the natural logarithm for all elements in v',
    expression: 'ln()',
    shortName: 'ln',
    vectorType: 'instant',
  },
  {
    name: 'Round',
    category: 'Arithmetic',
    description:
      'Rounds the sample values of all elements in v to the nearest integer.',
    expression: 'round()',
    shortName: 'round',
    vectorType: 'range',
  },
  {
    name: 'SGN',
    category: 'Arithmetic',
    description:
      'Returns a vector with all sample values converted to their sign.',
    expression: 'sgn()',
    shortName: 'sgn',
    vectorType: 'instant',
  },
  {
    name: 'Square Root',
    category: 'Arithmetic',
    description: 'Calculates the square root of all elements in v',
    expression: 'sqrt()',
    shortName: 'sqrt',
    vectorType: 'instant',
  },
  {
    name: 'Ceil',
    category: 'Arithmetic',
    description:
      'Rounds the sample values of all elements in v up to the nearest integer.',
    expression: 'ceil()',
    shortName: 'ceil',
    vectorType: 'instant',
  },
  {
    name: 'Timestamp',
    category: 'Arithmetic',
    description:
      'Returns the timestamp of each of the samples of the given vector as the number of seconds since January 1, 1970 UTC.',
    expression: 'timestamp()',
    shortName: 'timestamp',
    vectorType: 'instant',
  },
  // {
  //   name: 'Day before',
  //   category: 'Timeshift',
  //   description: 'Shifts the time range by one day',
  //   expression: 'offset 1d',
  //   shortName: 'day_before',
  //   vectorType: 'instant',
  // },
  // {
  //   name: 'Hour before',
  //   category: 'Timeshift',
  //   description: 'Shifts the time range by one hour',
  //   expression: 'offset 1h',
  //   shortName: 'hour_before',
  //   vectorType: 'instant',
  // },
  // {
  //   name: 'Month before',
  //   category: 'Timeshift',
  //   description: 'Shifts the time range by one month',
  //   expression: 'offset 4w',
  //   shortName: 'month_before',
  //   vectorType: 'instant',
  // },
  // {
  //   name: 'Week before',
  //   category: 'Timeshift',
  //   description: 'Shifts the time range by one week',
  //   expression: 'offset 1w',
  //   shortName: 'week_before',
  //   vectorType: 'instant',
  // },
  {
    name: 'Count non zero',
    category: 'Count',
    description: 'Compute count of all non-zero values.',
    expression: 'count_nonzero()',
    shortName: 'count_nonzero',
    vectorType: 'instant',
  },
  {
    name: 'Count not null',
    category: 'Count',
    description: 'Compute count of all non-null values.',
    expression: 'count_not_null()',
    shortName: 'count_not_null',
    vectorType: 'range',
  },
  {
    name: 'Absent',
    category: 'Count',
    description:
      'Returns an empty vector if the vector passed to it has any elements and a 1-element vector with the value 1 if the vector passed to it has no elements.',
    expression: 'absent()',
    shortName: 'absent',
    vectorType: 'instant',
  },
  {
    name: 'Absent Over Time',
    category: 'Count',
    description:
      'Returns an empty vector if the range vector passed to it has any elements and a 1-element vector with the value 1 if the range vector passed to it has no elements.',
    expression: 'absent_over_time()',
    shortName: 'absent_over_time',
    vectorType: 'range',
  },
  {
    name: 'Changes',
    category: 'Count',
    description:
      'Returns the number of times the timeseries value has changed within the provided time range as an instant vector.',
    expression: 'changes()',
    shortName: 'changes',
    vectorType: 'range',
  },
  {
    name: 'Resets',
    category: 'Count',
    description:
      'For each input time series, resets(v range-vector) returns the number of counter resets within the provided time range as an instant vector.',
    expression: 'resets()',
    shortName: 'resets',
    vectorType: 'range',
  },
  {
    name: 'Day of week',
    category: 'Time',
    description:
      'Returns the day of the month for each of the given times in UTC. Returned values are from 1 to 31.',
    expression: 'day_of_week()',
    shortName: 'day_of_week',
    vectorType: 'range',
  },
  {
    name: 'Day of month',
    category: 'Time',
    description:
      'Returns the day of the week for each of the given times in UTC. Returned values are from 0 to 6, where 0 means Sunday etc.',
    expression: 'day_of_month()',
    shortName: 'day_of_month',
    vectorType: 'range',
  },
  {
    name: 'Day of year',
    category: 'Time',
    description:
      'Returns the day of the year for each of the given times in UTC. Returned values are from 1 to 365 for non-leap years, and 1 to 366 in leap years.',
    expression: 'day_of_year()',
    shortName: 'day_of_year',
    vectorType: 'range',
  },
  {
    name: 'Days in month',
    category: 'Time',
    description:
      'Returns number of days in the month for each of the given times in UTC. Returned values are from 28 to 31.',
    expression: 'days_in_month()',
    shortName: 'days_in_month',
    vectorType: 'range',
  },
  {
    name: 'Hour',
    category: 'Time',
    description:
      'Returns the hour of the day for each of the given times in UTC.',
    expression: 'hour()',
    shortName: 'hour',
    vectorType: 'range',
  },
  {
    name: 'Minute',
    category: 'Time',
    description:
      'Returns the minute of the hour for each of the given times in UTC.',
    expression: 'minute()',
    shortName: 'minute',
    vectorType: 'range',
  },
  {
    name: 'Month',
    category: 'Time',
    description:
      'Returns the month of the year for each of the given times in UTC.',
    expression: 'month()',
    shortName: 'month',
    vectorType: 'range',
  },
  {
    name: 'Year',
    category: 'Time',
    description: 'Returns the year for each of the given times in UTC.',
    expression: 'year()',
    shortName: 'year',
    vectorType: 'range',
  },
  {
    name: 'Diff',
    category: 'Rate',
    description: 'Graph the delta of the metric.',
    expression: 'delta()',
    shortName: 'diff',
    vectorType: 'range',
  },
  {
    name: 'Derivative',
    category: 'Rate',
    description: 'Graph the derivative (diff/dt) of the metric.',
    expression: 'deriv()',
    shortName: 'deriv',
    vectorType: 'range',
  },
  {
    name: 'Monotonic Diff',
    category: 'Rate',
    description:
      'Graph the delta of the metric like diff() but only if the delta is positive.',
    expression: 'idelta()',
    shortName: 'monotonic_diff',
    vectorType: 'range',
  },
  {
    name: 'Irate',
    category: 'Rate',
    description:
      'Calculates the per-second instant rate of increase of the time series in the range vector. This is based on the last two data points. Breaks in monotonicity (such as counter resets due to target restarts) are automatically adjusted for.',
    expression: 'irate()',
    shortName: 'irate',
    vectorType: 'range',
  },
  {
    name: 'Per hour',
    category: 'Rate',
    description: 'Graph the rate at which the metric is changing per hour.',
    expression: 'rate()',
    shortName: 'rate_per_hour',
    vectorType: 'range',
  },
  {
    name: 'Per minute',
    category: 'Rate',
    description: 'Graph the rate at which the metric is changing per minute.',
    expression: 'rate()',
    shortName: 'rate_per_minute',
    vectorType: 'range',
  },
  {
    name: 'Per second',
    category: 'Rate',
    description: 'Graph the rate at which the metric is changing per second.',
    expression: 'rate()',
    shortName: 'rate_per_second',
    vectorType: 'range',
  },
  {
    name: 'Increase',
    category: 'Rate',
    description:
      'Increase(v range-vector) calculates the increase in the time series in the range vector.',
    expression: 'increase()',
    shortName: 'increase',
    vectorType: 'range',
  },
  {
    name: 'Clamp Max',
    category: 'Exclusion',
    description:
      'Set any metric values over a threshold value to equal that value.',
    expression: 'clamp_max()',
    shortName: 'clamp_max',
    vectorType: 'range',
  },
  {
    name: 'Clamp Min',
    category: 'Exclusion',
    description:
      'Set any metric values under a threshold value to equal that value.',
    expression: 'clamp_min()',
    shortName: 'clamp_min',
    vectorType: 'range',
  },
  {
    name: 'Cutoff Max',
    category: 'Exclusion',
    description: 'Remove metric values over a threshold value.',
    expression: 'cutoff_max()',
    shortName: 'cutoff_max',
    vectorType: 'range',
  },
  {
    name: 'Cutoff Min',
    category: 'Exclusion',
    description: 'Remove metric values under a threshold value.',
    expression: 'cutoff_min()',
    shortName: 'cutoff_min',
    vectorType: 'range',
  },
  {
    name: 'Clamp',
    category: 'Exclusion',
    description:
      'Clamps the sample values of all elements in v to have a lower limit of min and an upper limit of max.',
    expression: 'clamp()',
    shortName: 'clamp',
    vectorType: 'range',
  },
  {
    name: 'Top K',
    category: 'Rank',
    description: 'Graph the top N elements.',
    expression: 'topk()',
    shortName: 'topk',
    vectorType: 'range',
  },
  {
    name: 'Sort',
    category: 'Rank',
    description:
      'Returns vector elements sorted by their sample values, in ascending order.',
    expression: 'sort()',
    shortName: 'sort',
    vectorType: 'range',
  },
  {
    name: 'Sort Desc',
    category: 'Rank',
    description:
      'Returns vector elements sorted by their sample values, in descending order.',
    expression: 'sort_desc()',
    shortName: 'sort_desc',
    vectorType: 'range',
  },
  {
    name: 'Average Over Time',
    category: 'Rollup',
    description: 'The average value of all points in the specified interval.',
    expression: 'avg_over_time()',
    shortName: 'avg_over_time',
    vectorType: 'range',
  },
  {
    name: 'Min Over Time',
    category: 'Rollup',
    description: 'The minimum value of all points in the specified interval.',
    expression: 'min_over_time()',
    shortName: 'min_over_time',
    vectorType: 'range',
  },
  {
    name: 'Max Over Time',
    category: 'Rollup',
    description: 'The maximum value of all points in the specified interval.',
    expression: 'max_over_time()',
    shortName: 'max_over_time',
    vectorType: 'range',
  },
  {
    name: 'Sum Over Time',
    category: 'Rollup',
    description: 'The sum of all values in the specified interval.',
    expression: 'sum_over_time()',
    shortName: 'sum_over_time',
    vectorType: 'range',
  },
  {
    name: 'Count Over Time',
    category: 'Rollup',
    description: 'The count of all values in the specified interval.',
    expression: 'count_over_time()',
    shortName: 'count_over_time',
    vectorType: 'range',
  },
  {
    name: 'Quantile Over Time',
    category: 'Rollup',
    description:
      'The φ-quantile (0 ≤ φ ≤ 1) of the values in the specified interval.',
    expression: 'quantile_over_time()',
    shortName: 'quantile_over_time',
    vectorType: 'range',
  },
  {
    name: 'Deviation Over Time',
    category: 'Rollup',
    description:
      'The population standard deviation of the values in the specified',
    expression: 'stddev_over_time()',
    shortName: 'stddev_over_time',
    vectorType: 'range',
  },
  {
    name: 'Variance Over Time',
    category: 'Rollup',
    description:
      'The population standard variance of the values in the specified interval.',
    expression: 'stdvar_over_time()',
    shortName: 'stdvar_over_time',
    vectorType: 'range',
  },
  {
    name: 'Last Over Time',
    category: 'Rollup',
    description: 'The most recent point value in specified interval.',
    expression: 'last_over_time()',
    shortName: 'last_over_time',
    vectorType: 'range',
  },
  {
    name: 'Predict Linear',
    category: 'Regression',
    description:
      'Predicts the value of time series t seconds from now, based on the range vector v, using simple linear regression.',
    expression: 'predict_linear()',
    shortName: 'predict_linear',
    vectorType: 'range',
  },
  {
    name: 'Holt Winters',
    category: 'Smoothing',
    description:
      'holt_winters(v range-vector, sf scalar, tf scalar) produces a smoothed value for time series based on the range in v. The lower the smoothing factor sf, the more importance is given to old data. The higher the trend factor tf, the more trends in the data is considered. Both sf and tf must be between 0 and 1.',
    expression: 'holt_winters()',
    shortName: 'holt_winters',
    vectorType: 'range',
  },
  {
    name: 'Acos',
    category: 'Trigonometric',
    description: 'Calculates the arccosine of all elements in v',
    expression: 'acos()',
    shortName: 'acos',
    vectorType: 'instant',
  },
  {
    name: 'Acosh',
    category: 'Trigonometric',
    description:
      'Calculates the inverse hyperbolic cosine of all elements in v',
    expression: 'acosh()',
    shortName: 'acosh',
    vectorType: 'instant',
  },
  {
    name: 'Asin',
    category: 'Trigonometric',
    description: 'Calculates the arcsine of all elements in v',
    expression: 'asin()',
    shortName: 'asin',
    vectorType: 'instant',
  },
  {
    name: 'Asinh',
    category: 'Trigonometric',
    description: 'Calculates the inverse hyperbolic sine of all elements in v',
    expression: 'asinh()',
    shortName: 'asinh',
    vectorType: 'instant',
  },
  {
    name: 'Atan',
    category: 'Trigonometric',
    description: 'Calculates the arctangent of all elements in v',
    expression: 'atan()',
    shortName: 'atan',
    vectorType: 'instant',
  },
  {
    name: 'Atanh',
    category: 'Trigonometric',
    description:
      'Calculates the inverse hyperbolic tangent of all elements in v',
    expression: 'atanh()',
    shortName: 'atanh',
    vectorType: 'instant',
  },
  {
    name: 'Cos',
    category: 'Trigonometric',
    description: 'Calculates the cosine of all elements in v',
    expression: 'cos()',
    shortName: 'cos',
    vectorType: 'instant',
  },
  {
    name: 'Cosh',
    category: 'Trigonometric',
    description: 'Calculates the hyperbolic cosine of all elements in v',
    expression: 'cosh()',
    shortName: 'cosh',
    vectorType: 'instant',
  },
  {
    name: 'Sin',
    category: 'Trigonometric',
    description: 'calculates the sine of all elements in v',
    expression: 'sin()',
    shortName: 'sin',
    vectorType: 'instant',
  },
  {
    name: 'Sinh',
    category: 'Trigonometric',
    description: 'calculates the hyperbolic sine of all elements in v',
    expression: 'sinh()',
    shortName: 'sinh',
    vectorType: 'instant',
  },
  {
    name: 'Tan',
    category: 'Trigonometric',
    description: 'calculates the tangent of all elements in v',
    expression: 'tan()',
    shortName: 'tan',
    vectorType: 'instant',
  },
  {
    name: 'Tanh',
    category: 'Trigonometric',
    description: 'calculates the hyperbolic tangent of all elements in v',
    expression: 'tanh()',
    shortName: 'tanh',
    vectorType: 'instant',
  },
];

export default functionsNames;