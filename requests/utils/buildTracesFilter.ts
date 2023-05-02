import {
  SelectedFacetRangeByName,
  SelectedFacetValuesByName,
  SpanFilter,
} from 'types';
import { getIsDeselecting } from 'utils';

type Args = {
  parentSpanIdFilter?: string;
  selectedFacetRangeByName: SelectedFacetRangeByName;
  selectedFacetValuesByName: SelectedFacetValuesByName;
  spanFilter?: SpanFilter;
  traceIdSearch?: string;
};

export const buildTracesFilter = ({
  parentSpanIdFilter,
  selectedFacetRangeByName,
  selectedFacetValuesByName,
  spanFilter,
  traceIdSearch,
}: Args): string => {
  const names = Object.keys(selectedFacetValuesByName);
  let result = '{ and: [';

  names.forEach((name) => {
    const selectedFacetValues = selectedFacetValuesByName[name];
    const isDeselecting = getIsDeselecting(selectedFacetValues);

    result += `{ or: [`;
    Object.keys(selectedFacetValues).forEach((value) => {
      const isServiceName = name === 'service_name';
      result += '{';
      result += isServiceName ? 'serviceFilter' : 'attributeFilter';
      result += ': {';
      result += isDeselecting ? 'neq' : 'eq';
      result += ': ';

      if (isServiceName) {
        result += `{ name:"${value}"}`;
      } else {
        result += `{ key: "${name}", value:"${value}"}`;
      }
      result += '}';
      result += '}';
    });

    result += `]}`;
  });

  if (selectedFacetRangeByName) {
    Object.keys(selectedFacetRangeByName).forEach((name) => {
      const { lower, upper } = selectedFacetRangeByName[name];
      result += `{ spanDurationFilter: { lowerBound: ${lower}, upperBound: ${upper} }}`;
    });
  }

  if (parentSpanIdFilter) {
    result += `{ParentSpanIdFilter: {id: "${parentSpanIdFilter}"}}`;
  }

  if (spanFilter && spanFilter !== SpanFilter.allSpans) {
    result += `{spanTypeFilter: {spanType: "${spanFilter}"}}`;
  }

  if (traceIdSearch) {
    result += `{traceIdFilter: {id: "${traceIdSearch}"}}`;
  }

  // deprioritizing ci_test for now
  // result += `{attributeFilter: {eq: {key: "ci_test", value: "false"}}}`;

  result += '] }';

  return result;
};

export default buildTracesFilter;
