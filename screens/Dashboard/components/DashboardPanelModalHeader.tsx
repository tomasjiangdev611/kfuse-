import { Datepicker } from 'composite';
import React, { ReactElement } from 'react';
import { X } from 'react-feather';
import { DateSelection } from 'types';

const DashboardPanelModalHeader = ({
  close,
  modalDate,
  setModalDate,
  title = 'EDIT',
}: {
  close: () => void;
  modalDate: DateSelection;
  setModalDate: () => void;
  title?: string;
}): ReactElement => {
  return (
    <div className="dashboard__panel-modal__header">
      <div className="dashboard__panel-modal__header__title">{title}</div>
      <div className="dashboard__panel-modal__header__right">
        {modalDate && (
          <div>
            <Datepicker
              absoluteTimeRangeStorage={null}
              className="logs__search__datepicker"
              hasStartedLiveTail={false}
              onChange={setModalDate}
              startLiveTail={null}
              value={modalDate}
            />
          </div>
        )}
        <div
          className="dashboard__panel-modal__header__right__close"
          onClick={close}
        >
          <X />
        </div>
      </div>
    </div>
  );
};

export default DashboardPanelModalHeader;
