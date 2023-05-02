import { AutocompleteV2, InputWithValidatorV2 } from 'components';
import React, { ReactElement } from 'react';
import { Controller } from 'react-hook-form';

import { useCreateSLOState } from '../hooks';
import classNames from 'classnames';

const SLOCreateObjective = ({
  createSLOState,
}: {
  createSLOState: ReturnType<typeof useCreateSLOState>;
}): ReactElement => {
  const { control, sloFormError, setFormValue } = createSLOState;

  return (
    <>
      <div className="slo__create__target">
        <div className="slo__create__target__item">
          <p>Time Window:</p>
          <AutocompleteV2
            className="autocomplete__fixed-height-28"
            isDisabled={true}
            onChange={null}
            options={[{ label: '30d', value: '30d' }]}
            value="30d"
          />
        </div>
        <div className="slo__create__target__item">
          <p>Objective:</p>
          <div className="slo__create__target__objective">
            <div
              className={classNames({
                slo__create__target__objective__input: true,
                'slo__create__target__objective__input--error': Boolean(
                  sloFormError.objective?.message,
                ),
              })}
            >
              <Controller
                control={control}
                name="objective"
                render={({ field }) => (
                  <InputWithValidatorV2
                    {...field}
                    className="input--no-border"
                    onChange={(e) =>
                      setFormValue('objective', e.target.value, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    placeholder="Enter the objective"
                    type="text"
                  />
                )}
              />
              <div className="slo__create__target__percent">%</div>
            </div>
            {sloFormError.objective?.message && (
              <span className="text--red">
                {sloFormError.objective?.message}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="slo__create__target--description">
        Objective is the percent of total events that should be good, as defined
        by the SLO.
      </div>
    </>
  );
};

export default SLOCreateObjective;
