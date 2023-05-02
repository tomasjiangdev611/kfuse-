import { useRequest } from 'hooks';
import { getGrafanaProvisionAlertById, getGrafanaAlertManager } from 'requests';

const useSLOAlertsState = () => {
  const getGrafanaProvisionAlertByIdRequest = useRequest(
    getGrafanaProvisionAlertById,
  );
  const requestsGrafanaAlertManager = useRequest(getGrafanaAlertManager);

  const loadSLOAlerts = async (alertUids: string[]) => {
    const uids = alertUids.filter((uid) => uid !== '');
    const datasets = await Promise.all([
      ...uids.map((uid) => getGrafanaProvisionAlertByIdRequest.call(uid)),
      requestsGrafanaAlertManager.call('contact-list'),
    ]);

    const [page, ticket, contactData] = datasets;
    const contactPointList: string[] = contactData.map(
      (contact: any) => contact.name,
    );

    const alertList = [page, ticket].map((alert) => {
      const labelArray = Object.keys(alert.labels || {});
      const contactPointLabels = labelArray.filter((label) =>
        contactPointList.includes(label),
      );

      const tags = labelArray.filter(
        (label) => !contactPointLabels.includes(label),
      );
      return { ...alert, contactPointLabels, tags };
    });

    return alertList;
  };

  return {
    loadSLOAlerts,
    isLoading:
      getGrafanaProvisionAlertByIdRequest.isLoading ||
      requestsGrafanaAlertManager.isLoading,
  };
};

export default useSLOAlertsState;
