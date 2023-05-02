import getGrafanaDashboard from './getGrafanaDashboard';

const getDashboardUidByName = async (name: string): Promise<string> => {
  const dashboardList = await getGrafanaDashboard(name);
  const dashboard = dashboardList.find((item: any) => item.title === name);
  if (!dashboard) {
    return '';
  }
  return dashboard.uid;
};

export default getDashboardUidByName;
