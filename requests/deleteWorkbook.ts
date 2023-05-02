import fetchJson from './fetchJson';

const deleteWorkbook = (workbookId: string) =>
  fetchJson(`/beffe/workbooks/${workbookId}`, { method: 'DELETE' });

export default deleteWorkbook;
