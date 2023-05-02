import { dateTimeFormat, colorsByLogLevel } from 'constants';
import { chartColors } from 'components';
import dayjs from 'dayjs';
import { DateSelection } from 'types/DateSelection';
import { Series } from 'uplot';
import { isNumber } from 'utils';
import { SunburstDataProps } from 'types';

export const getSeriesColor = (obj: { [key: string]: any }, index: number) => {
  if (
    obj.level &&
    colorsByLogLevel[obj.level] &&
    Object.keys(obj).length === 1
  ) {
    return colorsByLogLevel[obj.level];
  }
  return chartColors[index % chartColors.length];
};

const defaultSeriesFormatter = (
  idx: number,
  promIndex: number,
  metric: { [key: string]: any },
) => {
  const metricName = metric.__name__;
  delete metric.__name__;
  const isSeriesOutlier = metric['outlier'];
  const outlierSeriesWidth = isSeriesOutlier === 'true' ? 2.5 : 0.5;
  return {
    label: `${metricName ? metricName : ''}${JSON.stringify(metric)}`,
    points: { show: false },
    stroke: getSeriesColor(metric, idx),
    show: true,
    width: isSeriesOutlier ? outlierSeriesWidth : 1,
  };
};

export const transformTimeseriesDataset = ({
  datasets,
  date,
  seriesFormatter = defaultSeriesFormatter,
  step,
}: {
  datasets: { [key: number]: any };
  date: DateSelection;
  seriesFormatter?: (
    idx: number,
    promIndex: number,
    metric: { [key: string]: any },
  ) => Series;
  step: number;
}): { data: Array<any>; maxValue?: number; series: Series[] } => {
  const timestampBitmap: { [key: string]: boolean } = {};
  const data = [];
  const series: Series[] = [];
  let maxValue = 0;

  const datasetsKeys = Object.keys(datasets);
  datasetsKeys.forEach((key: any, idx) => {
    const dataset = datasets[key];
    const { metric, promIndex, values } = dataset;

    values.forEach((value) => {
      const [ts, val] = value;
      if (!timestampBitmap[ts]) {
        timestampBitmap[ts] = true;
      }
    });

    const serie = seriesFormatter(idx, promIndex, metric);
    series.push(serie);
  });

  const timestamps = Object.keys(timestampBitmap)
    .map((ts) => Number(ts))
    .sort();

  const { startTimeUnix, endTimeUnix } = date;
  const startTimestampData = timestamps[0];
  const endTimestampData = timestamps[timestamps.length - 1];

  // go back direction
  for (
    let timestampUnix = startTimestampData;
    timestampUnix >= startTimeUnix;
    timestampUnix -= step
  ) {
    timestamps.unshift(timestampUnix);
  }
  // go forward direction
  for (
    let timestampUnix = endTimestampData;
    timestampUnix <= endTimeUnix;
    timestampUnix += step
  ) {
    timestamps.push(timestampUnix);
  }

  data.push(timestamps);

  datasetsKeys.forEach((key: any) => {
    const dataset = datasets[key];
    const { metric, values } = dataset;
    const valueByTimestamp = values.reduce((obj, value) => {
      const [ts, val] = value;
      maxValue = Math.max(maxValue, Number(val));
      return { ...obj, [ts]: val };
    }, {});

    const timeseriesData = timestamps.map((ts) =>
      isNumber(valueByTimestamp[ts]) ? valueByTimestamp[ts] : undefined,
    );
    data.push(timeseriesData);
  });

  return { data, maxValue, series };
};

/**
 * Transform a prometheus dataset into a sunburst dataset
 * order -> ["host", "kube_cluster_name", "kube_namespace"]
 * result
 * {
 * name: "main",
 * children: [
 *  {
 *    name: "gke-demo-2-target-pool-1-20ce67e4-840g.us-west1-a.c.mvp-demo-301906.internal",
 *    children: [
 *    {
 *      name: "demo-2-target",
 *      children: [
 *        { name: "ambassador", size: 99255.00253125132}
 *        { name: "otel-trace", size: 2254755.6245866115}
 *        { name: "target", size: 178353440.98577636}
 *      ]
 *    },
 *  ]
 *  },
 *  {
 *    name: "gke-demo-2-n2-standard-16-2608eba9-0fss.us-west1-a.c.mvp-demo-301906.internal",
 *    children: [
 *      {
 *      name: "demo-2",
 *      children: [
 *          { name: "kfuse", size: 13254291.19550265}
 *        ]
 *      }
 *    ]
 *  }
 * ]
 * }
 *
 * exclude 0 value data
 * exclude when last level
 */
