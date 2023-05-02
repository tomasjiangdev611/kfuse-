import { SelectedFacetValuesByName, SpanFilter } from 'types';
import getIsDeselecting from './getIsDeselecting';

export const buildPromQLClausesFromSelectedFacetValuesByName = (
  selectedFacetValuesByName: SelectedFacetValuesByName,
  spanFilter?: SpanFilter,
): string[] => {
  const clauses: string[] = [];

  Object.keys(selectedFacetValuesByName).forEach((name) => {
    const selectedFacetValues = selectedFacetValuesByName[name];
    const selectedFacetValueKeys = Object.keys(selectedFacetValues);
    const isDeselecting = getIsDeselecting(selectedFacetValues);

    const clause = `${name}${
      isDeselecting ? '!=' : `=${selectedFacetValueKeys.length > 1 ? '~' : ''}`
    }"${selectedFacetValueKeys.join('|')}"`;
    clauses.push(clause);
  });

  if (spanFilter && spanFilter !== SpanFilter.allSpans) {
    clauses.push(
      `${
        spanFilter === SpanFilter.serviceEntrySpans
          ? 'service_entry'
          : spanFilter
      }="true"`,
    );
  }

  return clauses;
};

export const buildPromQLFilterFromSelectedFacetValuesByName = (
  selectedFacetValuesByName: SelectedFacetValuesByName,
  spanFilter?: SpanFilter,
): string => {
  const clauses = buildPromQLClausesFromSelectedFacetValuesByName(
    selectedFacetValuesByName,
    spanFilter,
  );

  return clauses.length ? `{${clauses.join(',')}}` : '';
};
