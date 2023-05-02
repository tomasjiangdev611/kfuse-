import {
  AutocompleteV2,
  Input,
  MultiselectV2,
  PopoverPosition,
  PopoverTriggerV2,
} from 'components';
import { useMetricsQueryStateV2 } from 'hooks';
import React, { ReactElement, useRef } from 'react';
import { MdFunctions } from 'react-icons/md';
import { ExplorerQueryProps, VectorTypes } from 'types/MetricsQueryBuilder';
import { AGGREGATE_FUNCTIONS } from 'utils/MetricsQueryBuilder';

import MetricsQueryBuilderFunctionsPanel from './MetricsQueryBuilderFunctionsPanel';

const getPopoverOffset = (rect: DOMRect): PopoverPosition => {
  if (rect && rect.left > document.body.clientWidth / 2) {
    return PopoverPosition.BOTTOM_RIGHT;
  }

  return PopoverPosition.BOTTOM_LEFT;
};

const MetricsQueryBuilderFunctions = ({
  blockedFunctionsCategories = [],
  query,
  queryIndex,
  metricsQueryState,
}: {
  blockedFunctionsCategories?: string[];
  query: ExplorerQueryProps;
  queryIndex: number;
  metricsQueryState: ReturnType<typeof useMetricsQueryStateV2>;
}): ReactElement => {
  const functionButtonRef = useRef(null);
  const { addFunction, removeFunction, updateFunction, labelsList } =
    metricsQueryState;

  return (
    <>
      <div className="metrics__function-builder">
        {query.functions.map((fn, fnIndex) => {
          const labelOptions = labelsList[query.metric];
          return (
            <div key={fnIndex} className="metrics__function-builder__item">
              <div className="metrics__function-builder__item__name">
                {AGGREGATE_FUNCTIONS.includes(fn.name)
                  ? 'aggregation'
                  : fn.name}
              </div>
              <div className="metrics__function-builder__item__params">
                {fn.params &&
                  fn.params.map((param, paramIndex) => {
                    if (param.type === 'text') {
                      return (
                        <Input
                          className="metrics__function-builder__item__params__input"
                          key={paramIndex}
                          onChange={(val) =>
                            updateFunction(queryIndex, fnIndex, paramIndex, val)
                          }
                          placeholder={param.name}
                          type="text"
                          value={param.value}
                        />
                      );
                    }
                    if (param.type === 'select') {
                      return (
                        <AutocompleteV2
                          className="autocomplete-container--no-border metrics__function-builder__item__params__input"
                          key={paramIndex}
                          onChange={(val) =>
                            updateFunction(queryIndex, fnIndex, paramIndex, val)
                          }
                          options={param.options}
                          value={param.value}
                        />
                      );
                    }
                    if (param.type === 'multi-select') {
                      return (
                        <MultiselectV2
                          className="autocomplete-container--no-border metrics__function-builder__item__params__multi-select"
                          key={paramIndex}
                          onChange={(val) =>
                            updateFunction(queryIndex, fnIndex, paramIndex, val)
                          }
                          options={
                            AGGREGATE_FUNCTIONS.includes(fn.name)
                              ? labelOptions
                              : param.options
                          }
                          value={param.value}
                        />
                      );
                    }
                  })}
              </div>
              <div
                className="metrics__function-builder__item__close"
                onClick={() => removeFunction(queryIndex, fnIndex)}
              >
                X
              </div>
            </div>
          );
        })}
      </div>
      <PopoverTriggerV2
        popover={({ close }) => (
          <MetricsQueryBuilderFunctionsPanel
            blockedFunctionsCategories={blockedFunctionsCategories}
            onFunctionClick={(
              functionName: string,
              vectorType: VectorTypes,
            ) => {
              addFunction(queryIndex, functionName, vectorType);
              close();
            }}
          />
        )}
        position={getPopoverOffset(
          functionButtonRef.current?.getBoundingClientRect(),
        )}
        offsetY={-4}
      >
        <div
          className="metrics__query-builder__query-item__function-button"
          ref={functionButtonRef}
        >
          <MdFunctions size={20} />
        </div>
      </PopoverTriggerV2>
    </>
  );
};

export default MetricsQueryBuilderFunctions;
