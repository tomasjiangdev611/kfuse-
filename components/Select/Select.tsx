import classnames from 'classnames';
import React, { ReactElement, useEffect, useMemo, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import { useToggle } from 'hooks';
import { usePopoverContext } from '../Popover';
import SelectPanel from './SelectPanel';
import { SelectOption } from './types';

const getLabelsByValue = (options: SelectOption[]) => () =>
  options.reduce(
    (obj, option) => ({ ...obj, [option.value]: option.label }),
    {},
  );

type Props = {
  className?: string;
  onChange: (value: any) => void;
  options: SelectOption[];
  placeholder?: string;
  right?: boolean;
  value: any;
};

const Select = ({
  className,
  onChange,
  options,
  placeholder,
  right,
  value,
}: Props): ReactElement => {
  const labelsByValue = useMemo(getLabelsByValue(options), [options]);
  const openToggle = useToggle();
  const popover = usePopoverContext();
  const ref = useRef();

  const onOpen = () => {
    openToggle.on();
    popover.open({
      component: SelectPanel,
      element: ref.current,
      props: {
        onChange,
        options,
      },
      onClose: openToggle.off,
      right,
    });
  };

  return (
    <div
      className={classnames({ select: true, [className]: className })}
      ref={ref}
    >
      <button className="select__trigger" onClick={onOpen}>
        <div
          className={classnames({
            select__trigger__value: true,
            'select__trigger__value--placeholder':
              !labelsByValue[value] && !value && placeholder,
          })}
        >
          {labelsByValue[value] || value || placeholder}
        </div>
        {openToggle.value ? (
          <ChevronUp className="select__trigger__icon" size={16} />
        ) : (
          <ChevronDown className="select__trigger__icon" size={16} />
        )}
      </button>
    </div>
  );
};

export default Select;
