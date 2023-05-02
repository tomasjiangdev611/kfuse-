import { AutocompleteV2, Input, Textarea } from 'components';
import React, { ReactElement } from 'react';

import { ContactNotifierTypeOptions } from './types';

const AlertsContactsCreateElementField = ({
  field,
  onChange,
  value,
}: {
  field: ContactNotifierTypeOptions;
  onChange: (val: string) => void;
  value?: string;
}): ReactElement => {
  const { element, placeholder } = field;
  if (element === 'input') {
    return (
      <Input
        onChange={onChange}
        placeholder={placeholder}
        type="text"
        value={value}
      />
    );
  }

  if (element === 'select') {
    return (
      <AutocompleteV2
        onChange={onChange}
        options={field.selectOptions}
        placeholder={'Choose'}
        value={value}
      />
    );
  }

  if (element === 'textarea') {
    return (
      <Textarea
        className="alerts__create__details__textarea"
        onChange={onChange}
        placeholder={placeholder}
        type="text"
        value={value}
      />
    );
  }

  return null;
};

export default AlertsContactsCreateElementField;
