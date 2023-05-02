import classnames from 'classnames';
import { useToggle } from 'hooks';
import React, { ReactElement, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import MultiselectPanel from './MultiselectPanel';
import MultiselectValue from './MultiselectValue';
import { MultiselectOption } from './types';
import { Input } from '../Input';
import { usePopoverContext } from '../Popover';

type Props = {
  className?: string;
  fullwidthPanel?: boolean;
  hideScrollbars?: boolean;
  onChange: (value: string[]) => void;
  options: MultiselectOption[];
  placeholder?: string;
  value: string[];
};

const Multiselect = ({
  className,
  fullwidthPanel = false,
  hideScrollbars = false,
  onChange,
  options,
  placeholder,
  value,
}: Props): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);
  const popover = usePopoverContext();
  const ref = useRef();
  const [typed, setTyped] = useState('');
  const openToggle = useToggle();

  const onClickHandler = (close: () => void, nextValue: string) => () => {
    onChange([...value, nextValue]);
    setTyped('');
    close();
    openToggle.off();
  };

  const onClick = () => {
    openToggle.on();
    inputRef.current.focus();
    renderPanel('');
  };

  const onInputChange = (nextTyped: string) => {
    setTyped(nextTyped);
    renderPanel(nextTyped);
  };

  const removeHandler = (index: number) => (e: Event) => {
    e.stopPropagation();

    const nextValue = [...value];
    nextValue.splice(index, 1);
    onChange(nextValue);
  };

  const renderPanel = (nextTyped: string) => {
    popover.open({
      component: MultiselectPanel,
      props: {
        onClickHandler,
        options,
        typed: nextTyped,
        value: value,
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

  return (
    <div
      className={classnames({ multiselect: true, [className]: className })}
      ref={ref}
    >
      <div className="multiselect__trigger" onClick={onClick}>
        <div className="multiselect__trigger__inner">
          <MultiselectValue
            options={options}
            removeHandler={removeHandler}
            value={value}
          />
          <Input
            className={classnames({
              multiselect__input: true,
              'multiselect__input--placeholder':
                !openToggle.value && !value && placeholder,
            })}
            onChange={onInputChange}
            placeholder={placeholder}
            ref={inputRef}
            type="text"
            value={openToggle.value ? typed : ''}
          />
        </div>
        {openToggle.value ? (
          <ChevronUp className="multiselect__icon" size={16} />
        ) : (
          <ChevronDown className="multiselect__icon" size={16} />
        )}
      </div>
    </div>
  );
};

export default Multiselect;
