import { InputWithValidatorV2, TooltipTrigger } from 'components';
import React, { ReactElement } from 'react';
import { MdDelete, MdAdd } from 'react-icons/md';
import { useFieldArray, Controller } from 'react-hook-form';

const SLOCreateLabel = ({
  control,
  errors = [],
  name,
  title,
}: {
  control: any;
  errors: Array<{ key: { message: string }; value: { message: string } }>;
  name: string;
  title: string;
}): ReactElement => {
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div>
      <div className="slo__create__details__label__title">{title}</div>
      <div className="slo__create__details__label">
        {fields.map((label, idx) => {
          return (
            <div className="slo__create__details__label__item" key={idx}>
              <div className="slo__create__details__label__item__input">
                <Controller
                  control={control}
                  name={`${name}[${idx}].key`}
                  render={({ field }) => (
                    <InputWithValidatorV2
                      {...field}
                      className="input--no-border"
                      placeholder="Label name"
                      type="text"
                    />
                  )}
                />
                <div className="slo__create__details__label__item__operator">
                  =
                </div>
                <Controller
                  control={control}
                  name={`${name}[${idx}].value`}
                  render={({ field }) => (
                    <InputWithValidatorV2
                      {...field}
                      className="input--no-border"
                      placeholder="value"
                      type="text"
                    />
                  )}
                />
                <div
                  className="slo__create__details__label__item__delete"
                  onClick={() => remove(idx)}
                >
                  <MdDelete />
                </div>
              </div>
              {errors[idx]?.key?.message && (
                <div className="text--red">{errors[idx]?.key?.message}</div>
              )}
              {errors[idx]?.value?.message && (
                <div className="text--red">{errors[idx]?.value?.message}</div>
              )}
            </div>
          );
        })}
        <TooltipTrigger tooltip="Add new label">
          <div
            className="slo__create__details__label__add"
            onClick={() => append({ key: '', value: '' })}
          >
            <MdAdd />
          </div>
        </TooltipTrigger>
      </div>
    </div>
  );
};

export default SLOCreateLabel;
