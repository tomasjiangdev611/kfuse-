import { Input, Loader, useToastmasterContext } from 'components';
import { useRequest } from 'hooks';
import React, { ReactElement, useState } from 'react';
import { X } from 'react-feather';
import { saveRenamedFacet } from 'requests';

const LogsFacetRenameModal = ({
  closeModal,
  fpHash,
  internalFacet,
  source,
}: {
  closeModal: () => void;
  fpHash: string;
  internalFacet: string;
  source: string;
}): ReactElement => {
  const [renamedFacet, setRenamedFacet] = useState<string>('');
  const saveRenamedFacetRequest = useRequest(saveRenamedFacet);
  const { addToast } = useToastmasterContext();

  const onSaveRenameFacet = () => {
    if (renamedFacet === '') {
      addToast({ text: 'Please enter a name', status: 'error' });
      return;
    }

    if (internalFacet === renamedFacet) {
      addToast({ text: 'Please enter a different name', status: 'error' });
      return;
    }

    saveRenamedFacetRequest
      .call({ fpHash, internalFacet, renamedFacet, source })
      .then(() => {
        addToast({ text: 'Facet renamed successfully', status: 'success' });
        closeModal();
      })
      .catch(() => {
        addToast({ text: 'Error renaming facet', status: 'error' });
      });
  };

  return (
    <div className="logs__facet__rename-modal">
      <Loader isLoading={saveRenamedFacetRequest.isLoading}>
        <div className="logs__facet__rename-modal__header">
          <h3 className="logs__facet__rename-modal__header__title">
            Rename Facet
          </h3>
          <button
            className="logs__facet__rename-modal__header__close"
            onClick={closeModal}
          >
            <X size={20} />
          </button>
        </div>
        <div className="logs__facet__rename-modal__body">
          <div>Give facet name you want to rename </div>
          <Input
            onChange={(val) => setRenamedFacet(val)}
            placeholder="Enter facet name"
            type="text"
            value={renamedFacet}
          />
        </div>
        <div className="logs__facet__rename-modal__footer">
          <button className="button button--red" onClick={closeModal}>
            Cancel
          </button>
          <button className="button button--blue" onClick={onSaveRenameFacet}>
            Save
          </button>
        </div>
      </Loader>
    </div>
  );
};

export default LogsFacetRenameModal;
