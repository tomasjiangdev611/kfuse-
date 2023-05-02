import { useThemeContext } from 'components';
import dayjs from 'dayjs';
import React from 'react';

type Props = {
  formatString: string;
  unixTimestamp: number;
};

const DateFormatter = ({ formatString, unixTimestamp }: Props) => {
  const { utcTimeEnabled } = useThemeContext();
  const timestampDayJs = utcTimeEnabled
    ? dayjs(unixTimestamp).utc()
    : dayjs(unixTimestamp);

  return <>{timestampDayJs.format(formatString)}</>;
};

export default DateFormatter;
