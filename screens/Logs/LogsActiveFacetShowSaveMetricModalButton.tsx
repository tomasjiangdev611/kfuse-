import { useModalsContext } from 'components';
import React from 'react';
import LogsActiveFacetSaveMetricModal from './LogsActiveFacetSaveMetricModal';

const LogsActiveFacetShowSaveMetricModalButton = ({
  component,
  form,
  logsState,
  name,
  type,
}) => {
  const modals = useModalsContext();
  const openSaveMetricModal = () => {
    modals.push(
      <LogsActiveFacetSaveMetricModal
        component={component}
        form={form}
        logsState={logsState}
        name={name}
        type={type}
      />,
    );
  };

  return (
    <div className="logs__active-facet__show-save-metric-modal-button">
      <button
        className="button button--primary"
        onClick={openSaveMetricModal}
        type="button"
      >
        Create Metric
      </button>
    </div>
  );
};

export default LogsActiveFacetShowSaveMetricModalButton;
