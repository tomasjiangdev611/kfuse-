import { MultiselectV2, TooltipTrigger, useModalsContext } from 'components';
import { useRequest } from 'hooks';
import React, { ReactElement, useEffect, useState } from 'react';
import { MdGroupAdd } from 'react-icons/md';
import { getGrafanaAlertManager } from 'requests';
import { AlertsContactsCreate } from '../AlertsContacts';

import { useAlertsCreate } from '../hooks';

const AlertsCreateContacts = ({
  alertsCreateState,
}: {
  alertsCreateState: ReturnType<typeof useAlertsCreate>;
}): ReactElement => {
  const modal = useModalsContext();
  const [isCreateContactOpen, setIsCreateContactOpen] = useState(false);
  const grafanaAlertManagerRequest = useRequest(getGrafanaAlertManager);
  const { contactPoints, setContactPoints } = alertsCreateState;

  useEffect(() => {
    grafanaAlertManagerRequest.call('contact-point');
  }, []);

  const openCreateContactModal = () => {
    modal.push(
      <div className="alerts__create__contacts__new-contact overflow-y-scroll">
        <AlertsContactsCreate
          onClose={(name) => {
            setContactPoints((prev) => [...prev, name]);
            grafanaAlertManagerRequest.call('contact-point');
            modal.pop();
          }}
        />
      </div>,
      false,
    );
  };

  return (
    <div className="alerts__create__section">
      <div className="alerts__create__contacts-points">
        <div className="alerts__create__details__container__item">
          <div className="alerts__create__details__container__item__textbox">
            <MultiselectV2
              onChange={(val) => setContactPoints(val)}
              options={grafanaAlertManagerRequest.result || []}
              placeholder="Choose contact points"
              value={contactPoints}
            />
          </div>
          <div className="alerts__create__details__container__item__action">
            <TooltipTrigger tooltip="Create new contact points">
              <button
                className="alerts__create__details__add-icon"
                onClick={openCreateContactModal}
              >
                <MdGroupAdd />
              </button>
            </TooltipTrigger>
          </div>
        </div>
      </div>
      {isCreateContactOpen && (
        <div className="alerts__create__contacts__new-contact">
          <AlertsContactsCreate
            onClose={(name) => {
              setIsCreateContactOpen(false);
              setContactPoints((prev) => [...prev, name]);
              grafanaAlertManagerRequest.call('contact-point');
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AlertsCreateContacts;
