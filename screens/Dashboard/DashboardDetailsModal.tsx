import { Input, Textarea, useToastmasterContext } from 'components';
import React, { ReactElement, useState } from 'react';
import { X } from 'react-feather';
import { useDashboardState } from './hooks';

const DashboardDetailsModal = ({
  close,
  dashboardState,
}: {
  close: VoidFunction;
  dashboardState: ReturnType<typeof useDashboardState>;
}): ReactElement => {
  const { addToast } = useToastmasterContext();
  const { dashboardDetails, setDashboardDetails } = dashboardState;
  const [state, setState] = useState({
    title: dashboardDetails.title,
    description: dashboardDetails.description,
  });

  const updateDashboardDetails = () => {
    const { title, description } = state;
    if (!title) {
      addToast({ text: 'Title is required', status: 'error' });
      return;
    }
    setDashboardDetails((prevState) => ({
      ...prevState,
      title,
      description,
    }));
    close();
  };

  return (
    <div className="dashboard__details-modal">
      <div className="dashboard__details-modal__header">
        <div className="dashboard__details-modal__header__title">
          Dashboard Details
        </div>
        <div className="dashboard__details-modal__header__close">
          <X onClick={close} />
        </div>
      </div>
      <div className="dashboard__details-modal__body">
        <div>
          <label>Title</label>
          <Input
            onChange={(val) => setState({ ...state, title: val })}
            placeholder="Enter dashboard title"
            type="text"
            value={state.title}
          />
        </div>
        <div>
          <label>Description</label>
          <Textarea
            className="dashboard__details-modal__body__description"
            onChange={(val) => setState({ ...state, description: val })}
            placeholder="Describe the dashboard"
            type="text"
            value={state.description}
          />
        </div>
      </div>
      <div className="dashboard__details-modal__footer">
        <button className="button" onClick={close}>
          Cancel
        </button>
        <button
          className="button button--blue"
          onClick={updateDashboardDetails}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default DashboardDetailsModal;
