import { chartingPalette, serviceTableKpis } from 'constants';
import { useRequest } from 'hooks';
import { useMemo, useState } from 'react';
import { queryRange } from 'requests';
import { getInstantRateIntervalAndStep } from 'utils';
import { buildFilterFromFormValues, formatDatasets } from './utils';

type GetQueriesArgs = {
  property: string;
  rateInterval: string;
  service: string;
  stepInMs: number;
};

const getQueries = ({
  property,
  rateInterval,
  service,
  stepInMs,
}: GetQueriesArgs) => {
  return serviceTableKpis.map((kpi) => ({
    key: kpi.key,
    query: kpi.serviceQuery({ property, rateInterval, service, stepInMs }),
  }));
};

const useKpisBySpanNameRequest = () => {
  const [state, setState] = useState({});

  const tableRequest = useRequest(({ date, formValues, property, service }) => {
    const timeDuration = `${date.endTimeUnix - date.startTimeUnix}s`;
    const formValueFilters = buildFilterFromFormValues(formValues);
    const formValueFiltersString = formValueFilters
      ? `,${formValueFilters}`
      : '';

    return queryRange({
      date,
      instant: true,
      query: `sum by (service_name, ${property}) (increase(spans_total{service_name="${service}"${formValueFiltersString}}[${timeDuration}]))`,
    }).then((datasets) =>
      datasets.map((dataset) => ({ name: dataset.metric[property] })),
    );
  });

  const fetchKkpisBySpanName = ({ date, property, service }) => {
    const { rateInterval, stepInMs } = getInstantRateIntervalAndStep({ date });
    const queries = getQueries({
      property,
      rateInterval,
      service,
      stepInMs,
    });
    return Promise.all(
      queries.map(({ key, query }) =>
        queryRange({ date, instant: true, query }).then(
          formatDatasets(property, key, setState),
        ),
      ),
    );
  };

  const colorMap = useMemo(
    () =>
      (tableRequest.result || []).reduce(
        (obj, row, i) => ({
          ...obj,
          [row.name]: chartingPalette[i % chartingPalette.length],
        }),
        {},
      ),
    [tableRequest.result],
  );

  return {
    colorMap,
    fetch: ({ date, formValues, property, service }) => {
      tableRequest.call({ date, formValues, property, service });
      fetchKkpisBySpanName({ date, property, service });
    },
    fetchSingleColumn: ({ date, key, property, service }) => {
      const kpi = serviceTableKpis.find((kpi) => kpi.key === key);
      if (kpi) {
        const { rateInterval, stepInMs } = getInstantRateIntervalAndStep({
          date,
        });
        const query = kpi.serviceQuery({
          property,
          rateInterval,
          service,
          stepInMs,
        });

        queryRange({ date, instant: true, query }).then(
          formatDatasets(property, key, setState),
        );
      }
    },
    kpisBySpanName: state || {},
    tableRequest,
  };
};

export default useKpisBySpanNameRequest;
