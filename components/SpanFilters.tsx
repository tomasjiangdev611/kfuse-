import { useSpanFilters } from 'hooks';
import React from 'react';
import { SpanFilter } from 'types';
import CheckboxWithLabel from './CheckboxWithLabel';
import Select from './Select';

type Props = {
  spanFilters: ReturnType<typeof useSpanFilters>;
};

const labelBySpanFilter = {
  [SpanFilter.allSpans]: 'All Spans',
  [SpanFilter.traceRootSpans]: 'Trace Root Spans',
  [SpanFilter.serviceEntrySpans]: 'Service Entry Spans',
};

const SpanFilters = ({ spanFilters }: Props) => {
  const { isErrorOnlyChecked, onChangeError, spanFilter, setSpanFilter } =
    spanFilters;

  return (
    <div className="span-filters">
      <div className="span-filters__item">
        <CheckboxWithLabel
          label="Errors Only"
          onChange={onChangeError}
          value={isErrorOnlyChecked}
        />
      </div>
      <div className="span-filters__item">
        <Select
          onChange={setSpanFilter}
          options={[
            SpanFilter.allSpans,
            SpanFilter.serviceEntrySpans,
            SpanFilter.traceRootSpans,
          ].map((spanFilter) => ({
            label: labelBySpanFilter[spanFilter],
            value: spanFilter,
          }))}
          value={spanFilter}
        />
      </div>
    </div>
  );
};

export default SpanFilters;
