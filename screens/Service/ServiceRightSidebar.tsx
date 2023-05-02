import { RightSidebar, TraceSidebar } from 'components';
import React, { Dispatch, SetStateAction } from 'react';
import { DateSelection } from 'types';
import ServiceSidebar from './ServiceSidebar';
import { Property, SidebarState } from './types';

type Props = {
  colorsByServiceName: { [key: string]: string };
  date: DateSelection;
  formValues: { [key: string]: any };
  property: Property;
  service: string;
  setSidebar: Dispatch<SetStateAction<SidebarState>>;
  sidebar: SidebarState;
};

const ServiceRightSidebar = ({
  colorsByServiceName,
  date,
  formValues,
  property,
  service,
  sidebar,
  setSidebar,
}: Props) => {
  const close = () => {
    setSidebar(null);
  };

  if (!sidebar) {
    return null;
  }

  if (sidebar.activeName) {
    return (
      <RightSidebar
        className="service__sidebar"
        close={close}
        title={sidebar.activeName}
      >
        <ServiceSidebar
          colorsByServiceName={colorsByServiceName}
          colorMap={sidebar.colorMap}
          initialDate={date}
          initialFormValues={formValues}
          key={`$sidebar.activeName}-${service}-${property}`}
          name={sidebar.activeName}
          property={property}
          service={service}
          setSidebar={setSidebar}
        />
        {sidebar.activeTrace ? (
          <TraceSidebar
            close={() => {
              setSidebar((prevSidebar) => ({
                ...prevSidebar,
                activeTrace: null,
              }));
            }}
            colorsByServiceName={colorsByServiceName}
            date={date as DateSelection}
            key={sidebar.activeTrace.span.spanId}
            trace={sidebar.activeTrace}
          />
        ) : null}
      </RightSidebar>
    );
  }

  if (sidebar.activeTrace) {
    return (
      <TraceSidebar
        close={close}
        colorsByServiceName={colorsByServiceName}
        date={date as DateSelection}
        key={sidebar.activeTrace.span.spanId}
        trace={sidebar.activeTrace}
      />
    );
  }

  return null;
};

export default ServiceRightSidebar;
