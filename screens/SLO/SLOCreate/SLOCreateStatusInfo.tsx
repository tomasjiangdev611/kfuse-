import React, { ReactElement } from 'react';
import { IoIosWarning } from 'react-icons/io';
import { convertNumberToReadableUnit, getStatusAndErrorBudget } from 'utils';

import { useCreateSLOState } from '../hooks';
import { TooltipTrigger } from 'components/TooltipTrigger';

const SLOCreateStatusInfo = ({
  createSLOState,
}: {
  createSLOState: ReturnType<typeof useCreateSLOState>;
}): ReactElement => {
  const {
    denominatorQueryState,
    getFormValue,
    numeratorQueryState,
    sloResult,
  } = createSLOState;
  const statusErrorBudget = getStatusAndErrorBudget(
    sloResult,
    getFormValue('objective'),
  );

  const getExplorerLink = () => {
    const numeratorQuery = numeratorQueryState.queries;
    const denominatorQuery = denominatorQueryState.queries;

    const combinedQueries = [...numeratorQuery, ...denominatorQuery];
    const queryURI = decodeURIComponent(JSON.stringify(combinedQueries));

    return `#/metrics?metricsQueries=${queryURI}`;
  };

  return (
    <div className="slo__create__result-info">
      <div className="slo__create__result-info__text-title">
        Get started with SLOs
      </div>
      <div className="slo__create__result-info__description">
        A Service Level Objective (SLO) is a target value or value range for the
        level of service that is being provided. SLOs have a definition of good
        events and bad events, as well as an objective, which is the percentage
        of total events which should fall in the good category.
      </div>
      <div className="slo__create__result-info__explorer">
        Status and Error Budget estimates are based on the past 24 hours of
        data,{' '}
        <a
          className="link"
          href={getExplorerLink()}
          target="_blank"
          rel="noreferrer"
        >
          open in metrics explorer
        </a>{' '}
        to see more.
      </div>
      <div className="slo__create__result-info__result">
        <div>
          <div className="slo__create__result-info__title">STATUS</div>
          <div className="slo__create__result-info__value">
            {statusErrorBudget ? (
              <div
                className="slo__create__result-info__value"
                style={{ color: statusErrorBudget.statusColor }}
              >
                {statusErrorBudget.status}
              </div>
            ) : (
              <TooltipTrigger
                className="slo__create__result-info__value-error"
                tooltip="Status value is zero"
              >
                <IoIosWarning />
              </TooltipTrigger>
            )}
          </div>
        </div>
        <div>
          <div className="slo__create__result-info__title">ERROR BUDGET</div>
          {statusErrorBudget ? (
            <div
              className="slo__create__result-info__value"
              style={{ color: statusErrorBudget.errorBudgetColor }}
            >
              {statusErrorBudget.errorBudget}&nbsp;
              {/* <span className="slos__error__budget__requests__details">
                (
                {`${convertNumberToReadableUnit(
                  statusErrorBudget.errorCount,
                  5,
                )} reqs`}
                )
              </span> */}
            </div>
          ) : (
            <TooltipTrigger
              className="slo__create__result-info__value-error"
              tooltip="Error budget value is zero"
            >
              <IoIosWarning />
            </TooltipTrigger>
          )}
        </div>
      </div>
    </div>
  );
};

export default SLOCreateStatusInfo;
