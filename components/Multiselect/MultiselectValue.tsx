import React, { useMemo } from 'react';
import { X } from 'react-feather';

type Props = {
  removeHandler: (i: number) => () => void;
  value: string[];
};

const MultiselectValue = ({ options, removeHandler, value }: Props) => {
  const labelsByValue = useMemo(
    () =>
      options.reduce(
        (obj, option) => ({ ...obj, [option.value]: option.label }),
        {},
      ),
    [options],
  );

  return value.map((valueItem: string, i: number) => (
    <div className="multiselect__value__item" key={valueItem}>
      {labelsByValue[valueItem] || valueItem}
      <button
        className="multiselect__value__item__button"
        onClick={removeHandler(i)}
      >
        <X size={12} />
      </button>
    </div>
  ));
};

export default MultiselectValue;
