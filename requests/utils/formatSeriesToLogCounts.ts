import { FacetValue, TimeSeries } from 'types';

const formatSeriesToLogCounts = (timeseries: TimeSeries[]): FacetValue[] => {
  const result: FacetValue[] = [];

  timeseries.forEach((timeseriesItem) => {
    const { points, tags } = timeseriesItem;
    const tagKeys = Object.keys(tags);
    const facetName = tagKeys.length ? tagKeys[0] : '';
    const facetValue = tagKeys.length ? tags[tagKeys[0]] : '';

    points.forEach((point) => {
      result.push({
        bucketStart: point.ts,
        count: point.value,
        facetName,
        facetValue,
      });
    });
  });

  return result;
};

export default formatSeriesToLogCounts;
