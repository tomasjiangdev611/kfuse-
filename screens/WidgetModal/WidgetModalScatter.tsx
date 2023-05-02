import React from 'react';
import { WidgetScatter } from '../Widgets';

const WidgetModalScatter = ({ form }) => {
  return (
    <>
      <div className="widget-modal__section">
        <div className="widget-modal__section__header">Preview</div>
        <div className="widget-modal__chart">
          <WidgetScatter widget={form.values} />
        </div>
      </div>
    </>
  );
};

export default WidgetModalScatter;
