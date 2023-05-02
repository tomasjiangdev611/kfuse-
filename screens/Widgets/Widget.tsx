import { useModalsContext } from 'components';
import React, { ReactNode } from 'react';
import { Maximize2 } from 'react-feather';
import { Metric, SecondsFromNowLabelsByValue } from 'types';
import { Widget as WidgetType } from './types';
import WidgetFullSizeModal from './WidgetFullSizeModal';
import WidgetMorePopover from './WidgetMorePopover';
import WidgetVisualization from './WidgetVisualization';

type Props = {
  editWidget: () => void;
  removeWidget: () => void;
  widget: WidgetType;
};

const Widget = ({ editWidget, removeWidget, widget }: Props): ReactNode => {
  const modals = useModalsContext();
  const { metrics, promqlQuery, secondsFromNow, shouldUsePromqlQuery } = widget;

  const filteredMetrics = metrics.filter(
    (metric) =>
      metric.metricName || (metric.shouldUsePromqlQuery && metric.promqlQuery),
  );

  const openWidgetFullSizeModal = () => {
    modals.push(
      <WidgetFullSizeModal
        filteredMetrics={filteredMetrics}
        widget={widget}
      />,
    );
  };

  return (
    <div className="widget">
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
        <div className="widget__tools">
          <button
            className="widget__tools__item"
            onClick={openWidgetFullSizeModal}
          >
            <Maximize2 size={13} />
          </button>
          <div className="widget__tools__item">
            <WidgetMorePopover
              editWidget={editWidget}
              removeWidget={removeWidget}
              widget={widget}
            />
          </div>
        </div>
      </div>
      <div className="widget__visualization">
        <WidgetVisualization widget={widget} />
      </div>
    </div>
  );
};

export default Widget;
