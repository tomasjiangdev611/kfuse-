const secondsInAMonth = 60 * 60 * 24 * 30;
const secondsInAWeek = 60 * 60 * 24 * 7;
const secondsInADay = 60 * 60 * 24;
const secondsInAnHour = 60 * 60;
const secondsInAMinute = 60;

const pluralize = (n: number, s: string): string => {
  if (n === 1) {
    return s;
  }

  return `${n} ${s}s`;
};

const formatSecondsToLabel = (seconds: number): string => {
  if (seconds >= secondsInAMonth) {
    return pluralize(Math.round(seconds / secondsInAMonth), 'month');
  }
  if (seconds >= secondsInAWeek) {
    return pluralize(Math.round(seconds / secondsInAWeek), 'week');
  }
  if (seconds >= secondsInADay) {
    return pluralize(Math.round(seconds / secondsInADay), 'day');
  }
  if (seconds >= secondsInAnHour) {
    return pluralize(Math.round(seconds / secondsInAnHour), 'hour');
  }
  if (seconds >= secondsInAMinute) {
    return pluralize(Math.round(seconds / secondsInAMinute), 'minute');
  }

  return pluralize(seconds, 'second');
};

export default formatSecondsToLabel;
