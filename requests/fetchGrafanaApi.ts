import fetchJSON from './fetchJson';

const fetchGrafanaApi = (url: string, options: any = {}) =>
  fetchJSON(`/auth/proxy/${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

export default fetchGrafanaApi;
