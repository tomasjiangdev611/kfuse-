import classnames from 'classnames';
import { useToggle } from 'hooks';
import React, { ReactElement, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import AutocompleteInput from './AutocompleteInput';
import AutocompletePanel from './AutocompletePanel';
import { AutocompleteOption } from './types';
import { usePopoverContext } from '../Popover';

type Props = {
  className?: string;
  deselectable?: boolean;
  fullwidthPanel?: boolean;
  hideScrollbars?: boolean;
  onChange: (value: string) => void;
  options: AutocompleteOption[];
  placeholder?: string;
  renderEmptyComponent?: (typed: string, close: () => void) => ReactElement;
  value: string;
};

const Autocomplete = ({
  className,
  deselectable,
  fullwidthPanel,
  hideScrollbars,
  onChange,
  options,
  placeholder,
  renderEmptyComponent,
  value,
}: Props): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);
  const popover = usePopoverContext();
  const ref = useRef();
  const [typed, setTyped] = useState('');
  const openToggle = useToggle();

  const onClickHandler = (close: () => void, nextValue: string) => () => {
    onChange(nextValue);
    setTyped('');
    close();
    openToggle.off();
  };

  const onClick = () => {
    openToggle.on();
    inputRef.current.focus();
    renderPanel(typed);
  };

  const onInputChange = (nextTyped: string) => {
    setTyped(nextTyped);
    renderPanel(nextTyped);
  };

  const renderPanel = (nextTyped: string) => {
    popover.open({
      component: AutocompletePanel,
      props: {
        deselectable,
        fullTextSearch: true,
        onClickHandler,
        options,
        renderEmptyComponent,
        typed: nextTyped,
        value,
      },
      element: ref.current,
      onClose: openToggle.off,
      popoverPanelClassName: hideScrollbars
        ? 'popover__panel--autocomplete'
        : '',
      width: fullwidthPanel
        ? ref?.current.getBoundingClientRect().width || null
        : undefined,
    });
  };

  const foundLabel = useMemo(() => {
    if (value) {
      const foundOption = options.find((option) => option.value === value);
      if (foundOption) {
        return foundOption.label;
      }

      return null;
    }
  }, [options, value]);

  return (
    <div
      className={classnames({ autocomplete: true, [className]: className })}
      ref={ref}
    >
      <button className="autocomplete__trigger" onClick={onClick}>
        <AutocompleteInput
          onInputChange={onInputChange}
          openToggle={openToggle}
          placeholder={placeholder}
          ref={inputRef}
          typed={typed}
          value={foundLabel || value}
        />
        {openToggle.value ? (
          <ChevronUp className="autocomplete__icon" size={16} />
        ) : (
          <ChevronDown className="autocomplete__icon" size={16} />
        )}
      </button>
    </div>
  );
};

export default Autocomplete;
