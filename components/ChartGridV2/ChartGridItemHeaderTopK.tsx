import React from 'react';
import CheckboxWithLabel from '../CheckboxWithLabel';

const ChartGridItemHeaderTopK = ({ chartGridItemData, form }) => {
  const { keys } = chartGridItemData;
  const { propsByKey } = form;

  if (keys.length > 5) {
    return (
      <CheckboxWithLabel
        label="Show Top 5"
        {...(propsByKey('shouldShowTop5') as {
          onChange: (value: any) => void;
          value: boolean;
        })}
      />
    );
  }

  return null;
};

export default ChartGridItemHeaderTopK;
