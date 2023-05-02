import { AutocompleteOption } from 'components';
import { delimiter, getCoreCloudKubernetesOptions } from 'constants';
import {
  FacetName,
  NormalizeFunction,
  RangeAggregate,
  RangeAggregatesForCount,
  VectorAggregate,
} from 'types';

export const getFacetNamesOptionsForAlert = (
  facets: FacetName[],
): AutocompleteOption[] => {
  const facetNamesOptions = facets
    .map((facet) => ({
      label: `${facet.source}:${facet.name}`,
      value: `${facet.source}${delimiter}${facet.name}${delimiter}${facet.type}`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  facetNamesOptions.unshift({ label: 'count_log_events', value: '*' });
  return facetNamesOptions;
};

export const getRangeAggregateOptions = (
  metric: string,
): AutocompleteOption[] => {
  return Object.keys(RangeAggregate).map((key) => ({
    label: key,
    value: key,
    disabled: metric === '*' ? !Boolean(key in RangeAggregatesForCount) : false,
  }));
};

export const getVectorAggregateOptions = (): AutocompleteOption[] => {
  const vectorAggregateOptions: AutocompleteOption[] = [
    { label: 'none', value: 'none' },
  ];
  Object.keys(VectorAggregate).map((key) =>
    vectorAggregateOptions.push({ label: key, value: key }),
  );

  return vectorAggregateOptions;
};

export const normalizeFunctionOptions: AutocompleteOption[] = [
  { label: 'bytes', value: NormalizeFunction.Bytes },
  { label: 'count', value: 'count' },
  { label: 'duration', value: NormalizeFunction.Duration },
  { label: 'number', value: 'number' },
];

export const getLabelAndFacetGroupingOptions = (
  facetNamesOptions: AutocompleteOption[],
  source: string,
): AutocompleteOption[] => {
  const sourceOptionsAt = facetNamesOptions.map((option) => {
    return { label: `@${option.label}`, value: `@${option.label}` };
  });

  const sortedGorup = [
    ...sourceOptionsAt,
    ...getCoreCloudKubernetesOptions(),
  ].sort((a, b) => a.label.localeCompare(b.label));

  return sortedGorup;
};

export const getLabelAndFacetWithDelimiter = (
  labelAndFacet: string[],
): string[] => {
  return labelAndFacet.map((label) => {
    if (label.startsWith('@')) {
      const labelWithoutAt = label.replace('@', '');
      const [source, name] = labelWithoutAt.split(':');
      return `${source}${delimiter}${name}${delimiter}string`;
    }
    return label;
  });
};
