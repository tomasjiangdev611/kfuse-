import classNames from 'classnames';
import { AutocompleteList, AutocompleteListProps } from 'components';
import React, { Dispatch, ReactElement, useEffect, useState } from 'react';
import { logsQueryOperator } from 'utils';

import { SearchItemProps } from './types';
import { getEndDoubleQuote, parseValueFromQuery } from './utils';

type Args = AutocompleteListProps & {
  onSearchAsString?: () => void;
  onOperatorChange?: () => void;
  operatorSign: string;
  setSearch: Dispatch<React.SetStateAction<string>>;
  setSearchItems: Dispatch<React.SetStateAction<SearchItemProps>>;
  typed: string;
  value: string;
};

const LogsSearchBarAutocomplete = ({
  operatorSign,
  options,
  onOperatorChange,
  setSearch,
  setSearchItems,
  value,
  ...rest
}: Args): ReactElement => {
  const [operatorKey, setOperatorKey] = useState('');

  useEffect(() => {
    setOperatorKey(operatorSign);
  }, [operatorSign]);

  const onOperatorClick = (key: string): void => {
    setSearchItems((prevState) => {
      const newState = { ...prevState };
      newState.operator = key;
      const parsedValue = parseValueFromQuery(value);
      const closingQuote = getEndDoubleQuote(value, parsedValue);
      if (newState.facetName) {
        setSearch(`${newState.facetName}${key}"${parsedValue}${closingQuote}`);
      }

      return newState;
    });
    onOperatorChange && onOperatorChange();
    setOperatorKey(key);
  };

  return (
    <div className="logs__search-bar__autocomplete">
      <AutocompleteList {...rest} options={options} />
      {options && options.length > 0 && (
        <div className="logs__search-bar__autocomplete__control">
          <div>
            Operators:
            {Object.keys(logsQueryOperator).map((key) => {
              return (
                <div
                  onClick={() => onOperatorClick(key)}
                  className={classNames({
                    'logs__search-bar__autocomplete__control--operator': true,
                    'logs__search-bar__autocomplete__control--operator-selected':
                      key === operatorKey,
                  })}
                  key={key}
                >{`${key} ${logsQueryOperator[key]}`}</div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LogsSearchBarAutocomplete;
