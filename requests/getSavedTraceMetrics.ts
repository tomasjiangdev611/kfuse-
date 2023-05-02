import fetchJson from './fetchJson';

const getSavedTraceMetrics = () => {
  return fetchJson('/trace/metrics');
};

export default getSavedTraceMetrics;
