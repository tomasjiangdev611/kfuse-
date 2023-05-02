import classNames from 'classnames';
import { CheckboxWithLabel } from 'components';
import React, { ReactElement } from 'react';

import useMetricsChartsModal from './hooks/useMetricsChartsModal';

const DISABLE_FUNCTION_LIST = true;

const MetricsChartsModalToolbar = ({
  metricsChartsModal,
}: {
  metricsChartsModal: ReturnType<typeof useMetricsChartsModal>;
}): ReactElement => {
  const {
    callPromqlQueryRange,
    compareToPrev,
    functionList,
    setCompareToPrev,
    setFunctionList,
  } = metricsChartsModal;

  const onCompareChange = (idx: number) => {
    const newCompareToPrev = [...compareToPrev];
    newCompareToPrev[idx].isActive = !newCompareToPrev[idx].isActive;
    setCompareToPrev(newCompareToPrev);
    callPromqlQueryRange();
  };

  const onFunctionChange = (idx: number, isActive: boolean) => {
    const newFunctionList = [...functionList];
    newFunctionList.forEach((item) => {
      item.isActive = false;
    });
    newFunctionList[idx].isActive = !isActive;
    setFunctionList(newFunctionList);
    callPromqlQueryRange();
  };

  return (
    <div className="new-metrics__chart__modal__toolbar">
      <div className="new-metrics__chart__modal__toolbar__title">
        Compare to Previous
      </div>
      <div className="new-metrics__chart__modal__toolbar__compare">
        {compareToPrev.map((item, idx) => {
          return (
            <div
              className="new-metrics__chart__modal__toolbar__compare__item"
              key={item.label}
            >
              <CheckboxWithLabel
                label={item.label}
                onChange={() => onCompareChange(idx)}
                value={item.isActive}
              />
            </div>
          );
        })}
      </div>
      {!DISABLE_FUNCTION_LIST && (
        <>
          <div className="new-metrics__chart__modal__toolbar__title">
            Functions
          </div>
          <div className="new-metrics__chart__modal__toolbar__function">
            {functionList.map((item, idx) => {
              return (
                <div
                  className="new-metrics__chart__modal__toolbar__function__item"
                  key={item.label}
                >
                  <button
                    className={classNames({
                      button: true,
                      'button--blue': item.isActive,
                    })}
                    onClick={() => onFunctionChange(idx, item.isActive)}
                  >
                    {item.label}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default MetricsChartsModalToolbar;
