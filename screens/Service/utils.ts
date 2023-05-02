import {
  PrometheusDataset,
  SelectedFacetValuesByName,
  SpanFilter,
} from 'types';

export const formatDatasets =
  (property: string, key: string, setState) => (result: PrometheusDataset) => {
    setState((prevState) => {
      const nextState = { ...prevState };

      result.forEach((dataset) => {
        const { metric, value } = dataset;
        const propertyValue = metric[property];

        if (!nextState[propertyValue]) {
          nextState[propertyValue] = {};
        }

        if (value.length > 1) {
          nextState[propertyValue][key] = Number(value[1]);
        }
      });

      return nextState;
    });
  };

export const buildFilterFromFormValues = (
  formValues: {
    [key: string]: any;
  },
  spanFilter?: SpanFilter,
): string => {
  const result = Object.keys(formValues)
    .filter((key) => formValues[key])
    .map((key) => `${key}="${formValues[key]}"`);

  if (spanFilter && spanFilter !== SpanFilter.allSpans) {
    result.push(
      `${
        spanFilter === SpanFilter.serviceEntrySpans
          ? 'service_entry'
          : spanFilter
      }="true"`,
    );
  }

  return result.join(',');
};

export const buildSelectedFacetValuesByName = (formValues: {
  [key: string]: any;
}): SelectedFacetValuesByName =>
  Object.keys(formValues)
    .filter((key) => formValues[key])
    .reduce((obj, key) => ({ ...obj, [key]: { [formValues[key]]: 1 } }), {});
