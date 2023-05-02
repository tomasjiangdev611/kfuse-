import { Input } from 'components';
import { useMetricsQueryStateV2 } from 'hooks';
import React, { ReactElement } from 'react';
import { X } from 'react-feather';
import { DateSelection, ExplorerQueryProps } from 'types';
import { queryRangeTimeDurationV2 } from 'utils';

const MetricsQueryBuilderCustomStep = ({
  date,
  metricsQueryState,
  query,
  queryIndex,
}: {
  date: DateSelection;
  metricsQueryState: ReturnType<typeof useMetricsQueryStateV2>;
  query: ExplorerQueryProps;
  queryIndex: number;
}): ReactElement => {
  const { updateQuery } = metricsQueryState;

  const hanldeCustomStep = () => {
    if (query.steps !== null) {
      updateQuery(queryIndex, 'steps', null);
    } else {
      const { endTimeUnix, startTimeUnix } = date;
      const step = queryRangeTimeDurationV2(startTimeUnix, endTimeUnix);
      updateQuery(queryIndex, 'steps', step);
    }
  };

  return (
    <div className="metrics__query-builder__custom-step">
      {query.steps !== null && (
        <div className="metrics__query-builder__custom-step__panel">
          <div className="metrics__query-builder__custom-step__panel__label">
            Seconds
          </div>
          <div className="metrics__query-builder__custom-step__panel__input">
            <Input
              className="input--no-border"
              onChange={(val) => updateQuery(queryIndex, 'steps', val)}
              placeholder="step (s)"
              type="text"
              value={`${query.steps}`}
            />
          </div>
          <div
            onClick={() => hanldeCustomStep()}
            className="metrics__query-builder__custom-step__panel__close"
          >
            <X />
          </div>
        </div>
      )}
      {query.steps === null && (
        <div
          onClick={() => hanldeCustomStep()}
          className="metrics__query-builder__custom-step__trigger"
        >
          steps
        </div>
      )}
    </div>
  );
};

export default MetricsQueryBuilderCustomStep;