export const transformSunburstDataset = (
  datasets: Array<{
    metric: { [key: string]: string };
    value: [number, string];
  }>,
  labels?: string[],
  promql?: string,
): {
  data: SunburstDataProps;
  tableData: Array<any>;
} => {
  const order = labels || getAggregateLabelFromPromql(promql || '');
  const result: SunburstDataProps = { name: '', children: [] };
  datasets.forEach((dataset, idx) => {
    const { metric, value } = dataset;
    const size = parseFloat(value[1]);
    if (size === 0) {
      return;
    }
    let current = result;
    order.forEach((key) => {
      const name = metric[key];
      if (name === undefined) {
        return;
      }
      let child = current.children?.find((c) => c.name === name);
      if (!child) {
        child = { name, color: chartColors[idx % 10] };
        if (current.children) {
          current.children.push(child);
        } else {
          current.children = [child];
        }
      }
      current = child;
    });
    if (current.children) {
      current.children.push({ name: '', size });
    } else {
      current.size = size;
    }
  });

  const table = getSunburstTableData(result.children);
  // add percentage
  const total = table.reduce((acc, cur) => acc + cur.size, 0);
  table.forEach((r) => {
    r.percentage = (r.size / total) * 100;
  });

  return { data: result, tableData: table };
};

/**
 * Transform a sunburst dataset into a table dataset
 * dataset -> [
 *  {
 *    name: "gke-demo-2-target-pool-1-20ce67e4-840g.us-west1-a.c.mvp-demo-301906.internal",
 *    children: [
 *    {
 *      name: "demo-2-target",
 *      children: [
 *        { name: "ambassador", size: 99255.00253125132}
 *        { name: "otel-trace", size: 2254755.6245866115}
 *        { name: "target", size: 178353440.98577636}
 *      ]
 *    },
 *  ]
 *  },
 * ]
 * }
 *
 * result
 * [
 *  {
 *    metric_names: ["gke-demo-2-target-pool-1-20ce67e4-840g.us-west1-a.c.mvp-demo-301906.internal", "demo-2-target", "ambassador"],
 *    size: 99255.00253125132,
 *    color: "#000000"
 *  },
 *  {
 *    metric_names: ["gke-demo-2-target-pool-1-20ce67e4-840g.us-west1-a.c.mvp-demo-301906.internal", "demo-2-target", "otel-trace"],
 *    size: 2254755.6245866115,
 *    color: "#000000"
 *  },
 *  {
 *    metric_names: ["gke-demo-2-target-pool-1-20ce67e4-840g.us-west1-a.c.mvp-demo-301906.internal", "demo-2-target", "target"],
 *    size: 178353440.98577636,
 *    color: "#000000"
 *  }
 * ]
 */
const getSunburstTableData = (
  dataset: SunburstDataProps[],
  metricNames: string[] = [],
) => {
  const result: Array<{
    metric_names: string[];
    size: number;
    percentage?: number;
  }> = [];
  dataset.forEach((d) => {
    if (d.children) {
      result.push(
        ...getSunburstTableData(d.children, [...metricNames, d.name]),
      );
    } else {
      result.push({
        metric_names: [...metricNames, d.name],
        size: d.size,
      });
    }
  });

  return result;
};

/**
 * Get aggreate by from promql
 * @param promql
 * example -> avg by (app_kubernetes_io_component,kube_app_component,kube_cluster_name) ( container_cpu_usage )
 * result ["app_kubernetes_io_component", "kube_app_component", "kube_cluster_name"]
 * example -> avg by (container_name,container_id) ( container_io_write )
 * result ["container_name", "container_id"]
 */
const getAggregateLabelFromPromql = (promql: string): string[] => {
  const aggregateLabels = [];
  const aggregateBys = ['avg by', 'sum by', 'max by', 'min by'];
  const aggregateBy = aggregateBys.find((by) => promql.includes(by));

  if (aggregateBy) {
    const aggregateByIndex = promql.indexOf(aggregateBy);
    const start = promql.indexOf('(', aggregateByIndex);
    const end = promql.indexOf(')', aggregateByIndex);
    const aggregateByStr = promql.substring(start + 1, end);
    aggregateLabels.push(...aggregateByStr.split(','));
  }

  return aggregateLabels;
};

export const transformInstantQueryToTable = (
  datasets: Array<{
    metric: { [key: string]: string };
    value: [number, string];
  }>,
): Array<any> => {
  const result: { [key: string]: any }[] = datasets.map((dataset) => {
    const { metric, value } = dataset;
    const row = { ...metric };
    const [timestamp, valueStr] = value;
    row.time = dayjs(timestamp * 1000).format(dateTimeFormat);
    row.value = parseFloat(valueStr).toFixed(2);
    return row;
  });

  result.sort((a, b) => b.value - a.value);

  return result;
};
