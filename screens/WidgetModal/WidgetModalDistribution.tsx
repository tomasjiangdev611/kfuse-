import React from 'react';
import { WidgetDistribution } from '../Widgets';

const WidgetModalDistribution = ({ form }) => {
  return (
    <>
      <div className="widget-modal__section">
        <div className="widget-modal__section__header">Preview</div>
        <div className="widget-modal__chart">
          <WidgetDistribution widget={form.values} />
        </div>
      </div>
    </>
  );
};

export default WidgetModalDistribution;
