import { InputWithValidatorV2, Textarea } from 'components';
import React, { ReactElement } from 'react';
import { Controller } from 'react-hook-form';

import { useCreateSLOState } from '../hooks';

const SLOCreateDetails = ({
  createSLOState,
}: {
  createSLOState: ReturnType<typeof useCreateSLOState>;
}): ReactElement => {
  const { control, sloFormError, registerSLOInput } = createSLOState;

  return (
    <div className="slo__create__details">
      <div>
        <p>Name:</p>
        <InputWithValidatorV2
          {...registerSLOInput('sloName')}
          errorText={sloFormError.sloName?.message as string}
          placeholder="Enter the name"
          type="text"
        />
      </div>
      <div>
        <p>Description:</p>
        <Controller
          control={control}
          name="sloDescription"
          render={({ field }) => (
            <Textarea
              {...field}
              errorText={sloFormError.sloDescription?.message as string}
              placeholder="Enter the description"
              type="text"
            />
          )}
        />
      </div>
    </div>
  );
};

export default SLOCreateDetails;
