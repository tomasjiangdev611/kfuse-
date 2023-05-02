import { delimiter } from 'constants';
import { getSelectedFacetValuesByFacetKey } from 'utils';
import formatFacetName from './formatFacetName';

const buildFacetExpression = ({ component, facetName, facetValue, operator }) =>
  `{ ${operator}: { facetName: "${formatFacetName(
    component,
    facetName,
  )}", value: "${facetValue.replace(/"/g, '\\"')}" } }`;

const getSelectedFacetQuery = (facetKey, selectedFacetValuesByFacetKey) => {
  const [component, facetName] = facetKey.split(delimiter);
  const facetValues = Object.keys(selectedFacetValuesByFacetKey);
  const operator =
    selectedFacetValuesByFacetKey[facetValues[0]] === 1 ? 'eq' : 'neq';

  if (facetValues.length === 1) {
    return buildFacetExpression({
      component,
      facetName,
      facetValue: facetValues[0],
      operator,
    });
  }

  let result = `{ ${operator === 'eq' ? 'or' : 'and'}: [`;
  facetValues.forEach((facetValue) => {
    result += buildFacetExpression({
      component,
      facetName,
      facetValue,
      operator,
    });
  });
  result += ']}';

  return result;
};

const buildSelectedFacetsQuery = (selectedFacetValues) => {
  const facetValueCompositeKeys = Object.keys(selectedFacetValues);
  if (!facetValueCompositeKeys.length) {
    return '';
  }

  const selectedFacetValuesByFacetKey =
    getSelectedFacetValuesByFacetKey(selectedFacetValues);
  const facetKeys = Object.keys(selectedFacetValuesByFacetKey);

  if (facetKeys.length === 1) {
    return getSelectedFacetQuery(
      facetKeys[0],
      selectedFacetValuesByFacetKey[facetKeys[0]],
    );
  }

  let result = '{ and: [';
  facetKeys.forEach((facetKey) => {
    result += getSelectedFacetQuery(
      facetKey,
      selectedFacetValuesByFacetKey[facetKey],
    );
  });
  result += '] }';

  return result;
};

export default buildSelectedFacetsQuery;
