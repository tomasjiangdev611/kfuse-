import { colors } from 'constants';
import React from 'react';

type Props = {
  status: string;
};

const getColor = (statusNumber: number) => {
  if (statusNumber >= 400) {
    return colors.red;
  }

  if (statusNumber >= 300) {
    return colors.yellow;
  }

  if (statusNumber >= 200) {
    return colors.green03;
  }

  return colors.blue;
};

const StatusTag = ({ status }: Props) => {
  const statusNumber = Number(status);
  if (status === '' || status === undefined || status === null) {
    return null;
  }

  return (
    <div
      className="status-tag"
      style={{ backgroundColor: getColor(statusNumber) }}
    >
      {status}
    </div>
  );
};

export default StatusTag;
