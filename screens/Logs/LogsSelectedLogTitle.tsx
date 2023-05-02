import { ChipWithLabel, DateFormatter, LogLevel } from 'components';
import { colorsByLogLevel, dateTimeFormatWithMilliseconds } from 'constants';
import React from 'react';
import { LogEvent } from 'types';

type Props = {
  logEvent: LogEvent;
};

const LogsSelectedLogTitle = ({ logEvent }: Props) => {
  const { level, timestamp } = logEvent;

  return (
    <div className="logs__selected-log__title">
      <DateFormatter
        formatString={dateTimeFormatWithMilliseconds}
        unixTimestamp={timestamp}
      />
      <LogLevel
        className="logs__selected-log__title__log-level"
        level={logEvent.level}
      />
    </div>
  );
};

export default LogsSelectedLogTitle;
