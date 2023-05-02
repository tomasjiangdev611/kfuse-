import fetchGrafanaApi from './fetchGrafanaApi';

const createGrafanaFolder = (folderName: string) => {
  return fetchGrafanaApi(`grafana/api/folders`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ title: folderName }),
  });
};

export default createGrafanaFolder;
