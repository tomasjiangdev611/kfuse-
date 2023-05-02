import classNames from 'classnames';
import { AutocompleteOption, AutocompleteList } from 'components';
import React, { Dispatch, ReactElement, useEffect, useState } from 'react';
import { operator, parseValueFromQuery } from 'utils';
import { SearchItemProps } from 'types/SearchBar';

type Args = {
  close: () => void;
  deselectable: boolean;
  onClickHandler: () => () => void;
  onSearchAsString?: () => void;
  operatorSign: string;
  options: AutocompleteOption[];
  setSearch: Dispatch<React.SetStateAction<string>>;
  setSearchItems: Dispatch<React.SetStateAction<SearchItemProps>>;
  typed: string;
  value: string;
};

const SearchBarPanel = ({
  operatorSign,
  options,
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
      const closingQuote = value.endsWith('"') ? '"' : '';
      if (newState.facetName) {
        setSearch(`${newState.facetName}${key}"${parsedValue}${closingQuote}`);
      }

      return newState;
    });
    setOperatorKey(key);
  };

  return (
    <div className="logs__search-bar__autocomplete">
      <AutocompleteList {...rest} options={options} />
      {options && options.length > 0 && (
        <div className="logs__search-bar__autocomplete__control">
          <div>
            Operators:
            {Object.keys(operator).map((key) => {
              return (
                <div
                  onClick={() => onOperatorClick(key)}
                  className={classNames({
                    'logs__search-bar__autocomplete__control--operator': true,
                    'logs__search-bar__autocomplete__control--operator-selected':
                      key === operatorKey,
                  })}
                  key={key}
                >{`${key} ${operator[key]}`}</div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBarPanel;
