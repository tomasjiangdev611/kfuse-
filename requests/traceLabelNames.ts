import dayjs from 'dayjs';
import { DateSelection, SelectedFacetValuesByName } from 'types';
import { onPromiseError } from 'utils';
import queryTraceService from './queryTraceService';

type FacetNamesByGroup = { [key: string]: string[] };

type Result = {
  facetNamesByGroup: FacetNamesByGroup;
  ungrouped: string[];
};

const formatResult = (result: string[]): Result => {
  const ungrouped: string[] = [];

  const facetNamesByGroup: FacetNamesByGroup = {};

  result.forEach((name) => {
    const parts = name.split('.');
    if (parts.length === 1) {
      ungrouped.push(name);
    } else {
      const [group] = parts;
      if (!facetNamesByGroup[group]) {
        facetNamesByGroup[group] = [];
      }

      facetNamesByGroup[group].push(name);
    }
  });

  return {
    facetNamesByGroup: Object.keys(facetNamesByGroup).reduce(
      (obj, group) => ({
        ...obj,
        [group]: facetNamesByGroup[group].sort(),
      }),
      {},
    ),
    ungrouped: ungrouped.sort(),
  };
};

type Args = {
  date: DateSelection;
};

const traceLabelNames = async ({ date }: Args): Promise<Result> => {
  const { startTimeUnix, endTimeUnix } = date;
  const endTime = dayjs.unix(endTimeUnix);
  const durationSecs = endTimeUnix - startTimeUnix;
  return queryTraceService<string[], 'labelNames'>(`
    {
      labelNames(
        durationSecs: ${durationSecs},
        timestamp: "${endTime.format()}",
      )
    }
  `)
    .then((data) => data.labelNames || [], onPromiseError)
    .then(formatResult, onPromiseError);
};

export default traceLabelNames;
