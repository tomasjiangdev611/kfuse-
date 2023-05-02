import {
  Multiselect,
  AutocompleteOption,
  Input,
  useToastmasterContext,
  Loader,
} from 'components';
import {
  CloudLabels,
  CoreLabels,
  KubernetesLabels,
  delimiter,
} from 'constants';
import { useForm } from 'hooks';
import React, { ReactElement, useEffect, useState } from 'react';
import { LogsMetricQueryProps } from 'types/LogsMetricsQueryBuilder';

import { useLogsState } from '../hooks';
import { useLogsAnalytics } from './hooks';
import { getGroupedLabelAndFacet, getLabelAndFacetOnly } from './utils';

const createOptions = (labels) =>
  labels.map((label) => ({
    label: `${label.component}:${label.name}`,
    value: `${label.component}${delimiter}${label.name}${delimiter}${label.type}`,
  }));

const coreCloudAndKubernetesOptions = createOptions([
  ...CoreLabels,
  ...CloudLabels,
  ...KubernetesLabels,
]);

const LogsAnalyticsSaveMetrics = ({
  closeModal,
  logsAnalytics,
  logsState,
  queries,
}: {
  closeModal: () => void;
  logsAnalytics: ReturnType<typeof useLogsAnalytics>;
  logsState: ReturnType<typeof useLogsState>;
  queries: LogsMetricQueryProps[];
}): ReactElement => {
  const [isLoading, setIsLoading] = useState(false);
  const { saveLogsMetricsRequest, savedMetricsRequest } = logsAnalytics;
  const { addToast } = useToastmasterContext();
  const from = useForm({ name: '', labels: [] });
  const {
    filterByFacets,
    filterOrExcludeByFingerprint,
    keyExists,
    searchTerms,
    selectedFacetValues,
  } = logsState;
  const { onChange, values } = from;

  const onSave = () => {
    if (!values.name) {
      addToast({
        status: 'error',
        text: 'Name is mandatory for saving metric.',
      });
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(values.name)) {
      addToast({
        status: 'error',
        text: 'Name should only include underscore and alphanumeric characters.',
      });
      return;
    }
    setIsLoading(true);
    const { metric, normalizeFunction, rangeAggregate, rangeAggregateParam } =
      queries[0];
    const filtersObject = {
      filterByFacets,
      filterOrExcludeByFingerprint,
      keyExists,
      searchTerms,
      selectedFacetValues,
    };

    saveLogsMetricsRequest
      .call({
        filter: filtersObject,
        labels: getLabelAndFacetOnly(values.labels),
        metric,
        name: values.name,
        normalizeFunction,
        rangeAggregate,
        rangeAggregateParam,
      })
      .then((saveMetricResponse: any) => {
        if (saveMetricResponse) {
          addToast({ status: 'success', text: 'Metric saved successfully.' });
          closeModal();
        }
        savedMetricsRequest.call();
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const { rangeAggregateGrouping } = queries[0];
    if (rangeAggregateGrouping.length > 0) {
      const labels = getGroupedLabelAndFacet(rangeAggregateGrouping);
      onChange('labels', labels);
    } else {
      const allLabelsValues = coreCloudAndKubernetesOptions.map(
        (option: AutocompleteOption) => option.value,
      );
      const allLabels = getGroupedLabelAndFacet(allLabelsValues);
      onChange('labels', allLabels);
    }
  }, [queries]);

  return (
    <div className="logs__analytics__save-metrics">
      <div className="logs__analytics__save-metrics__header">Save metric</div>
      <Loader isLoading={isLoading}>
        <div className="logs__analytics__save-metrics__name">
          <label>Give metric a name</label>
          <Input
            name="name"
            placeholder="Give metric a name"
            onChange={(name) => onChange('name', name)}
            title="Give metric a name"
            type="text"
            value={values.name}
          />
        </div>
        <div className="logs__analytics__save-metrics__group-by">
          <label>Add or remove label</label>
          <Multiselect
            placeholder="Add or remove label"
            options={coreCloudAndKubernetesOptions}
            onChange={(value) => {
              const transformedLabel = getGroupedLabelAndFacet(value);
              onChange('labels', transformedLabel);
            }}
            value={values.labels}
          />
        </div>
        <div className="logs__analytics__save-metrics--save-button">
          <button className="button button--blue" onClick={onSave}>
            Save
          </button>
        </div>
      </Loader>
    </div>
  );
};

export default LogsAnalyticsSaveMetrics;
