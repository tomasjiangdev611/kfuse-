import React from 'react';
import LogsFingerprintsListItemChartBars from './LogsFingerprintsListItemChartBars';

const LogsFingerprintsListItemChart = ({ bucketSecs, date, logCounts, width }) => {
  return (
    <LogsFingerprintsListItemChartBars
      bucketSecs={bucketSecs}
      date={date}
      logCounts={logCounts}
      width={width}
    />
  );
};

export default LogsFingerprintsListItemChart;
