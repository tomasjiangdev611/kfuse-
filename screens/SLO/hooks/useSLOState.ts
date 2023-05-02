import {
  useDateState,
  useRequest,
  useSelectedFacetValuesByNameState,
} from 'hooks';
import { useEffect, useState } from 'react';
import { deleteSlo, getSloList, promqlQuery } from 'requests';
import { getDateFromRange } from 'screens/Dashboard/utils';
import { SLOProps, ValueCount } from 'types';
import { getStatusAndErrorBudget, transformSLOPromql } from 'utils';

import { getSLOServiceFacetValues } from '../utils';

const useSLOState = () => {
  const selectedFacetValuesByNameState = useSelectedFacetValuesByNameState();
  const [date, setDate] = useDateState(getDateFromRange('now-1h', 'now'));
  const [sloList, setSloList] = useState([]);
  const [sloFilterProperties, setSloFilterProperties] = useState<{
    [key: string]: ValueCount[];
  }>({
    status: [
      { value: 'OK', count: 0 },
      { value: 'Breached', count: 0 },
    ],
    service: [],
    tags: [],
  });

  const sloListRequest = useRequest(getSloList);
  const promqlQueryRequest = useRequest(promqlQuery);
  const deleteSloRequest = useRequest(deleteSlo);

  const getSLOStateFacetValues = (facetName: string) => () => {
    return new Promise((resolve) => {
      resolve(sloFilterProperties[facetName.toLocaleLowerCase()]);
    });
  };

  const loadSLOList = async () => {
    sloListRequest.call().then((response: SLOProps[]) => {
      const serviceFacetValues = getSLOServiceFacetValues(response);
      setSloFilterProperties({
        ...sloFilterProperties,
        service: serviceFacetValues,
      });
      response.map(async (slo) => {
        const numePromql = transformSLOPromql(slo.errorExpr);
        const denoPromql = transformSLOPromql(slo.totalExpr);

        const dataset = await promqlQueryRequest.call({
          date,
          promqlQueries: [numePromql, denoPromql],
        });
        const statusErrorBudget = getStatusAndErrorBudget(dataset, slo.budget);

        if (statusErrorBudget) {
          slo.statusErrorBudget = statusErrorBudget;
          if (statusErrorBudget.statusColor === 'red') {
            sloFilterProperties.status[1].count += 1;
          } else {
            sloFilterProperties.status[0].count += 1;
          }
        }
        setSloList([...response]);
      });
    });
  };

  useEffect(() => {
    loadSLOList();
  }, []);

  return {
    deleteSloRequest,
    getSLOStateFacetValues,
    loadSLOList,
    selectedFacetValuesByNameState,
    sloList,
    sloListRequest,
    setSloFilterProperties,
  };
};

export default useSLOState;
