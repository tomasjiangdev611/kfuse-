import fetchJson from './fetchJson';

const createWorkbook = (body) =>
  fetchJson('/beffe/workbooks', { method: 'POST', body: JSON.stringify(body) });

export default createWorkbook;
