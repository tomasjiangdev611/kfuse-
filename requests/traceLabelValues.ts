import dayjs from 'dayjs';
import {
  DateSelection,
  SelectedFacetRangeByName,
  SelectedFacetValuesByName,
  SpanFilter,
  ValueCount,
} from 'types';
import { onPromiseError } from 'utils';
import queryTraceService from './queryTraceService';
import { buildTracesFilter } from './utils';

type Args = {
  date: DateSelection;
  labelName: string;
  selectedFacetRangeByName?: SelectedFacetRangeByName;
  selectedFacetValuesByName?: SelectedFacetValuesByName;
  spanFilter: SpanFilter;
};

const traceLabelValues = async ({
  date,
  labelName,
  selectedFacetRangeByName = {},
  selectedFacetValuesByName = {},
  spanFilter,
}: Args): Promise<ValueCount[]> => {
  const { startTimeUnix, endTimeUnix } = date;
  const endTime = dayjs.unix(endTimeUnix);
  const durationSecs = endTimeUnix - startTimeUnix;
  return queryTraceService<ValueCount[], 'labelValues'>(`
    {
      labelValues(
        durationSecs: ${durationSecs},
        filter: ${buildTracesFilter({
          selectedFacetRangeByName,
          selectedFacetValuesByName,
          spanFilter,
        })},
        labelName: "${labelName}",
        timestamp: "${endTime.format()}",
      ) {
        count
        value
      }
    }
  `).then((data) => data.labelValues || [], onPromiseError);
};

export default traceLabelValues;
