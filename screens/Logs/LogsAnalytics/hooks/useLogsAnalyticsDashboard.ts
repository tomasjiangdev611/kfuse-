import { AutocompleteOption, useToastmasterContext } from 'components';
import { useRequest } from 'hooks';
import { useEffect, useState } from 'react';
import {
  getDatasources,
  getGrafanaDashboard,
  getGrafanaDashboardByUid,
  mutateGrafanaDashboard,
} from 'requests';
import { DashboardPanelProps } from 'types/Dashboard';
import { convertTimestampToCode } from 'utils';

import {
  findLargestBottomOfDashboard,
  getNewDashboardJSONModel,
  getExportDashboardPanel,
} from '../utils';

const useLogsAnalyticsDashboard = (
  closeModal: () => void,
  date: any,
  expr: string,
) => {
  const { addToast } = useToastmasterContext();
  const [dashboardExportType, setDashboardExportType] = useState<string>('new');
  const [existingDashboards, setExistingDashboards] = useState<
    AutocompleteOption[]
  >([]);
  const [selectedDashboard, setSelectedDashboard] = useState<string>('');
  const [dashboardDetails, setDashboardDetails] = useState<{
    title: string;
    panelName: string;
  }>({ title: '', panelName: '' });

  const grafanaDashboardRequest = useRequest(getGrafanaDashboard);
  const grafanaDatasourceRequest = useRequest(getDatasources);
  const grafanaDashboardMutateRequest = useRequest(mutateGrafanaDashboard);
  const grafanaDashboardByUidRequest = useRequest(getGrafanaDashboardByUid);

  const onExportDashboard = async () => {
    const datasource = await grafanaDatasourceRequest
      .call()
      .then((response: any) => {
        return response.find((datasource: any) => datasource.type === 'loki');
      });

    if (datasource) {
      const datasourceUid = datasource.uid;
      if (dashboardExportType === 'new') {
        const timeDiff = convertTimestampToCode(date);
        const jsonModel = getNewDashboardJSONModel({
          dashboardDetails,
          datasourceUid,
          expr,
          timeDiff,
        });
        grafanaDashboardMutateRequest
          .call(jsonModel, 'Exported from Logs Analytics')
          .then((res: any) => {
            addToast({
              text: 'Dashboard exported successfully',
              status: 'success',
            });
            closeModal();
          })
          .catch((e: any) => {
            addToast({ text: 'Dashboard export failed', status: 'error' });
          });
      } else {
        grafanaDashboardByUidRequest
          .call(selectedDashboard)
          .then((response: any) => {
            const dashboard = response.dashboard;
            const panels: DashboardPanelProps[] = dashboard.panels;
            const panelGridPos = findLargestBottomOfDashboard(panels);
            const newPanel = getExportDashboardPanel({
              datasourceUid,
              expr,
              gridPos: panelGridPos,
              panelId: panels[panels.length - 1].id + 1,
              title: dashboardDetails.panelName,
            });
            panels.push(newPanel);

            grafanaDashboardMutateRequest
              .call(dashboard, 'Exported from Logs Analytics')
              .then((res: any) => {
                addToast({
                  text: 'Dashboard exported successfully',
                  status: 'success',
                });
                closeModal();
              })
              .catch((e: any) => {
                addToast({ text: 'Dashboard export failed', status: 'error' });
              });
          });
      }
    }
  };

  useEffect(() => {
    grafanaDashboardRequest
      .call(`type=dash-db`)
      .then((responseDashboard: any) => {
        const dashboardList: AutocompleteOption[] = [];
        if (responseDashboard) {
          responseDashboard.forEach((dashboard: any) => {
            const dashboardName = dashboard.title;
            dashboardList.push({
              label: dashboard.folderTitle
                ? `${dashboard.folderTitle}/${dashboardName}`
                : `General/${dashboardName}`,
              value: dashboard.uid,
            });
          });
          setExistingDashboards(dashboardList);
        }
      });
  }, []);

  return {
    dashboardExportType,
    dashboardDetails,
    existingDashboards,
    grafanaDatasourceRequest,
    grafanaDashboardMutateRequest,
    grafanaDashboardByUidRequest,
    onExportDashboard,
    selectedDashboard,
    setDashboardExportType,
    setDashboardDetails,
    setSelectedDashboard,
  };
};

export default useLogsAnalyticsDashboard;
