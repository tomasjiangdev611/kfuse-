import React from 'react';
import { WidgetPie } from '../Widgets';

const WidgetModalPie = ({ form }) => {
  return (
    <>
      <div className="widget-modal__section">
        <div className="widget-modal__section__header">Preview</div>
        <div className="widget-modal__chart">
          <WidgetPie widget={form.values} />
        </div>
      </div>
    </>
  );
};

export default WidgetModalPie;
