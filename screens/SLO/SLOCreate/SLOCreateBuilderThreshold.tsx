import { AutocompleteV2, Input } from 'components';
import React, { ReactElement } from 'react';
import { components } from 'react-select';

import { useCreateSLOState } from '../hooks';
import { countOptions, thesholdOperatorOptions } from '../utils';

const SLOCreateBuilderThreshold = ({
  createSLOState,
  type,
}: {
  createSLOState: ReturnType<typeof useCreateSLOState>;
  type: 'numerator' | 'denominator';
}): ReactElement => {
  const { sloCountThresold, setSloCountThresold } = createSLOState;

  return (
    <>
      <AutocompleteV2
        className="autocomplete-container--no-border"
        components={{ DropdownIndicator: null }}
        onChange={(val) => {
          setSloCountThresold({
            ...sloCountThresold,
            [type]: { ...sloCountThresold[type], count: val },
          });
        }}
        options={countOptions}
        value={sloCountThresold[type].count}
      />
      <AutocompleteV2
        className="autocomplete-container--no-border"
        components={{
          DropdownIndicator: null,
          ValueContainer: (prop) => {
            return (
              <components.ValueContainer {...prop}>
                {prop.selectProps.value.label.replace('{threshold}', '')}
              </components.ValueContainer>
            );
          },
        }}
        onChange={(val) => {
          setSloCountThresold({
            ...sloCountThresold,
            [type]: { ...sloCountThresold[type], operator: val },
          });
        }}
        options={thesholdOperatorOptions}
        value={sloCountThresold[type].operator}
      />
      <Input
        className="input--no-border metrics__function-builder__item__params__input"
        onChange={(val) => {
          setSloCountThresold({
            ...sloCountThresold,
            [type]: { ...sloCountThresold[type], threshold: val },
          });
        }}
        placeholder="threshold"
        type="text"
        value={sloCountThresold[type].threshold || ''}
      />
      <div className="slo__create__threshold__unit">milisecond</div>
    </>
  );
};

export default SLOCreateBuilderThreshold;
