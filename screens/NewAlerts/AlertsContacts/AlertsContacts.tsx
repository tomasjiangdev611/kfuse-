import { Loader, Table, TooltipTrigger } from 'components';
import { ConfirmationModal, useModalsContext } from 'components/Modals';
import { useRequest } from 'hooks';
import React, { useEffect } from 'react';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { Plus } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { getGrafanaAlertManager } from 'requests';

import { useAlertsContactsDelete } from './hooks';

const columns = (
  onDeleteContactPoint: (name: string) => void,
  onEdit: (val: any) => void,
) => [
  { label: 'Contact point name', key: 'name' },
  { label: 'Type', key: 'type' },
  {
    label: 'Actions',
    key: 'actions',
    renderCell: ({ row }: { row: { name: string; type: string } }) => {
      return (
        <div className="alerts__contacts__table__actions">
          <TooltipTrigger tooltip="Edit">
            <MdModeEdit
              className="alerts__contacts__table__actions__icon--edit"
              onClick={() => onEdit(row)}
              size={18}
            />
          </TooltipTrigger>
          <TooltipTrigger tooltip="Delete">
            <MdDelete
              className="alerts__contacts__table__actions__icon--delete"
              onClick={() => onDeleteContactPoint(row.name)}
              size={18}
            />
          </TooltipTrigger>
        </div>
      );
    },
  },
];

const AlertsContacts = () => {
  const modal = useModalsContext();
  const navigate = useNavigate();
  const grafanaAlertManagerRequest = useRequest(getGrafanaAlertManager);
  const { deleteContactPoint, isDeleting, mutateContactPointsRequest } =
    useAlertsContactsDelete();

  useEffect(() => {
    grafanaAlertManagerRequest.call('contact-list');
  }, [mutateContactPointsRequest.result]);

  const onEdit = (row: any) => {
    navigate('/alerts/contacts/create', { state: row.receiver });
  };

  const onDeleteContactPoint = (name: string) => {
    modal.push(
      <ConfirmationModal
        className="alerts__list__delete-alerts-rule"
        description="Are you sure you want to delete this contact point?"
        onCancel={() => modal.pop()}
        onConfirm={() => {
          deleteContactPoint(name);
          modal.pop();
        }}
        title="Delete Contact Point"
      />,
    );
  };

  return (
    <div className="container-center">
      <div className="alerts__contacts">
        <div className="alerts__contacts__list__header">
          <h2>Contact Points</h2>

          <button
            className="button button--blue"
            onClick={() => navigate('/alerts/contacts/create')}
          >
            <Plus />
            Add New Contact Point
          </button>
        </div>
        <Loader isLoading={grafanaAlertManagerRequest.isLoading || isDeleting}>
          <div className="alerts__contacts__list">
            <Table
              className="alerts__contacts__table"
              columns={columns(onDeleteContactPoint, onEdit)}
              rows={grafanaAlertManagerRequest.result || []}
            />
            {grafanaAlertManagerRequest.result &&
              grafanaAlertManagerRequest.result.length === 0 && (
                <div className="alerts__contacts__list__empty">
                  <h3>No contact points found</h3>
                  <p>
                    You can create a new contact point by clicking on the button
                    above.
                  </p>
                </div>
              )}
          </div>
        </Loader>
      </div>
    </div>
  );
};

export default AlertsContacts;
