import {
  AutocompleteV2,
  AutocompleteOption,
  Input,
  Textarea,
  TooltipTrigger,
  useModalsContext,
} from 'components';
import { useRequest } from 'hooks';
import React, { ReactElement, useEffect, useMemo } from 'react';
import { MdCreateNewFolder } from 'react-icons/md';
import { HiViewGridAdd } from 'react-icons/hi';

import { getGrafanaAlertsStatus } from 'requests';

import CreateNewFolderModal from './CreateNewFolderModal';
import CreateNewGroupModal from './CreateNewGroupModal';
import { useAlertsCreate } from '../hooks';
import { getFolderOptions, getGroupListByFolder } from '../utils';

const AlertsCreateDetails = ({
  alertsCreateState,
}: {
  alertsCreateState: ReturnType<typeof useAlertsCreate>;
}): ReactElement => {
  const modal = useModalsContext();
  const requestGrafanaAlertsRules = useRequest(getGrafanaAlertsStatus);
  const { alertsDetails, getGrafanaAlertsFoldersRequest, setAlertsDetails } =
    alertsCreateState;
  const { folderName, groupName } = alertsDetails;

  const folderOptions: AutocompleteOption[] = getFolderOptions(
    getGrafanaAlertsFoldersRequest.result || [],
  );

  useEffect(() => {
    requestGrafanaAlertsRules.call('rules');
  }, []);

  const groupListOptions: AutocompleteOption[] = useMemo(
    () =>
      getGroupListByFolder(
        requestGrafanaAlertsRules.result || {},
        folderName,
        groupName,
      ),
    [folderName, groupName, requestGrafanaAlertsRules.result],
  );

  const openCreateNewFolderModal = () => {
    modal.push(
      <div className="alerts__create__details__new-folder-modal">
        <CreateNewFolderModal
          closeModal={modal.pop}
          updateFolder={(folderName: string) => {
            modal.pop();
            setAlertsDetails({ ...alertsDetails, folderName });
            getGrafanaAlertsFoldersRequest.call();
          }}
        />
      </div>,
    );
  };

  const openCreateNewGroupModal = () => {
    modal.push(
      <div className="alerts__create__details__new-folder-modal">
        <CreateNewGroupModal
          closeModal={modal.pop}
          updateGroup={(groupName: string) => {
            modal.pop();
            setAlertsDetails({ ...alertsDetails, groupName });
          }}
        />
      </div>,
    );
  };

  return (
    <div className="alerts__create__section">
      <div className="alerts__create__details__container">
        <div className="alerts__create__details__container__item">
          <div className="alerts__create__details__container__item__textbox">
            <div>
              Folder name <span className="text--red">*</span>
            </div>
            <AutocompleteV2
              placeholder="Choose folder name"
              onChange={(val) =>
                setAlertsDetails({ ...alertsDetails, folderName: val })
              }
              options={folderOptions}
              value={alertsDetails.folderName}
            />
          </div>
          <div className="alerts__create__details__container__item__action">
            <TooltipTrigger tooltip="Create new folder">
              <button
                className="alerts__create__details__add-icon"
                onClick={openCreateNewFolderModal}
              >
                <MdCreateNewFolder />
              </button>
            </TooltipTrigger>
          </div>
        </div>
        <div className="alerts__create__details__container__item">
          <div className="alerts__create__details__container__item__textbox">
            <div>
              Group name <span className="text--red">*</span>
            </div>
            <AutocompleteV2
              placeholder="Choose group name"
              onChange={(val) =>
                setAlertsDetails({ ...alertsDetails, groupName: val })
              }
              options={groupListOptions}
              value={alertsDetails.groupName}
            />
          </div>
          <div className="alerts__create__details__container__item__action">
            <TooltipTrigger tooltip="Create new group">
              <button
                className="alerts__create__details__add-icon"
                onClick={openCreateNewGroupModal}
              >
                <HiViewGridAdd />
              </button>
            </TooltipTrigger>
          </div>
        </div>
        <div className="alerts__create__details__container__item">
          <div className="alerts__create__details__container__item__textbox">
            <div>
              Rule name <span className="text--red">*</span>
            </div>
            <Input
              onChange={(val) =>
                setAlertsDetails((prevState) => ({
                  ...prevState,
                  ruleName: val,
                }))
              }
              placeholder="Enter rule name.."
              type="text"
              value={alertsDetails.ruleName}
            />
          </div>
          <div className="alerts__create__details__container__item__action"></div>
        </div>
        <div className="alerts__create__details__container__item">
          <div className="alerts__create__details__container__item__textbox">
            <div>Title</div>
            <Input
              onChange={(val) =>
                setAlertsDetails((prevState) => ({
                  ...prevState,
                  summary: val,
                }))
              }
              placeholder="Enter title.."
              type="text"
              value={alertsDetails.summary}
            />
          </div>
          <div className="alerts__create__details__container__item__action"></div>
        </div>
        <div className="alerts__create__details__container__item">
          <div className="alerts__create__details__container__item__textbox">
            <div>Runbook URL</div>
            <Input
              onChange={(val) =>
                setAlertsDetails((prevState) => ({
                  ...prevState,
                  runbookUrl: val,
                }))
              }
              placeholder="Enter runbook URL.."
              type="text"
              value={alertsDetails.runbookUrl}
            />
          </div>
          <div className="alerts__create__details__container__item__action"></div>
        </div>
        <div className="alerts__create__details__container__item">
          <div className="alerts__create__details__container__item__textbox">
            <div>Description</div>
            <Textarea
              className="alerts__create__details__textarea"
              onChange={(val) =>
                setAlertsDetails((prevState) => ({
                  ...prevState,
                  description: val,
                }))
              }
              placeholder="Enter description.."
              type="text"
              value={alertsDetails.description}
            />
          </div>
          <div className="alerts__create__details__container__item__action"></div>
        </div>
      </div>
    </div>
  );
};

export default AlertsCreateDetails;
