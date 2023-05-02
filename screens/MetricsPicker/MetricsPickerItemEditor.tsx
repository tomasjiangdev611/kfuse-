import React, { useState } from 'react';

const MetricsPickerItemEditor = ({ onChange, metrics, value }: any) => {
  const [editorValue, setEditorValue] = useState(value);
  const run = () => {
    onChange(editorValue);
  };
  return (
    <div className="widget-modal__editor">
      <div className="widget-modal__editor__footer">
        <button className="button" onClick={run} type="button">
          Run
        </button>
      </div>
    </div>
  );
};

export default MetricsPickerItemEditor;
