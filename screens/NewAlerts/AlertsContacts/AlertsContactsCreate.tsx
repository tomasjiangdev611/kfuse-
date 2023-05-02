import { AutocompleteV2, InputWithValidatorV2, Loader } from 'components';
import React, { ReactElement, useEffect } from 'react';
import { Send, Trash } from 'react-feather';
import { useLocation, useNavigate } from 'react-router-dom';

import AlertsContactsCreateElement from './AlertsContactsCreateElement';
import { useAlertsContactsCreate, useAlertsContactsState } from './hooks';
import { ReceiverProps } from './types';

const AlertsContactsCreate = ({
  onClose,
}: {
  onClose?: (name: string) => void;
}): ReactElement => {
  const location = useLocation();
  const receiver = location.state as ReceiverProps;
  const navigate = useNavigate();

  const closePage = () => navigate('/alerts/contacts');
  const alertsContactsState = useAlertsContactsState();
  const {
    error,
    mutateContactPoint,
    grafanaAlertManagerRequest,
    mutateContactPointsRequest,
    setError,
  } = useAlertsContactsCreate(onClose ? onClose : closePage);

  const {
    addNotifierType,
    contactPointName,
    getNotifierData,
    grafanaAlertsNotifiesRequest,
    notifiersTypes,
    editMode,
    removeSelectedNotifier,
    setContactPointName,
    selectedNotifierData,
    selectedNotifierTypes,
    testContactPoint,
    setUpdatedContactPointState,
    updateSelectedNotifierTypes,
  } = alertsContactsState;

  useEffect(() => {
    if (receiver) {
      setUpdatedContactPointState(receiver);
    }
  }, []);

  return (
    <div className="container-center">
      <div className="alerts__contacts">
        <h2>Create Contact points</h2>
        <Loader
          isLoading={
            grafanaAlertManagerRequest.isLoading ||
            mutateContactPointsRequest.isLoading
          }
        >
          <div className="alerts__contacts__create__name">
            <div className="">
              <div className="alerts__contacts__create__element__label">
                Contact point name
              </div>
              <InputWithValidatorV2
                disabled={editMode}
                onChange={(e) => {
                  setContactPointName(e.target.value);
                  setError({ ...error, ...{ name: '' } });
                }}
                placeholder="Enter Contact point name"
                type="text"
                value={contactPointName}
                errorText={error?.name}
              />
            </div>
            <div>
              <button
                className="button "
                onClick={() => (onClose ? onClose() : closePage())}
              >
                Cancel
              </button>
              <button
                className="button button--blue"
                onClick={() =>
                  mutateContactPoint({
                    contactPointName,
                    getNotifierData,
                    selectedNotifierData,
                    selectedNotifierTypes,
                    type: editMode ? 'update' : 'create',
                  })
                }
              >
                Save contact point
              </button>
            </div>
          </div>
          <div>
            <Loader isLoading={grafanaAlertsNotifiesRequest.isLoading}>
              {selectedNotifierTypes.map(
                (notifierType: string, index: number) => {
                  const notifierData = getNotifierData(notifierType);
                  return (
                    <div
                      className="alerts__contacts__create__container"
                      key={index}
                    >
                      <div>
                        <div>
                          <div className="alerts__contacts__create__element__label">
                            Choose contact point type
                          </div>
                          <AutocompleteV2
                            options={notifiersTypes}
                            onChange={(val) =>
                              updateSelectedNotifierTypes(index, val)
                            }
                            placeholder="Select Notifier Type"
                            value={notifierType}
                          />
                        </div>
                        <div>
                          {notifierData && (
                            <AlertsContactsCreateElement
                              alertsContactsState={alertsContactsState}
                              notifierData={notifierData}
                              notifierIndex={index}
                              selectedNotifierData={selectedNotifierData[index]}
                            />
                          )}
                        </div>
                      </div>
                      <div className="alerts__contacts__create__container__actions">
                        <button
                          className="button button--blue"
                          onClick={() => testContactPoint(index)}
                        >
                          <Send />
                          Test
                        </button>
                        {index !== 0 && (
                          <button
                            className="button button--red"
                            onClick={() => removeSelectedNotifier(index)}
                          >
                            <Trash />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                },
              )}
            </Loader>
          </div>
          <div>
            <button
              className="button button--blue"
              onClick={() => addNotifierType()}
            >
              Add new contact point type
            </button>
          </div>
        </Loader>
      </div>
    </div>
  );
};

export default AlertsContactsCreate;
