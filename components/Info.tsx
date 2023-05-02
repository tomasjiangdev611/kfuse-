import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';

const Info = ({ children }) => {
  return (
    <div className="info">
      <FaInfoCircle className="info__icon" />
      <div className="info__content">{children}</div>
    </div>
  );
};

export default Info;
