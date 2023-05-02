import { Input, useModalsContext, useToastmasterContext } from 'components';
import { useRequest, useSearch } from 'hooks';
import React, { ReactElement, useState } from 'react';
import { saveTraceMetric } from 'requests';
import {
  SelectedFacetRangeByName,
  SelectedFacetValuesByName,
  SpanFilter,
} from 'types';

type Props = {
  getSavedTraceMetricsRequest: ReturnType<typeof useRequest>;
  selectedFacetRangeByName: SelectedFacetRangeByName;
  selectedFacetValuesByName: SelectedFacetValuesByName;
  spanFilter: SpanFilter;
  search: ReturnType<typeof useSearch>;
  traceIdSearch: string;
};

const TracesSaveMetricsModal = ({
  getSavedTraceMetricsRequest,
  selectedFacetRangeByName,
  selectedFacetValuesByName,
  spanFilter,
  search,
  traceIdSearch,
}: Props): ReactElement => {
  const [name, setName] = useState('');
  const modals = useModalsContext();
  const saveTraceMetricRequest = useRequest(saveTraceMetric);
  const toastmaster = useToastmasterContext();

  const onClick = () => {
    const onError = () => {
      toastmaster.addToast({
        status: 'error',
        text: 'Failed to create metric',
      });
    };

    const onSuccess = () => {
      getSavedTraceMetricsRequest.call();
      toastmaster.addToast({
        status: 'success',
        text: `${name} saved successfully`,
      });
      modals.pop();
    };

    saveTraceMetricRequest
      .call({
        name,
        search,
        selectedFacetRangeByName,
        selectedFacetValuesByName,
        spanFilter,
        traceIdSearch,
      })
      .then(onSuccess, onError);
  };

  return (
    <div className="modal modal--medium logs__active-facet__save-metric-modal">
      <div className="modal__header">
        <div className="modal__header__text">{`Create Saved Trace Metric`}</div>
      </div>
      <div className="modal__body logs__active-facet__save-metric-modal__body">
        <div className="logs__active-facet__save-metric-modal__field">
          <div className="logs__active-facet__save-metric-modal__field__label">
            Metric Name
          </div>
          <Input onChange={setName} type="text" value={name} />
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

export default TracesSaveMetricsModal;
