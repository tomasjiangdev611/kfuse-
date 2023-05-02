import classnames from 'classnames';
import React, { ReactElement, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import { PanelPosition } from 'types';
import SelectPanel from './SelectPanel';
import SelectTriggerValue from './SelectTriggerValue';
import { SelectOption } from './types';
import { PopoverTriggerV2, PopoverPosition } from '../PopoverTriggerV2';

const getLabelsByValue = (options: SelectOption[]): { [key: string]: string } =>
  options.reduce(
    (obj, option) => ({ ...obj, [option.value]: option.label }),
    {},
  );

const getPosition = ({ right, top }) => {
  if (right && top) {
    return PanelPosition.TOP_RIGHT;
  }

  if (right) {
    return PanelPosition.BOTTOM_RIGHT;
  }

  if (top) {
    return PanelPosition.TOP_LEFT;
  }

  return PanelPosition.BOTTOM_LEFT;
};

type Props = {
  className?: string;
  isAutocompleteEnabled?: boolean;
  onChange: (value: any) => void;
  onSearchChange?: (search: string) => void;
  options: SelectOption[];
  placeholder?: string;
  right?: boolean;
  top?: boolean;
  value: any;
};

const Select = ({
  className,
  isAutocompleteEnabled,
  onChange,
  onSearchChange,
  options,
  placeholder,
  right,
  top,
  value,
}: Props): ReactElement => {
  const [search, setSearch] = useState('');

  const labelsByValue: { [key: string]: string } = useMemo(
    () => getLabelsByValue(options),
    [options],
  );

  return (
    <PopoverTriggerV2
      className={classnames({ select: true, [className]: className })}
      position={getPosition({ right, top })}
      popover={({ close }) => (
        <div className="selectv2__panel">
          <SelectPanel
            close={close}
            isAutocompleteEnabled={isAutocompleteEnabled}
            onChange={onChange}
            options={options}
            search={search}
          />
        </div>
      )}
    >
      {({ isOpen }) => (
        <div className="select__trigger">
          <SelectTriggerValue
            isAutocompleteEnabled={isAutocompleteEnabled}
            isOpen={isOpen}
            labelsByValue={labelsByValue}
            onSearchChange={onSearchChange}
            placeholder={placeholder}
            search={search}
            setSearch={setSearch}
            value={value}
          />
          <ChevronUp
            className="select__trigger__icon select__trigger__icon--open"
            size={16}
          />
          <ChevronDown
            className="select__trigger__icon select__trigger__icon--closed"
            size={16}
          />
        </div>
      )}
    </PopoverTriggerV2>
  );
};

export default Select;
