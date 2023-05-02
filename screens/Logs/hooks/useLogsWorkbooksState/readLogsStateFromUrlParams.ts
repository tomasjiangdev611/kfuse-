import dayjs from 'dayjs';
import { DateSelection } from 'types';

const isTimestampInMs = (startTimeUnix: number): boolean => {
  const timestamp = Number(startTimeUnix);

  if (
    Math.abs(Date.now() - timestamp) < Math.abs(Date.now() - timestamp * 1000)
  ) {
    return true;
  }

  return false;
};

const processDate = (date: DateSelection): DateSelection => {
  if (isTimestampInMs(date.startTimeUnix)) {
    date.startTimeUnix = Math.floor(date.startTimeUnix / 1000);
    date.endTimeUnix = Math.floor(date.endTimeUnix / 1000);
  }

  return date;
};

const logsStateParams = [
  {
    key: 'date',
    getInitialState: () => {
      const endTimeUnix = dayjs().unix();
      const startTimeUnix = dayjs()
        .subtract(60 * 5, 'seconds')
        .unix();

      return {
        startLabel: 'now-5m',
        endLabel: 'now',
        endTimeUnix,
        startTimeUnix,
      };
    },

    process: processDate,
  },
  {
    key: 'keyExists',
    getInitialState: () => ({}),
  },
  {
    key: 'filterByFacets',
    getInitialState: () => [],
  },
  {
    key: 'filterOrExcludeByFingerprint',
    getInitialState: () => ({}),
  },
  { key: 'searchTerms', getInitialState: () => [] },
  {
    key: 'selectedFacetValues',
    getInitialState: () => ({}),
  },
];

const readLogsStateFromUrlParams = () => {
  const search = window.location.href.split('?')[1] || '';
  const urlSearchParams = new URLSearchParams(`?${search}`);
  const logsState = {};

  logsStateParams.forEach(({ key, getInitialState, process }) => {
    const value = urlSearchParams.get(key);
    if (value) {
      try {
        const parsedValue = JSON.parse(value);
        logsState[key] = process ? process(parsedValue) : parsedValue;
      } catch (e) {
        logsState[key] = getInitialState();
      }
    } else {
      logsState[key] = getInitialState();
    }
  });

  return logsState;
};

export default readLogsStateFromUrlParams;
