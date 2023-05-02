import { LogsState } from 'types';

const logsStateParams = [
  {
    key: 'keyExists',
    isNonEmpty: (keyExists) => Object.keys(keyExists).length,
  },
  {
    key: 'filterByFacets',
    isNonEmpty: (filterByFacets) => filterByFacets.length,
  },
  {
    key: 'filterOrExcludeByFingerprint',
    isNonEmpty: (filterOrExcludeByFingerprint) =>
      Object.keys(filterOrExcludeByFingerprint).length,
  },
  { key: 'searchTerms', isNonEmpty: (searchTerms) => searchTerms.length },
  {
    key: 'selectedFacetValues',
    isNonEmpty: (selectedFacetValues) =>
      Object.keys(selectedFacetValues).length,
  },
];

const writeLogsStateToUrlParams = (logsState: LogsState) => {
  const { date } = logsState;

  const search = window.location.href.split('?')[1] || '';
  const nextUrlSearchParams = new URLSearchParams(`?${search}`);

  nextUrlSearchParams.set(
    'date',
    JSON.stringify({
      startTimeUnix: date.startTimeUnix,
      endTimeUnix: date.endTimeUnix,
    }),
  );

  logsStateParams.forEach(({ key, isNonEmpty }) => {
    const logStateParamValue = logsState[key];
    if (isNonEmpty(logStateParamValue)) {
      nextUrlSearchParams.set(key, JSON.stringify(logStateParamValue));
    } else {
      nextUrlSearchParams.delete(key);
    }
  });

  const previousUrl = window.location.href.split('?')[0];

  window.history.replaceState(
    '',
    '',
    `${previousUrl}?${nextUrlSearchParams.toString()}`,
  );
};

export default writeLogsStateToUrlParams;
