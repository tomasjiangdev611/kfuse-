import { DateSelection } from 'types';

import fetchGrafanaApi from './fetchGrafanaApi';
import { buildGrafanaQuery, transformGrafanaQueryData } from './utils';

const getGrafanaQueryData = (date: DateSelection, query: any) => {
  const { startTimeUnix, endTimeUnix } = date;
  const newQueries = {
    queries: buildGrafanaQuery(query),
    from: `${startTimeUnix * 1000}`,
    to: `${endTimeUnix * 1000}`,
  };
  return fetchGrafanaApi('/grafana/api/ds/query', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(newQueries),
  }).then((result) =>
    result?.results
      ? transformGrafanaQueryData(result.results)
      : { data: [], series: [] },
  );
};

export default getGrafanaQueryData;
