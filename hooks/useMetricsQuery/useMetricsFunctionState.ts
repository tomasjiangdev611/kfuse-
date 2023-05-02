import { Dispatch, SetStateAction } from 'react';
import {
  ExplorerQueryProps,
  FormulaProps,
  VectorTypes,
} from 'types/MetricsQueryBuilder';
import {
  AGGREGATE_FUNCTIONS,
  checkIfQueryHasAnomaly,
  getFunctionParams,
} from 'utils/MetricsQueryBuilder';

import useMetricsDataState from './useMetricsDataState';

const useMetricsFunction = (
  formulas: FormulaProps[],
  queries: ExplorerQueryProps[],
  metricsDataState: ReturnType<typeof useMetricsDataState>,
  setQueries: Dispatch<SetStateAction<ExplorerQueryProps[]>>,
) => {
  const { callOnePromqlQuery } = metricsDataState;

  const addFunction = (
    queryIndex: number,
    functionName: string,
    vectorType: VectorTypes,
  ) => {
    setQueries((prevQueries: ExplorerQueryProps[]) => {
      const newQueries = [...prevQueries];
      const { metric, functions } = newQueries[queryIndex];
      const functionParams = getFunctionParams(functionName);

      const funcObj = {
        name: functionName,
        params: functionParams,
        vectorType,
      };
      const newFunctions = [...functions];
      if (checkIfQueryHasAnomaly(newQueries[queryIndex])) {
        newFunctions.splice(newFunctions.length - 1, 0, funcObj);
      } else {
        newFunctions.push(funcObj);
      }
      newQueries[queryIndex].functions = newFunctions;

      if (metric !== '') {
        callOnePromqlQuery(formulas, queries, queryIndex, 'query');
      }
      return newQueries;
    });
  };

  const updateFunction = (
    queryIndex: number,
    fnIndex: number,
    paramIndex: number,
    value: any,
  ) => {
    setQueries((prevQueries: ExplorerQueryProps[]) => {
      const newQueries = [...prevQueries];
      const { metric, functions } = newQueries[queryIndex];
      const newFunctions = [...functions];

      if (
        AGGREGATE_FUNCTIONS.includes(newFunctions[fnIndex].name) &&
        paramIndex === 0
      ) {
        if (value === 'quantile') {
          newFunctions[fnIndex].params.push({
            name: 'quantile',
            default: 0.99,
            value: 0.99,
            type: 'text',
          });
        } else {
          newFunctions[fnIndex].params = newFunctions[fnIndex].params.filter(
            (param) => param.name !== 'quantile',
          );
        }
      }

      newFunctions[fnIndex].params[paramIndex].value = value;
      newQueries[queryIndex].functions = newFunctions;

      if (metric === '') {
        return newQueries;
      }

      if (newFunctions[fnIndex].params[paramIndex].type === 'text') {
        callOnePromqlQuery(
          formulas,
          newQueries,
          queryIndex,
          'query',
          'debounce',
        );
      } else {
        callOnePromqlQuery(formulas, newQueries, queryIndex, 'query');
      }

      return newQueries;
    });
  };

  const removeFunction = (queryIndex: number, functionIndex: number) => {
    setQueries((prevQueries: ExplorerQueryProps[]) => {
      const newQueries = [...prevQueries];
      const { metric, functions } = newQueries[queryIndex];
      const newFunctions = [...functions];
      newFunctions.splice(functionIndex, 1);
      newQueries[queryIndex].functions = newFunctions;

      if (metric !== '') {
        callOnePromqlQuery(formulas, newQueries, queryIndex, 'query');
      }
      return newQueries;
    });
  };

  return { addFunction, removeFunction, updateFunction };
};

export default useMetricsFunction;
