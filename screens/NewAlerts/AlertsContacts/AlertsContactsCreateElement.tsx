import { FlyoutCaret } from 'components';
import React, { ReactElement, useEffect, useState } from 'react';

import AlertsContactsCreateElementField from './AlertsContactsCreateElementField';
import { useAlertsContactsState } from './hooks';
import { ContactNotifierType, ContactNotifierTypeOptions } from './types';

const AlertsContactsCreateElement = ({
  alertsContactsState,
  notifierData,
  notifierIndex,
  selectedNotifierData,
}: {
  alertsContactsState: ReturnType<typeof useAlertsContactsState>;
  notifierData: ContactNotifierType;
  notifierIndex: number;
  selectedNotifierData: { [key: string]: any };
}): ReactElement => {
  const [isOptionalOpen, setIsOptionalOpen] = useState(false);
  const { updateSelectedNotifierData } = alertsContactsState;
  const notifierDataRequird = notifierData.options.filter(
    (item: ContactNotifierTypeOptions) => item.required,
  );

  const notifierDataOptional = notifierData.options.filter(
    (item: ContactNotifierTypeOptions) => !item.required,
  );

  useEffect(() => {
    setIsOptionalOpen(false);
  }, [notifierData]);

  return (
    <div className="alerts__contacts__create__element">
      <div className="alerts__contacts__create__element__heading">
        {notifierData.heading}
      </div>
      <div className="alerts__contacts__create__element__required">
        {notifierDataRequird.map((field: any, index: number) => {
          return (
            <div key={index}>
              <div className="alerts__contacts__create__element__label">
                {field.label} (<span className="text--red">*</span>)
              </div>
              {field.description && (
                <div className="alerts__contacts__create__element__description">
                  {field.description}
                </div>
              )}
              <AlertsContactsCreateElementField
                field={field}
                onChange={(val) =>
                  updateSelectedNotifierData(
                    notifierIndex,
                    field.propertyName,
                    val,
                  )
                }
                value={selectedNotifierData[field.propertyName]}
              />
            </div>
          );
        })}
      </div>
      <div className="alerts__contacts__create__element__optional">
        <div
          className="alerts__contacts__create__element__optional__header"
          onClick={() => setIsOptionalOpen(!isOptionalOpen)}
        >
          <FlyoutCaret isOpen={isOptionalOpen} />
          <div>Optional {notifierData.name} settings</div>
        </div>
        {isOptionalOpen &&
          notifierDataOptional.map((field: any, index: number) => {
            return (
              <div key={index}>
                <div className="alerts__contacts__create__element__label">
                  {field.label}
                </div>
                {field.description && (
                  <div className="alerts__contacts__create__element__description">
                    {field.description}
                  </div>
                )}
                <AlertsContactsCreateElementField
                  field={field}
                  onChange={(val) =>
                    updateSelectedNotifierData(
                      notifierIndex,
                      field.propertyName,
                      val,
                    )
                  }
                  value={selectedNotifierData[field.propertyName]}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default AlertsContactsCreateElement;
