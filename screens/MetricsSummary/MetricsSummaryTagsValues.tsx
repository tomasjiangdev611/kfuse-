import { PopoverTrigger } from 'components';
import React, { ReactElement, useState } from 'react';

import MetricSummaryTagsValuePopoverPanel from './MetricSummaryTagsValuePopoverPanel';

const TagText = ({ metricName, tag }: { metricName: string; tag: string }) => {
  return (
    <PopoverTrigger
      component={MetricSummaryTagsValuePopoverPanel}
      props={{ metricName, tagValue: tag }}
      popoverPanelClassName="metrics-summary__popover-panel"
      width={240}
    >
      <div className="chip">
        {tag.length > 45 ? `${tag.slice(0, 45)}...` : `${tag}`}
      </div>
    </PopoverTrigger>
  );
};

const MetricsSummaryMetricDetailsTagValues = ({
  metricName,
  tagName,
  values,
}: {
  metricName: string;
  tagName: string;
  values: string[];
}): ReactElement => {
  const [showAll, setShowAll] = useState(false);
  const valuesLength = values.length;
  const trimmerdValues = valuesLength > 4 ? values.slice(0, 4) : values;
  const leftValues = valuesLength > 4 ? values.slice(4, valuesLength) : [];

  return (
    <div className="metrics-summary__tags__values">
      {trimmerdValues.map((val) => (
        <TagText
          metricName={metricName}
          key={`${tagName}:${val}`}
          tag={`${tagName}:${val}`}
        />
      ))}
      {showAll &&
        leftValues.map((val) => (
          <TagText
            metricName={metricName}
            key={`${tagName}:${val}`}
            tag={`${tagName}:${val}`}
          />
        ))}
      {valuesLength > 4 && (
        <div
          key={`${valuesLength - 4} more`}
          className="chip metrics-summary__tags__values__more"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show less' : `${valuesLength - 4} more`}
        </div>
      )}
    </div>
  );
};

export default MetricsSummaryMetricDetailsTagValues;
