import fetchGrafanaApi from './fetchGrafanaApi';

const getGrafanaAlertsFolders = (): Promise<string[]> => {
  return fetchGrafanaApi(
    `/grafana/api/search?query=&starred=false&skipRecent=true&skipStarred=true&folderIds=0&layout=folders&prevSort=null`,
    {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
    },
  ).then((result: Array<{ title: string; url: string }>) => {
    if (result && result.length > 0) {
      const folders: string[] = [];
      result.forEach((folder) => {
        if (folder.url.startsWith('/grafana/dashboards/')) {
          folders.push(folder.title);
        }
      });
      return folders;
    }
    return [];
  });
};

export default getGrafanaAlertsFolders;
