import { delimiter } from 'constants';
import { FilterProps } from 'types';

import query from './query';
import { buildQuery, formatFacetName } from './utils';

const isNotCloudOrKubernetes = (dimension: string) => {
  const [component] = dimension.split(delimiter);
  return component !== 'Cloud' && component !== 'Kubernetes';
};

type Args = FilterProps & {
  component: string;
  dimensions: string[];
  metricName: string;
  name: string;
};

const saveMetric = async ({
  component,
  selectedFacetValues,
  dimensions,
  filterByFacets,
  filterOrExcludeByFingerprint,
  keyExists,
  metricName,
  name,
  searchTerms,
}: Args): Promise<Record<'saveMetric', null>> => {
  const logQuery = buildQuery({
    selectedFacetValues,
    filterByFacets,
    filterOrExcludeByFingerprint,
    keyExists,
    searchTerms,
  });

  return query<null, 'saveMetric'>(`
    mutation {
      saveMetric(
        dimensions: [${dimensions
          .filter(isNotCloudOrKubernetes)
          .map((dimension: string) => {
            const [dimensionComponent, dimensionName] =
              dimension.split(delimiter);
            return `"${formatFacetName(dimensionComponent, dimensionName)}"`;
          })}]
        ${logQuery !== '{}' ? `filter: ${logQuery},` : ''}
        metricFacet: "${formatFacetName(component, name)}"
        metricName: "${metricName}"
        source_types: ["${component}"]
      )
    }
  `);
};

export default saveMetric;
