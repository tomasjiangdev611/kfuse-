import { Dispatch, SetStateAction } from 'react';
import {
  ExplorerQueryProps,
  FormulaProps,
  MetricsQueriesDataProps,
} from 'types/MetricsQueryBuilder';

const useMetricsQueryOps = ({
  activeQueryType,
  setFormulas,
  setQueries,
  setQueryData,
}: {
  activeQueryType: 'multi' | 'single';
  setFormulas: Dispatch<SetStateAction<FormulaProps[]>>;
  setQueries: Dispatch<SetStateAction<ExplorerQueryProps[]>>;
  setQueryData: Dispatch<SetStateAction<MetricsQueriesDataProps>>;
}) => {
  const handleEnableDisableQuery = (
    queryIndex: number,
    type: 'query' | 'formula',
  ) => {
    if (activeQueryType === 'single')
      return handleEnableDisableForSingleQuery(queryIndex, type);

    if (type === 'query') {
      setQueries((prevQueries: ExplorerQueryProps[]) => {
        const newQueries = [...prevQueries];

        newQueries[queryIndex].isActive = !newQueries[queryIndex].isActive;
        return newQueries;
      });
    } else {
      setFormulas((prevFormulas: FormulaProps[]) => {
        const newFormulas = [...prevFormulas];

        newFormulas[queryIndex].isActive = !newFormulas[queryIndex].isActive;
        return newFormulas;
      });
    }
    setQueryData((prevQueryData: MetricsQueriesDataProps) => {
      const newQueryData = { ...prevQueryData };
      return newQueryData;
    });
  };

  const handleEnableDisableForSingleQuery = (
    queryIndex: number,
    type: 'query' | 'formula',
  ) => {
    setQueries((prevQueries: ExplorerQueryProps[]) => {
      const newQueries = [...prevQueries];
      newQueries.forEach((query) => {
        query.isActive = false;
      });

      if (type === 'query') {
        newQueries[queryIndex].isActive = true;
      }

      return newQueries;
    });

    setFormulas((prevFormulas: FormulaProps[]) => {
      const newFormulas = [...prevFormulas];
      newFormulas.forEach((formula) => {
        formula.isActive = false;
      });

      if (type === 'formula') {
        newFormulas[queryIndex].isActive = true;
      }

      return newFormulas;
    });
  };

  return { handleEnableDisableQuery };
};

export default useMetricsQueryOps;
