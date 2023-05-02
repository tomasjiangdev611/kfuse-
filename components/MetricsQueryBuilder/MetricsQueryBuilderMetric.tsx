import classNames from 'classnames';
import { Input, usePopoverContext } from 'components';
import { useMetricsQueryStateV2 } from 'hooks';
import { debounce } from 'lodash';
import React, {
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import MetricsQueryBuilderMetricPanel from './MetricsQueryBuilderMetricPanel';

const MetricsQueryBuilderMetric = ({
  editableMetrics,
  metric,
  queryIndex,
  metricsQueryState,
}: {
  editableMetrics: boolean;
  metric: string;
  queryIndex: number;
  metricsQueryState: ReturnType<typeof useMetricsQueryStateV2>;
}): ReactElement => {
  const popover = usePopoverContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchMetric, setSearchMetric] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const {
    callSeriesQuery,
    getMetricsListRequest,
    labelValueList,
    metricsList,
    openMetricUsingTags,
    updateQuery,
    seriesList,
  } = metricsQueryState;

  const metricsListOptions = useMemo(() => {
    if (searchMetric) {
      return metricsList.filter(
        (metric) => metric.label.indexOf(searchMetric) > -1,
      );
    }
    return metricsList;
  }, [metricsList, searchMetric]);

  const renderPanel = () => {
    popover.open({
      component: MetricsQueryBuilderMetricPanel,
      element: inputRef.current,
      props: {
        isLoading: getMetricsListRequest.isLoading,
        labelValueList,
        metricsList: metricsListOptions,
        onHover,
        onClick: (metricName: string) => {
          updateQuery(queryIndex, 'metric', metricName);
          popover.close();
        },
        onTagClick,
        seriesList,
      },
      popoverPanelClassName: 'popover__panel--overflow',
    });
  };

  const onHover = (metricName: string) => {
    debounce(() => callSeriesQuery(-1, metricName), 1000)();
  };

  const onTagClick = (metricName: string, tagName: string) => {
    openMetricUsingTags(queryIndex, metricName, tagName);
    popover.close();
  };

  useEffect(() => {
    if (metricsListOptions.length > 0 && isFocused) {
      renderPanel();
      setIsFocused(true);
    }
  }, [seriesList, labelValueList, searchMetric]);

  useEffect(() => {
    if (isFocused) {
      renderPanel();
    }
  }, [metricsList]);

  return (
    <Input
      className={classNames({
        'input--naked metrics__query-builder__query-item__metric': true,
        'input--disabled': !editableMetrics,
      })}
      disabled={!editableMetrics}
      onBlur={() => {
        popover.close();
        setIsFocused(false);
      }}
      onChange={(val) => setSearchMetric(val)}
      onFocus={() => {
        renderPanel();
        setIsFocused(true);
      }}
      placeholder="Select a metric"
      ref={inputRef}
      type="text"
      value={isFocused ? searchMetric : metric}
    />
  );
};

export default MetricsQueryBuilderMetric;
