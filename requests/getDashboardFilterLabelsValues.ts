import { AutocompleteOption } from 'components';
import { DateSelection } from 'types';

import getLabelValues from './getLabelValues';

const getDashboardFilterLabelsValues = async (
  date: DateSelection,
  labels: string[],
): Promise<Array<AutocompleteOption[]>> => {
  const labelValues = await Promise.all(
    labels.map(async (label) => {
      const labelValue = await getLabelValues({ date, facetName: label });
      return labelValue;
    }),
  );

  const datasets: Array<AutocompleteOption[]> = [];
  labelValues.forEach((labelValue) => {
    const dataset: AutocompleteOption[] = [{ label: 'All', value: '*' }];
    labelValue.forEach(({ facetValue }) => {
      dataset.push({ label: facetValue, value: facetValue });
    });
    datasets.push(dataset);
  });
  return datasets;
};

export default getDashboardFilterLabelsValues;
