import React, { ReactElement } from 'react';
import { convertNumberToReadableUnit } from 'utils/formatNumber';

type Props = {
  days?: number;
  target?: number;
  statusErrorBudget?: {
    status: string;
    statusColor: string;
    errorBudget: string;
    errorBudgetColor: string;
    errorCount: number;
  };
  primary?: boolean;
};

const SLODetailsObjective = ({
  days,
  primary,
  statusErrorBudget,
  target,
}: Props): ReactElement => {
  return (
    <div>
      <>
        <div className="slos__target__value__main__container">
          <div className="slos__target__value__sub__container">
            <div className="slos__past__days__details">Past {days} days</div>
            {primary ? (
              <div className="slos__primary__details">Primary</div>
            ) : (
              <div className="slos__primary__unavailable"></div>
            )}
          </div>
          <div className="slos__target__details">{target}%</div>
          <div
            className="slos__status__details"
            style={{ color: statusErrorBudget.statusColor }}
          >
            {statusErrorBudget.status}
          </div>
          <div
            className="slos__error__budget__details__container"
            style={{ color: statusErrorBudget.errorBudgetColor }}
          >
            <div className="slos__error__budget__details">
              {statusErrorBudget.errorBudget}
            </div>
            &nbsp;
            {/* <div className="slos__error__budget__requests__details">
              (
              {`${convertNumberToReadableUnit(
                statusErrorBudget.errorCount,
                5,
              )} req`}
              )
            </div> */}
          </div>
        </div>
      </>
    </div>
  );
};

export default SLODetailsObjective;
