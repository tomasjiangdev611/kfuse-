import { AutocompleteOption } from 'components';
import { getLogsOperatorInQuery, logsQueryOperator } from 'utils';

import { OptionType, SearchItemProps } from '../types';

export const getFacetNamesOptions = (
  facetNames: Array<{ name: string }>,
  optionType: OptionType,
): AutocompleteOption[] => {
  const facetNamesOptions: AutocompleteOption[] = [];
  if (facetNames) {
    facetNames.forEach(
      ({ component, name }: { component: string; name: string }) => {
        facetNamesOptions.push({
          label: `${optionType === 'facet' ? '@' : ''}${component}:${name}`,
          value: `${optionType === 'facet' ? '@' : ''}${component}:${name}`,
          optionType,
        });
      },
    );
  }
  return facetNamesOptions;
};

export const getFacetValuesOptions = (
  facetValues: { count: number; facetValue: string }[],
): AutocompleteOption[] => {
  const facetValuesOptions: AutocompleteOption[] = [];
  if (facetValues) {
    facetValues.forEach(({ facetValue }: { facetValue: string }) => {
      facetValuesOptions.push({
        label: facetValue,
        value: facetValue,
        optionType: 'value',
      });
    });
  }
  return facetValuesOptions;
};

export const isOptionsExist = (
  record: Array<any>,
  searchValue: string | undefined,
): boolean => {
  if (!searchValue) {
    return false;
  }
  return record.some((r) => r['value'] === searchValue);
};

/**
 * Convert component to autocomplete option
 * @param components
 * @returns {AutocompleteOption[]}
 */
export const getComponentOptions = (
  components: string[],
): AutocompleteOption[] => {
  const sortedComponents = components.sort((a, b) => (a > b ? 1 : -1));
  const options = [
    { label: 'Core', value: 'Core' },
    { label: 'Cloud', value: 'Cloud' },
    { label: 'Kubernetes', value: 'Kubernetes' },
  ];
  sortedComponents.forEach((component) => {
    if (!['Core', 'Cloud', 'Kubernetes'].includes(component)) {
      options.push({ label: component, value: component });
    }
  });
  return options;
};

/**
 * Parse operator from search term
 * @operator "=" | "!=" | ">" | "<" | ">=" | "<=" | "~="
 * @example
 * cluster-name="dem"
 * cluster-name!="obs"
 * cluster-name=~"^.*observes.*$""
 * cluster-name>="0.1"
 * cluster-name<="0.2"
 */
export const parseOperatorAndValue = (
  search: string,
  facetName: string,
): {
  parsedOperator: string;
  parsedValue: string;
} => {
  const startValueIndex = search.indexOf('"');
  if (startValueIndex === -1) {
    return { parsedOperator: '', parsedValue: '' };
  }
  const parsedOperator = search.substring(facetName.length, startValueIndex);
  let parsedValue = '';
  if (
    search[search.length - 1] === '"' &&
    startValueIndex != search.length - 1
  ) {
    parsedValue = search.substring(startValueIndex + 1, search.length - 1);
  }

  return { parsedOperator, parsedValue };
};

/**
 * Check facetname exist in search string
 * @param search string
 * @param facetName string
 * @returns boolean
 */
export const isFacetnameExist = (
  search: string,
  facetName: string,
): boolean => {
  const parsedFacetName = search.substring(0, facetName.length);
  return parsedFacetName === facetName;
};

/**
 * Check facetvalue exist in search string
 * @param search string
 * @param value string
 * @returns boolean
 */
export const isValueExist = (search: string, value: string): boolean => {
  const startValueIndex = search.indexOf('"');
  if (startValueIndex === -1 || search[search.length - 1] !== '"') {
    return false;
  }
  const parsedValue = search.substring(startValueIndex + 1, search.length);
  return parsedValue === value;
};

export const parseFilterByFacetQuery = (
  search: string,
  facetNames: AutocompleteOption[],
): SearchItemProps => {
  const operator = getLogsOperatorInQuery(search);
  if (!operator) {
    return null;
  }

  const splitQuery = search.split(operator);
  const facetName = splitQuery[0];
  const value = splitQuery[1];

  if (!facetName) {
    return null;
  }
  const facetNameExist = facetNames.find((facet) => facet.value === facetName);
  if (!facetNameExist) {
    return null;
  }

  if (!value.startsWith('"') || !value.endsWith('"') || value.length === 1) {
    return null;
  }
  const parsedValue = value.substring(1, value.length - 1);
  if (!parsedValue) {
    return null;
  }

  return {
    facetName,
    value: parsedValue,
    operator,
  };
};

/**
 * parse value from complete/incomplete search string
 * @param search string
 * @param facetName string
 * @param operatorSign string
 * @returns string
 * @example agent:body="dem" => dem
 * @example agent:body="dem => dem
 */
export const parseValueFromQuery = (search: string): string => {
  const startValueIndex = search.indexOf('"');
  if (startValueIndex === -1) {
    return '';
  }

  const lastCropIndex = search.charAt(search.length - 1) === '"' ? 1 : 0;
  const parsedValue = search.substring(
    startValueIndex + 1,
    search.length - lastCropIndex,
  );

  if (parsedValue === '"' || parsedValue === '""') {
    return '';
  }
  return parsedValue;
};

export const parseSearchTerm = (
  searchTerm: string,
  operator: string,
): {
  operator: string;
  search: string;
} => {
  // remove escape character
  if (searchTerm.charAt(0) === '\\') {
    searchTerm = searchTerm.substring(1);
  }

  const splitQuery = searchTerm.split(':');
  if (splitQuery.length === 1) {
    return { operator, search: searchTerm };
  }
  const [op, search] = splitQuery;
  if (!logsQueryOperator[op]) {
    return { operator: operator, search: searchTerm };
  }

  return { operator: op, search };
};

/**
 * Get las double quotes from search string
 * @param search string
 * @returns string
 * @example agent:body="dem" => "
 * @example agent:body="dem => "
 * @example agent:body=" =>
 * @example agent:body= =>
 */
export const getEndDoubleQuote = (search: string, value: string): string => {
  const lastChar = search.charAt(search.length - 1);
  // close double quote
  if (lastChar === '"' && value) {
    return '"';
  }

  // open double quote and value is empty
  if (lastChar === '"' && !value) {
    return '';
  }

  // open double quote and value is not empty
  if (lastChar !== '"' && value) {
    return '"';
  }

  return '';
};
