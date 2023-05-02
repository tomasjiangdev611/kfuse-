import classNames from 'classnames';
import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { AutocompleteOption } from './types';

type Props = {
  close: () => void;
  deselectable?: boolean;
  fullTextSearch?: boolean;
  options: AutocompleteOption[];
  onClickHandler: (close: () => void, value: any) => () => void;
  typed: string;
  renderEmptyComponent?: (typed: string, close: () => void) => ReactElement;
  value: any;
};

const AutocompletePanel = ({
  close,
  deselectable,
  fullTextSearch = false,
  onClickHandler,
  options,
  renderEmptyComponent,
  typed,
  value,
}: Props): ReactElement => {
  const [activeOption, setActiveOption] = useState<{ index: number }>({
    index: 0,
  });

  const filteredOptions = useMemo(() => {
    const typedLowered = typed.toLowerCase().trim();
    if (typedLowered) {
      let typedTerms: string[] = [];
      if (fullTextSearch) {
        typedTerms = [typedLowered];
      } else {
        typedTerms = typedLowered
          .split(/[.\-=/_]/)
          .filter((typedTerm) => typedTerm);
      }

      return options.filter((option) =>
        typedTerms.some(
          (typedTerm) => option.label.toLowerCase().indexOf(typedTerm) > -1,
        ),
      );
    }

    return options;
  }, [options, typed]);

  const onKeyDown = (event: KeyboardEvent) => {
    setActiveOption((prevActiveOption) => {
      let newIndex = prevActiveOption.index;
      if (event.key === 'ArrowDown' && newIndex < filteredOptions.length - 1) {
        newIndex += 1;
      } else if (event.key === 'ArrowUp' && newIndex > 0) {
        newIndex -= 1;
      } else if (event.key === 'Enter' && newIndex < filteredOptions.length) {
        if (filteredOptions[newIndex].disabled !== true) {
          onClickHandler(close, filteredOptions[newIndex].value)();
        }
      }

      return { index: newIndex };
    });
  };

  useEffect(() => {
    setActiveOption({ index: 0 });
  }, [options, typed]);

  useEffect(() => {
    if (options.length > 0) {
      document.addEventListener('keydown', onKeyDown);
    } else {
      document.removeEventListener('keydown', onKeyDown);
    }

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [options, typed]);

  return (
    <div className="autocomplete__panel" data-testid="autocomplete-panel">
      {filteredOptions.length ? (
        <>
          {deselectable && value ? (
            <button
              className="autocomplete__panel__option"
              onMouseDown={onClickHandler(close, null)}
            >
              <div className="autocomplete__panel__option__label">All</div>
            </button>
          ) : null}
          {filteredOptions.map((option, index) => (
            <button
              key={index}
              className={classNames({
                autocomplete__panel__option: true,
                'autocomplete__panel__option--active':
                  index === activeOption.index && option.disabled !== true,
                'autocomplete__panel__option--disabled': option.disabled,
              })}
              onMouseDown={() => {
                if (option.disabled !== true) {
                  onClickHandler(close, option.value)();
                }
              }}
            >
              <div className="autocomplete__panel__option__label">
                {option.label}
              </div>
            </button>
          ))}
        </>
      ) : renderEmptyComponent ? (
        renderEmptyComponent(typed, close)
      ) : (
        <div className="autocomplete__panel__option autocomplete__panel__option--placeholder">
          <div className="autocomplete__panel__option__label">
            No options available
          </div>
        </div>
      )}
    </div>
  );
};

export default AutocompletePanel;
