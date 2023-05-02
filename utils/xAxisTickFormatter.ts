import dayjs from 'dayjs';

const getFormat = (diffInSeconds: number) => {
  if (diffInSeconds > 60 * 60) {
    ('MMM D');
  }

  if (diffInSeconds > 60) {
    return 'MMM D H:mm';
  }

  return 'H:mm:ss';
};

const xAxisTickFormatter = (labels: number[], utcTimeEnabled?: boolean) => {
  const startTimeUnix = labels[0];
  const nextTimeUnix = labels[1];

  const diffInSeconds = nextTimeUnix - startTimeUnix;
  const format = getFormat(diffInSeconds);

  return (labelIndex: number) => {
    if (labelIndex < labels.length) {
      const unixTimestamp = labels[labelIndex];
      const timestampDayJs = utcTimeEnabled
        ? dayjs.unix(unixTimestamp).utc()
        : dayjs.unix(unixTimestamp);
      return timestampDayJs.format(format);
    }

    return '';
  };
};

export default xAxisTickFormatter;
