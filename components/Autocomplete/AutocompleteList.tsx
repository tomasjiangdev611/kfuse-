import classNames from 'classnames';
import React, {
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AutocompleteOption, AutocompleteListProps } from './types';

const AutocompleteOptionButton = ({
  activeOption,
  index,
  option,
  onClickHandler,
}: {
  activeOption: { index: number };
  index: number;
  option: AutocompleteOption;
  onClickHandler: (
    close: () => void,
    value: any,
    type: 'mouse' | 'key',
  ) => void;
}) => {
  return (
    <button
      className={classNames({
        autocomplete__list__option: true,
        'autocomplete__list__option--active': index === activeOption.index,
      })}
      onMouseDown={() => onClickHandler(close, option, 'mouse')}
    >
      <div className="autocomplete__panel__option__label">{option.label}</div>
    </button>
  );
};

const AutocompleteList = ({
  close,
  onClickHandler,
  options,
  optionType,
  searchOption,
  typed,
}: AutocompleteListProps): ReactElement => {
  const [activeOption, setActiveOption] = useState<{ index: number }>({
    index: -1,
  });

  const typedLowered = typed.toLowerCase().trim();
  const typedTerms = [typedLowered];
  const autocompleteRef = useRef(null);

  const filteredOptions = useMemo(() => {
    if (typedLowered) {
      return options.filter((option) =>
        typedTerms.some(
          (typedTerm) => option.label.toLowerCase().indexOf(typedTerm) > -1,
        ),
      );
    }
    return options;
  }, [options, typed]);

  if (searchOption.label) {
    if (filteredOptions[0]?.optionType === 'search') {
      filteredOptions[0].label = searchOption.label;
      filteredOptions[0].value = searchOption.value;
    } else {
      filteredOptions.unshift(searchOption);
    }
  } else if (filteredOptions[0]?.optionType === 'search') {
    filteredOptions.shift();
  }

  const onKeyDown = (event: KeyboardEvent) => {
    setActiveOption((prevActiveOption) => {
      let newIndex = prevActiveOption.index;
      if (event.key === 'ArrowDown' && newIndex < filteredOptions.length - 1) {
        newIndex += 1;
      } else if (event.key === 'ArrowUp' && newIndex > 0) {
        newIndex -= 1;
      }

      const autocompleteItemNode = autocompleteRef.current?.children[newIndex];
      if (
        autocompleteItemNode &&
        autocompleteItemNode.classList.contains('autocomplete__list__option')
      ) {
        autocompleteItemNode.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest',
        });
      }

      if (event.key === 'Enter' && newIndex > -1 && newIndex < options.length) {
        onClickHandler(close, filteredOptions[newIndex], 'key');
      }

      return { index: newIndex };
    });
  };

  useEffect(() => {
    setActiveOption({ index: -1 });
  }, [options, typed]);

  useEffect(() => {
    if (options.length > 0) {
      document.addEventListener('keydown', onKeyDown);
    } else {
      document.removeEventListener('keydown', onKeyDown);
    }

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [options, typed]);

  let facetOptions: AutocompleteOption[] = [];
  let labelOptions: AutocompleteOption[] = [];
  if (optionType === 'facet' || optionType === 'label') {
    facetOptions = filteredOptions.filter((val) => val.optionType === 'facet');
    labelOptions = filteredOptions.filter((val) => val.optionType === 'label');
  }

  let valueOptions: AutocompleteOption[] = [];
  if (optionType === 'value') {
    valueOptions = filteredOptions.filter((val) => val.optionType === 'value');
  }

  const baseIndex = searchOption.label ? 1 : 0;
  return (
    <div
      className="overflow-y-scroll-hide"
      ref={autocompleteRef}
      data-testid="autocomplete-list"
    >
      {searchOption.label && (
        <p className="autocomplete__list__subheader">Search</p>
      )}
      {searchOption.label && (
        <AutocompleteOptionButton
          activeOption={activeOption}
          index={0}
          option={searchOption}
          onClickHandler={onClickHandler}
        />
      )}
      {labelOptions.length > 0 && (
        <p className="autocomplete__list__subheader">Label</p>
      )}
      {labelOptions.length > 0 &&
        labelOptions.map((option, index) => {
          return (
            <AutocompleteOptionButton
              activeOption={activeOption}
              index={index + baseIndex}
              key={index}
              option={option}
              onClickHandler={onClickHandler}
            />
          );
        })}
      {facetOptions.length > 0 && (
        <p className="autocomplete__list__subheader">Facet</p>
      )}
      {facetOptions.length > 0 &&
        facetOptions.map((option, index) => {
          return (
            <AutocompleteOptionButton
              activeOption={activeOption}
              index={labelOptions.length + index + baseIndex}
              key={index}
              option={option}
              onClickHandler={onClickHandler}
            />
          );
        })}
      {valueOptions.length > 0 && (
        <p className="autocomplete__list__subheader">Value</p>
      )}
      {valueOptions.length > 0 &&
        valueOptions.map((option, index) => {
          return (
            <AutocompleteOptionButton
              activeOption={activeOption}
              index={
                labelOptions.length + facetOptions.length + index + baseIndex
              }
              key={index}
              option={option}
              onClickHandler={onClickHandler}
            />
          );
        })}
    </div>
  );
};

export default AutocompleteList;
