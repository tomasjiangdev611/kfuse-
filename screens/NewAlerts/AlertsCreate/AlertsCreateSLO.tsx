import { Loader, Stepper } from 'components';
import { useRequest } from 'hooks';
import React, { ReactElement, useEffect } from 'react';
import { getGrafanaProvisionAlertById } from 'requests';

import {
  AlertsCreateContacts,
  AlertsCreateDetails,
  CreateRuleButton,
} from '../components';
import { useAlertsCreate, useAlertsCreateConditions } from '../hooks';

const AlertsCreateSLO = ({
  alertsCreateState,
}: {
  alertsCreateState: ReturnType<typeof useAlertsCreate>;
  conditionsState: ReturnType<typeof useAlertsCreateConditions>;
}): ReactElement => {
  const getGrafanaProvisionAlertByIdRequest = useRequest(
    getGrafanaProvisionAlertById,
  );
  const { isSaving, mutateSLOAlertsRule, setUpdateAlertsRuleState } =
    alertsCreateState;

  useEffect(() => {
    const url = new URL(window.location.href);
    const sloAlertData = new URLSearchParams(
      url.hash.substring(10, url.hash.length),
    ).get('sloAlertData');

    if (sloAlertData) {
      try {
        const parsedSloAlertData = JSON.parse(sloAlertData);
        setUpdateAlertsRuleState(parsedSloAlertData);
        getGrafanaProvisionAlertByIdRequest.call(parsedSloAlertData.uid);
      } catch (error) {}
    }
  }, []);

  return (
    <div>
      <Loader isLoading={isSaving}>
        <Stepper
          steps={[
            {
              title: 'Add Details',
              component: (
                <>
                  <AlertsCreateDetails alertsCreateState={alertsCreateState} />
                </>
              ),
            },
            {
              title: 'Add Contacts',
              component: (
                <AlertsCreateContacts alertsCreateState={alertsCreateState} />
              ),
            },
          ]}
        />
        <CreateRuleButton
          isEditing={alertsCreateState.isEditing}
          onClick={() =>
            mutateSLOAlertsRule(getGrafanaProvisionAlertByIdRequest.result)
          }
        />
      </Loader>
    </div>
  );
};

export default AlertsCreateSLO;
