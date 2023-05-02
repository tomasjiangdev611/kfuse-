import { Input, Loader } from 'components';
import { useRequest } from 'hooks';
import React, { ReactElement, useState } from 'react';
import { XCircle } from 'react-feather';
import { createGrafanaFolder } from 'requests';

const CreateNewFolderModal = ({
  closeModal,
  updateFolder,
}: {
  closeModal: () => void;
  updateFolder: (folderName: string) => void;
}): ReactElement => {
  const [folderName, setFolderName] = useState('');
  const createFolderRequest = useRequest(createGrafanaFolder);

  return (
    <div className="alerts__create-new-folder">
      <Loader isLoading={createFolderRequest.isLoading}>
        <div className="alerts__create-new-folder__container">
          <div className="alerts__create-new-folder__container__header">
            <div>Create New Folder</div>
            <XCircle onClick={closeModal} />
          </div>
          <div className="alerts__create-new-folder__container__body">
            <div>Folder name</div>
            <Input
              onChange={(val) => setFolderName(val)}
              placeholder="Enter folder name"
              type="text"
              value={folderName}
            />
          </div>
          <div className="alerts__create-new-folder__container__action">
            <button
              className="button button--blue"
              onClick={() => {
                createFolderRequest.call(folderName).then(() => {
                  updateFolder(folderName);
                });
              }}
            >
              Create new folder
            </button>
          </div>
        </div>
      </Loader>
    </div>
  );
};

export default CreateNewFolderModal;
