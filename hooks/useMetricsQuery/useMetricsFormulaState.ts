import { useUrlState, useToggle } from 'hooks';

import { ExplorerQueryProps, FormulaProps } from 'types/MetricsQueryBuilder';
import { validateArithmeticFormulas } from 'utils/MetricsQueryBuilder';

import useMetricsDataState from './useMetricsDataState';

const useMetricsFormulaState = (
  queries: ExplorerQueryProps[],
  metricsDataState: ReturnType<typeof useMetricsDataState>,
) => {
  const [formulas, setFormulas] = useUrlState('metricsFormulas', []);
  const toggleAddFormula = useToggle(false);
  const { callOnePromqlQuery, queryData, removeQueryData, setQueryData } =
    metricsDataState;

  const addFormula = () => {
    setFormulas((prevFormulas: FormulaProps[]) => {
      const newFormulas = [...prevFormulas];
      newFormulas.push({ expression: '', isActive: true, isValid: false });
      return newFormulas;
    });
  };

  const removeFormula = (formulaIndex: number) => {
    setFormulas((prevFormulas: FormulaProps[]) => {
      const newFormulas = [...prevFormulas];
      newFormulas.splice(formulaIndex, 1);
      removeQueryData(formulaIndex, 'formula', newFormulas.length);
      return newFormulas;
    });
  };

  const updateFormula = (
    formulaIndex: number,
    propertyKey: string,
    value: any,
  ) => {
    setFormulas((prevFormulas: FormulaProps[]) => {
      const newFormulas = [...prevFormulas];
      newFormulas[formulaIndex][propertyKey] = value;

      if (propertyKey === 'isActive') {
        setQueryData({ ...queryData });
        return newFormulas;
      }

      const queryKeys = queries.map((query) => query.queryKey);
      const isValid = validateArithmeticFormulas(value, queryKeys);
      if (isValid) {
        newFormulas[formulaIndex].isValid = true;
        callOnePromqlQuery(
          newFormulas,
          queries,
          formulaIndex,
          'formula',
          'debounce',
        );
      }

      return newFormulas;
    });
  };

  const checkAndLoadedAffectedFormulas = (
    queryIndex: number,
    newQueries: ExplorerQueryProps[],
    callType: 'normal' | 'debounce',
  ) => {
    const queryKey = newQueries[queryIndex].queryKey;
    formulas.forEach((formula: FormulaProps, formulaIndex: number) => {
      const { expression, isValid } = formula;
      if (isValid && expression.includes(queryKey)) {
        callOnePromqlQuery(
          formulas,
          newQueries,
          formulaIndex,
          'formula',
          callType,
        );
      }
    });
  };

  return {
    addFormula,
    checkAndLoadedAffectedFormulas,
    formulas,
    removeFormula,
    toggleAddFormula,
    updateFormula,
    setFormulas,
  };
};

export default useMetricsFormulaState;
