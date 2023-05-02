import fetchJson from './fetchJson';

const getWorkbooks = () =>
  fetchJson('/beffe/workbooks');

export default getWorkbooks;
