import React from 'react';

const PickerTile = ({ icon, label }) => (
  <div className="picker__tile">
    <div className="picker__tile__icon">
      {icon}
    </div>
    <div className="picker__tile__label">
      {label}
    </div>
  </div>
);

export default PickerTile;
