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

const buildTracesFilterToJSON = ({
  parentSpanIdFilter,
  selectedFacetRangeByName,
  selectedFacetValuesByName,
  spanFilter,
  traceIdSearch,
}: Args): any => {
  const names = Object.keys(selectedFacetValuesByName);
  const result = { and: [] };

  names.forEach((name) => {
    const selectedFacetValues = selectedFacetValuesByName[name];
    const isDeselecting = getIsDeselecting(selectedFacetValues);

    const clause = { or: [] };

    Object.keys(selectedFacetValues).forEach((value) => {
      const innerClause: { [key: string]: any } = {};

      const isServiceName = name === 'service_name';
      const innerClauseKey = isServiceName
        ? 'serviceFilter'
        : 'attributeFilter';
      const equalityClause = {
        [isDeselecting ? 'neq' : 'eq']: isServiceName
          ? { name: value }
          : { key: name, value },
      };

      innerClause[innerClauseKey] = equalityClause;
      clause.or.push(innerClause);
    });

    result.and.push(clause);
  });

  if (selectedFacetRangeByName) {
    Object.keys(selectedFacetRangeByName).forEach((name) => {
      const { lower, upper } = selectedFacetRangeByName[name];
      result.and.push({
        spanDurationFilter: { lowerBound: lower, upperBound: upper },
      });
    });
  }

  if (parentSpanIdFilter) {
    result.and.push({ ParentSpanIdFilter: { id: parentSpanIdFilter } });
  }

  if (spanFilter && spanFilter !== SpanFilter.allSpans) {
    result.and.push({ spanTypeFilter: { spanType: spanFilter } });
  }

  if (traceIdSearch) {
    result.and.push({ traceIdFilter: { id: traceIdSearch } });
  }

  return result;
};

export default buildTracesFilterToJSON;
