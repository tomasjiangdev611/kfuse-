import React, { ReactElement } from 'react';
import { X } from 'react-feather';
import { Metric, SecondsFromNowLabelsByValue, Widget as WidgetType } from 'types';
import { useModalsContext } from 'components';
import WidgetVisualization from './WidgetVisualization';

type Props = {
  filteredMetrics: Metric[];
  widget?: WidgetType;
};

const WidgetFullSizeModal = ({
  filteredMetrics,
  widget,
}: Props): ReactElement => {
  const modals = useModalsContext();
  const { secondsFromNow } = widget;

  return (
    <div className="modal modal--full widget-full-size-modal">
      <div className="modal__header">
        <div className="modal__header__text" />
        <button onClick={modals.pop}>
          <X size={16} />
        </button>
      </div>
      <div className="modal__body widget-full-size-modal__body">
        <div className="widget__header">
          <div className="widget__metrics">
            {filteredMetrics.map((metric: Metric, i: number) => (
              <div className="widget__metrics__metric-name" key={i}>
                {metric.metricName || metric.promqlQuery}
              </div>
            ))}
          </div>
          <div className="widget__seconds-from-now">
            {SecondsFromNowLabelsByValue[secondsFromNow]}
          </div>
        </div>
        <div className="widget-full-size-modal__widget-visualization">
          <WidgetVisualization widget={widget} />
        </div>
      </div>
    </div>
  );
};

export default WidgetFullSizeModal;
