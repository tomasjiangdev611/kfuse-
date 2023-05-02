import { SunburstGraph } from 'components/Chart';
import { Table } from 'components/Table';
import { useMetricsQueryState, useRequest } from 'hooks';
import { debounce } from 'lodash';
import React, { ReactElement, useEffect } from 'react';
import { promqlQuery } from 'requests';
import { ExplorerQueryProps } from 'types';
import { convertNumberToReadableUnit } from 'utils/formatNumber';

import { getPromqlForQueryAndFormula } from '../../utils';

const columns = (colName: string) => [
  {
    key: 'name',
    label: colName,
    renderCell: ({ row }) => {
      return row.metric_names.join(' > ');
    },
  },
  {
    key: 'size',
    label: 'Value',
    renderCell: ({ row }) => convertNumberToReadableUnit(row.size),
  },
  {
    key: 'percentage',
    label: 'Percentage',
    renderCell: ({ row }) => {
      return `${row.percentage.toFixed(2)}%`;
    },
  },
];

const PieChartGraph = ({
  metricsQueryState,
}: {
  metricsQueryState: ReturnType<typeof useMetricsQueryState>;
}): ReactElement => {
  const promqlQueryRequest = useRequest(promqlQuery);
  const { charts } = metricsQueryState;
  const { formulas, queries } = charts[0];
  useEffect(() => {
    const { formulas, queries } = charts[0];
    const { promqlFormulas, promqlQueries } = getPromqlForQueryAndFormula(
      queries,
      formulas,
    );

    if (promqlFormulas.length > 0) {
      promqlQueryRequest.call({ promqlQueries: promqlFormulas });
      callPromqlQuery(promqlFormulas);
    } else {
      const activeIndex = queries.findIndex(
        (query: ExplorerQueryProps) => query.isActive,
      );
      const activePromql = promqlQueries[activeIndex];
      callPromqlQuery([activePromql]);
    }
  }, [queries, formulas]);

  const callPromqlQuery = (promql: string[]) => {
    debounce(
      () =>
        promqlQueryRequest.call({
          labels: charts[0].queries[0].labels,
          promqlQueries: promql,
          responseFormat: 'piechart',
        }),
      2000,
    )();
  };

  return (
    <div className="dashboard__widget__piechart">
      <div className="dashboard__widget__piechart__graph">
        {promqlQueryRequest.result && (
          <SunburstGraph
            data={promqlQueryRequest.result.data || []}
            height={340}
            width={document.body.clientWidth / 2 - 100}
          />
        )}
      </div>
      <div className="dashboard__widget__piechart__table">
        <Table
          columns={columns(charts[0].queries[0].labels.join(' > ') || 'Name')}
          rows={promqlQueryRequest.result?.tableData || []}
        />
      </div>
    </div>
  );
};

export default PieChartGraph;
