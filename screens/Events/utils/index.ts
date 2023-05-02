import { AutocompleteOption } from 'components';
import { SelectedFacetValuesByName } from 'types';

export const eventsCoreLabels = [
  { name: 'source_type_name', label: 'source', forceExpanded: true },
  { name: 'alert_type', label: 'status', forceExpanded: true },
  { name: 'host', label: 'host' },
  { name: 'text', label: 'message' },
  { name: 'priority', label: 'priority' },
];

export const eventsLabels = [
  { name: 'id' },
  { name: 'event_type' },
  { name: 'aggregation_key' },
];

export const rollupOptions = [
  { label: '1s', value: '1s' },
  { label: '2s', value: '2s' },
  { label: '5s', value: '5s' },
  { label: '10s', value: '10s' },
  { label: '20s', value: '20s' },
  { label: '30s', value: '30s' },
  { label: '1m', value: '1m' },
  { label: '2m', value: '2m' },
  { label: '5m', value: '5m' },
  { label: '10m', value: '10m' },
  { label: '20m', value: '20m' },
  { label: '30m', value: '30m' },
];

export const TopKoptions = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '15', value: 15 },
  { label: '25', value: 25 },
  { label: '50', value: 50 },
  { label: '100', value: 100 },
];

export const getLabelsOptions = (labels: Array<any>) => {
  const facetNamesOptions: AutocompleteOption[] = [];
  if (labels) {
    labels.forEach(({ name }: { name: string }) => {
      facetNamesOptions.push({
        label: name,
        value: name,
        optionType: 'label',
      });
    });
  }
  return facetNamesOptions;
};

export const getEventsFacetOptions = () => {
  const facetNamesOptions: AutocompleteOption[] = [];
  if (eventsLabels) {
    eventsCoreLabels.forEach(({ name, label }) => {
      facetNamesOptions.push({
        label: label || name,
        value: name,
        optionType: 'facet',
      });
    });
    eventsLabels.forEach(({ name }: { name: string }) => {
      facetNamesOptions.push({
        label: name,
        value: name,
        optionType: 'facet',
      });
    });
  }
  return facetNamesOptions;
};

export const getValuesOptions = (
  values: Array<{ count: number; value: string }>,
): AutocompleteOption[] => {
  const facetValuesOptions: AutocompleteOption[] = [];
  if (values) {
    values.forEach(({ value }) => {
      facetValuesOptions.push({
        label: value,
        value,
        optionType: 'value',
      });
    });
  }
  return facetValuesOptions;
};

export const getFilterByFacetTags = (
  facetTags: { [key: string]: boolean },
  removeFilter: (val: string) => void,
): Array<any> => {
  return Object.keys(facetTags).map((facet) => {
    return {
      label: facet,
      onRemove: () => {
        removeFilter(facet);
      },
    };
  });
};

export const getSearchTermsTags = (
  searchTerms: string[],
  removeSearchTermByIndex: (index: number) => void,
): Array<any> => {
  return searchTerms.map((searchTerm: string, i: number) => ({
    label: `search:${searchTerm}`,
    onRemove: () => {
      removeSearchTermByIndex(i);
    },
  }));
};

export const getFacetValuesTags = (
  selectedFacetValuesByName: SelectedFacetValuesByName,
  toggleFacetValue: ({ name, value }: { name: string; value: string }) => void,
): any => {
  const facetValuesTags: Array<any> = [];
  Object.keys(selectedFacetValuesByName).forEach((facetName) => {
    const facetValuesObj = selectedFacetValuesByName[facetName];
    Object.keys(facetValuesObj).forEach((facetValue) => {
      const isMinus = facetValuesObj[facetValue] === 0 ? '-' : '';
      facetValuesTags.push({
        label: `${isMinus}${facetName}:${facetValue}`,
        onRemove: () => {
          toggleFacetValue({ name: facetName, value: facetValue });
        },
      });
    });
  });

  return facetValuesTags;
};
