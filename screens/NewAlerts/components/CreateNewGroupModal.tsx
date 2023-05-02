import { Input } from 'components';
import React, { ReactElement, useState } from 'react';
import { XCircle } from 'react-feather';

const CreateNewGroupModal = ({
  closeModal,
  updateGroup,
}: {
  closeModal: () => void;
  updateGroup: (groupName: string) => void;
}): ReactElement => {
  const [groupName, setGroupName] = useState('');

  return (
    <div className="alerts__create-new-folder">
      <div className="alerts__create-new-folder__container">
        <div className="alerts__create-new-folder__container__header">
          <div>Create New Group</div>
          <XCircle onClick={closeModal} />
        </div>
        <div className="alerts__create-new-folder__container__body">
          <div>Group name</div>
          <Input
            onChange={(val) => setGroupName(val)}
            placeholder="Enter group name"
            type="text"
            value={groupName}
          />
        </div>
        <div className="alerts__create-new-folder__container__action">
          <button
            className="button button--blue"
            onClick={() => updateGroup(groupName)}
          >
            Create new group
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNewGroupModal;
