import delimiter from 'constants/delimiter';
import { logsQueryOperator, getLogsOperatorInQuery } from 'utils';
import formatFacetName from './formatFacetName';

/**
 * Builds a query for a facet.
 * @param {string[]} facetNames
 * @returns {string}
 * example input for buildFacetQuery:
 * cluster-name=demo
 * cluster-name!=observes
 * cluster-name=~^.*observes.*$
 * cluster-name>=0.1
 * cluster-name<=0.2
 * Output:
 * { eq: { facetName: "cluster-name", value: "demo" } }
 * { neq: { facetName: "cluster-name", value: "observes" } }
 * { regex: { facetName: "cluster-name", value: "^.*observes.*$" } }
 * { gte: { facetName: "cluster-name", value: "0.1" } }
 * { lte: { facetName: "cluster-name", value: "0.2" } }
 */
export const buildFacetQuery = (facetList: string[]): string => {
  if (!facetList || facetList.length === 0) {
    return '';
  }
  const facetListBitmap: { [key: string]: Array<any> } = {};
  facetList.map((facet) => {
    const splitOperator = getLogsOperatorInQuery(facet);
    if (splitOperator) {
      const [component, value] = facet.split(splitOperator);
      const trimmedFacetName =
        component.charAt(0) === '@' ? component.substring(1) : component;
      const [source, facetName] = trimmedFacetName.split(':');
      const sourceWithOperator = `${source}${delimiter}${splitOperator}`;
      if (!facetListBitmap[sourceWithOperator]) {
        facetListBitmap[sourceWithOperator] = [];
      }

      facetListBitmap[sourceWithOperator].push({
        facetName: formatFacetName(source, facetName),
        operator: logsQueryOperator[splitOperator],
        value,
      });
    }
  });

  let result = '';
  const sourceList = Object.keys(facetListBitmap);
  sourceList.map((source) => {
    const facetList = facetListBitmap[source];
    result += `{ or: [`;
    facetList.map((facet) => {
      if (facet.operator === 'notregex') {
        result += `{ not: { regex: { facetName: "${facet.facetName}", value: ${facet.value} } }}`;
      } else {
        result += `{ ${facet.operator}: { facetName: "${facet.facetName}", value: ${facet.value} } }`;
      }
    });
    result += `]} `;
  });

  return result;
};
