import delimiter from 'constants/delimiter';

/**
 * Get the grouped label and facet
 * @param rangeAggregateGrouping string[]
 * @returns
 */
export const getGroupedLabelAndFacet = (
  rangeAggregateGrouping: string[],
): string[] => {
  return rangeAggregateGrouping.map((grouping) => {
    const [component, name] = grouping.split(delimiter);
    if (!component || !name) {
      return grouping;
    }
    if (['Cloud', 'Core', 'Kubernetes', 'Additional'].includes(component)) {
      return `${component}:${name}`;
    }
    return `@${component}:${name}`;
  });
};

/**
 * get the label and facet
 * @param labelAndFacet string []
 * @example Cloud:cluster_name => cluster_name
 * @example @agent:body => @body
 */
export const getLabelAndFacetOnly = (labelAndFacet: string[]): string => {
  const labelAndFacetList = labelAndFacet.map((label) => {
    const [_, name] = label.split(':');
    if (label.charAt(0) === '@') {
      return `@${name}`;
    }
    return name;
  });
  return labelAndFacetList.join(',');
};
