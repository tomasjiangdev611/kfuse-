import React, { ReactElement } from 'react';

const DashboardPanelModalFooter = ({
  close,
  onSave,
}: {
  close: () => void;
  onSave: () => void;
}): ReactElement => {
  return (
    <div className="dashboard__panel-modal__footer">
      <div className="dashboard__panel-modal__footer__right">
        <button className="button" onClick={close}>
          Cancel
        </button>
        <button className="button button--blue" onClick={onSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default DashboardPanelModalFooter;
