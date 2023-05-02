import { chartingPalette, serviceTableKpis } from 'constants';
import React, { useEffect } from 'react';
import { DateSelection } from 'types';
import ServiceTabChartGrid from './ServiceTabChartGrid';
import ServiceTabTable from './ServiceTabTable';
import { Property, SidebarState } from './types';
import useKpisBySpanNameRequest from './useKpisBySpanNameRequest';

type Props = {
  date: DateSelection;
  formValues: { [key: string]: any };
  label: string;
  property: Property;
  service: string;
  setDate: (date: DateSelection) => void;
  setSidebar: (sidebar: SidebarState) => void;
};

const ServiceTab = ({
  date,
  formValues,
  label,
  property,
  service,
  setDate,
  setSidebar,
}: Props) => {
  const kpisBySpanNameRequest = useKpisBySpanNameRequest();
  const { colorMap, tableRequest } = kpisBySpanNameRequest;

  useEffect(() => {
    kpisBySpanNameRequest.fetch({ date, formValues, property, service });
  }, [date, formValues]);

  return (
    <div className="service__tab">
      <div className="service__section">
        {tableRequest.result ? (
          <ServiceTabChartGrid
            colorMap={colorMap}
            date={date}
            formValues={formValues}
            property={property}
            service={service}
            setDate={setDate}
          />
        ) : null}
      </div>
      <div className="service__section">
        <div className="service__section__header">{label}</div>
        <div className="service__section__body">
          <ServiceTabTable
            date={date}
            kpisBySpanNameRequest={kpisBySpanNameRequest}
            property={property}
            service={service}
            setActiveName={(activeName) => {
              setSidebar({ activeName, colorMap });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceTab;
