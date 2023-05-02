import { Input, useModalsContext, useToastmasterContext } from 'components';
import { useRequest } from 'hooks';
import React, { ReactElement, useState } from 'react';
import { saveMetric } from 'requests';

import { useLogsState } from './hooks';

const LogsActiveFacetSaveMetricModal = ({
  component,
  form,
  logsState,
  name,
  type,
}: {
  component: string;
  form: any;
  logsState: ReturnType<typeof useLogsState>;
  name: string;
  type: string;
}): ReactElement => {
  const [metricName, setMetricName] = useState('');
  const modals = useModalsContext();
  const saveMetricRequest = useRequest(saveMetric);
  const toastmaster = useToastmasterContext();

  const { selectedFacetValues, keyExists, searchTerms } = logsState;

  const onClick = () => {
    const onError = () => {
      toastmaster.addToast({
        status: 'error',
        text: 'Failed to create metric',
      });
    };

    const onSuccess = () => {
      toastmaster.addToast({
        status: 'success',
        text: `${metricName} saved successfully`,
      });
      modals.pop();
    };

    saveMetricRequest
      .call({
        ...form.values,
        component,
        selectedFacetValues,
        keyExists,
        metricName,
        name,
        searchTerms,
        type,
      })
      .then(onSuccess, onError);
  };

  return (
    <div className="modal modal--medium logs__active-facet__save-metric-modal">
      <div className="modal__header">
        <div className="modal__header__text">{`Create metric with ${component} / ${name}`}</div>
      </div>
      <div className="modal__body logs__active-facet__save-metric-modal__body">
        <div className="logs__active-facet__save-metric-modal__field">
          <div className="logs__active-facet__save-metric-modal__field__label">
            Metric Name
          </div>
          <Input onChange={setMetricName} value={metricName} />
        </div>
      </div>
      <div className="modal__footer">
        <button className="button button--primary" onClick={onClick}>
          Create Metric
        </button>
      </div>
    </div>
  );
};

export default LogsActiveFacetSaveMetricModal;
