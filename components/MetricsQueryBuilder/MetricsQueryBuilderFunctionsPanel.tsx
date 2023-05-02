import React, { ReactElement, useMemo, useState } from 'react';
import { functionsNames } from 'utils/MetricsQueryBuilder';
import { VectorTypes } from 'types/MetricsQueryBuilder';

const MetricsQueryBuilderFunctionsPanel = ({
  blockedFunctionsCategories = [],
  onFunctionClick,
}: {
  blockedFunctionsCategories?: string[];
  onFunctionClick: (functionName: string, vectorType: VectorTypes) => void;
}): ReactElement => {
  const [activeCategory, setActiveCategory] = useState('');

  const allUniqueCategories = functionsNames.reduce((acc, curr) => {
    if (
      !blockedFunctionsCategories.includes(curr.category) &&
      !acc.includes(curr.category)
    ) {
      acc.push(curr.category);
    }
    return acc;
  }, [] as string[]);

  const categories = useMemo(() => {
    if (activeCategory) {
      return functionsNames.filter(
        (metric) => metric.category === activeCategory,
      );
    }
    return [];
  }, [activeCategory]);

  return (
    <div className="metrics__query-builder__functions-panel">
      <div className="metrics__query-builder__functions-panel__item">
        {allUniqueCategories.map((category) => {
          return (
            <div
              key={category}
              className="metrics__query-builder__functions-panel__item__category"
              onMouseEnter={() => setActiveCategory(category)}
            >
              {category}
            </div>
          );
        })}
      </div>
      <div className="metrics__query-builder__functions-panel__item">
        {categories.map((category) => {
          return (
            <div
              key={category.name}
              className="metrics__query-builder__functions-panel__item__category"
              onClick={() =>
                onFunctionClick(category.shortName, category.vectorType)
              }
            >
              {category.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MetricsQueryBuilderFunctionsPanel;
