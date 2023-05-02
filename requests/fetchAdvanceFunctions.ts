import fetchJSON from './fetchJson';

const fetchAdvanceFunctions = (url: string, options: any = {}) =>
  fetchJSON(`/advance-functions/${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

export default fetchAdvanceFunctions;
