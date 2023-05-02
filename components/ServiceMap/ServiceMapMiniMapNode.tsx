import React from 'react';

const ServiceMapMiniMapNode = ({ x, y, color }) => {
  return (
    <circle
      className="service-map__mini-map__node"
      cx={x}
      cy={y}
      r="25"
      fill="#A8E4F9"
      fillOpacity="0.7"
      stroke="#1790BB"
      strokeWidth="4"
    />
  );
};

export default ServiceMapMiniMapNode;
