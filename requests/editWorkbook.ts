import fetchJson from './fetchJson';

const editWorkbook = (body) =>
  fetchJson('/beffe/workbooks', { method: 'PUT', body: JSON.stringify(body) });

export default editWorkbook;
