import delimiter from 'constants/delimiter';
import { FilterProps } from 'types';

import { buildFacetQuery } from './buildFacetQuery';
import buildFingerprintsLogQuery from './buildFingerprintsLogQuery';
import buildSelectedFacetsQuery from './buildSelectedFacetsQuery';
import buildSearchTermsFilter from './buildSearchTermsFilter';
import formatFacetName from './formatFacetName';

type Args = FilterProps & {
  source?: string;
};

const buildQuery = ({
  facetName,
  filterByFacets = [],
  filterOrExcludeByFingerprint = {},
  keyExists = {},
  logLevel,
  searchTerms = [],
  selectedFacetValues,
  source = null,
}: Args): string => {
  let result = '{';
  result += 'and: [';
  result += buildFingerprintsLogQuery(filterOrExcludeByFingerprint);

  result += buildSearchTermsFilter(searchTerms);

  if (logLevel) {
    result += `{ eq: { facetName: "level", value: "${logLevel}" } }`;
  }

  if (facetName) {
    result += `{ startsWith: { facetName: "${facetName}", value: "" } }`;
  }

  if (source) {
    result += `{ eq: { facetName: "source", value: "${source}" } }`;
  }

  Object.keys(keyExists)
    .filter((facetKeyWithType) => keyExists[facetKeyWithType])
    .forEach((facetKeyWithType) => {
      const [component, name, type] = facetKeyWithType.split(delimiter);
      result += `{ keyExists: "${formatFacetName(component, name, type)}" }`;
    });

  result += buildSelectedFacetsQuery(selectedFacetValues);

  result += buildFacetQuery(filterByFacets);
  result += ']';

  result += '}';
  return result;
};

export default buildQuery;
