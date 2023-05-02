import { InputWithValidatorV2, MultiselectV2, Textarea } from 'components';
import React, { ReactElement, useMemo } from 'react';
import { Controller } from 'react-hook-form';

import { useCreateSLOState } from '../hooks';
import SLOCreateLabel from './SLOCreateLabel';

const SLOCreateAlertSetup = ({
  alertType,
  createSLOState,
}: {
  alertType: 'high' | 'low';
  createSLOState: ReturnType<typeof useCreateSLOState>;
}): ReactElement => {
  const {
    control,
    getFormValue,
    registerSLOInput,
    requestsGrafanaAlertManager,
    sloFormError,
    setFormValue,
  } = createSLOState;

  const alertTypeUpperCase =
    alertType.charAt(0).toUpperCase() + alertType.slice(1);

  const contactList = useMemo(
    () =>
      requestsGrafanaAlertManager.result
        ? requestsGrafanaAlertManager.result.map((contact) => ({
            label: contact.name,
            value: contact.name,
          }))
        : [],
    [requestsGrafanaAlertManager.result],
  );

  return (
    <div>
      <div className="slo__create__details">
        <div>
          <p>{alertTypeUpperCase} severity alert name:</p>
          <InputWithValidatorV2
            {...registerSLOInput(`${alertType}.name`)}
            errorText={sloFormError[`${alertType}`]?.name?.message as string}
            placeholder={`Enter the ${alertType} severity alert name`}
            type="text"
          />
        </div>
        <div>
          <p>{alertTypeUpperCase} severity alert description:</p>
          <Controller
            control={control}
            name={`${alertType}.description`}
            render={({ field }) => (
              <Textarea
                {...field}
                errorText={
                  sloFormError[`${alertType}`]?.description?.message as string
                }
                placeholder={`Enter the ${alertType} severity alert description`}
                type="text"
              />
            )}
          />
        </div>
        <div>
          <p>{alertTypeUpperCase} severity alert contact point:</p>
          <Controller
            control={control}
            name={`${alertType}.contactPoints`}
            render={({ field: { onChange, value } }) => (
              <MultiselectV2
                onChange={onChange}
                options={contactList || []}
                placeholder={`Enter the ${alertType} severity alert contact point`}
                value={value}
              />
            )}
          />
        </div>
        <div>
          <SLOCreateLabel
            control={control}
            errors={sloFormError[`${alertType}`]?.labels}
            name={`${alertType}.labels`}
            title={`${alertTypeUpperCase} severity alert labels:`}
          />
        </div>
        <div>
          <button
            className="button button--blue"
            onClick={() => {
              const sloLabels = getFormValue(`sloLabels`) || [];
              const alertLabels = getFormValue(`${alertType}.labels`) || [];

              const newSloLabels = sloLabels.filter(
                (sloLabel) =>
                  sloLabel.key &&
                  sloLabel.value &&
                  !alertLabels.find(
                    (alertLabel) =>
                      alertLabel.key === sloLabel.key &&
                      alertLabel.value === sloLabel.value,
                  ),
              );
              const combinedLabels = [...alertLabels, ...newSloLabels];

              setFormValue(`${alertType}.labels`, combinedLabels);
            }}
          >
            Add SLO label to alert
          </button>
        </div>
      </div>
    </div>
  );
};

export default SLOCreateAlertSetup;
