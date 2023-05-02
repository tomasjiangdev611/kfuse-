import React from 'react';
import { WidgetHexbin } from '../Widgets';

const WidgetModalHexbin = ({ form }) => {
  return (
    <>
      <div className="widget-modal__section">
        <div className="widget-modal__section__header">Preview</div>
        <div className="widget-modal__chart">
          <WidgetHexbin widget={form.values} />
        </div>
      </div>
    </>
  );
};

export default WidgetModalHexbin;
