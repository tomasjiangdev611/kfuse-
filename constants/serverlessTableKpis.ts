import { SelectedFacetValuesByName } from 'types';
import { buildPromQLFilterFromSelectedFacetValuesByName } from 'utils';

const serverlessTableKpis = [
  {
    key: 'invocations',
    label: 'Invocations',
    query: (
      timeDuration: string,
      selectedFacetValuesByName: SelectedFacetValuesByName,
    ): string => {
      const filter = buildPromQLFilterFromSelectedFacetValuesByName(
        selectedFacetValuesByName,
      );
      return `sum by (FunctionName) (sum_over_time(aws_lambda_invocations_count${filter}[${timeDuration}]))`;
    },
  },
  {
    key: 'duration',
    label: 'Duration',
    query: (
      timeDuration: string,
      selectedFacetValuesByName: SelectedFacetValuesByName,
    ): string => {
      const filter = buildPromQLFilterFromSelectedFacetValuesByName(
        selectedFacetValuesByName,
      );
      return `sum by (FunctionName) (sum_over_time(aws_lambda_duration_sum${filter}[${timeDuration}]))`;
    },
  },
  {
    key: 'errors',
    label: 'Errors',
    query: (
      timeDuration: string,
      selectedFacetValuesByName: SelectedFacetValuesByName,
    ): string => {
      const filter = buildPromQLFilterFromSelectedFacetValuesByName(
        selectedFacetValuesByName,
      );
      return `sum by (FunctionName) (sum_over_time(aws_lambda_errors_count${filter}[${timeDuration}]))`;
    },
  },
];

export default serverlessTableKpis;
