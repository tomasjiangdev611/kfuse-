import { SLOProps } from 'types';
import {
  onPromiseError,
  getStatusAndErrorBudget,
  transformSLOPromql,
} from 'utils';

import getSloList from './getSloList';
import promqlQuery from './promqlQuery';

const getSloStatusByService = async (
  service: string,
): Promise<{
  ok: SLOProps[];
  breached: SLOProps[];
}> => {
  const sloList = await getSloList();
  const slos = sloList.filter((slo: SLOProps) => slo.service === service);

  const datasets = await Promise.all(
    slos.map(async (slo: SLOProps) => {
      const numePromql = transformSLOPromql(slo.errorExpr);
      const denoPromql = transformSLOPromql(slo.totalExpr);

      return await promqlQuery({
        promqlQueries: [numePromql, denoPromql],
      });
    }),
  );

  if (!datasets) {
    return onPromiseError;
  }

  const sloStatusByService: { ok: SLOProps[]; breached: SLOProps[] } = {
    ok: [],
    breached: [],
  };

  slos.map((slo: SLOProps, index: number) => {
    const statusErrorBudget = getStatusAndErrorBudget(
      datasets[index],
      slo.budget,
    );

    if (statusErrorBudget) {
      slo.statusErrorBudget = statusErrorBudget;
      if (statusErrorBudget.statusColor === 'red') {
        sloStatusByService.breached.push(slo);
      } else {
        sloStatusByService.ok.push(slo);
      }
    }
  });

  return sloStatusByService;
};

export default getSloStatusByService;
