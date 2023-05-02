import { Key } from 'components';
import React from 'react';
import { TfiMouse } from 'react-icons/tfi';

const ShiftToZoomHelperText = () => {
  return (
    <div className="shift-to-zoom-helper-text">
      <span>{'Hold down '}</span>
      <Key text="Shift" />
      <span>{' and use your mouse wheel '}</span>
      <TfiMouse size={14} />
      <span>{' to zoom.'}</span>
    </div>
  );
};

export default ShiftToZoomHelperText;
