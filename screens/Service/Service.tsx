import classnames from 'classnames';
import { DateControls, Select } from 'components';
import { Datepicker } from 'composite';
import {
  useColorsByServiceName,
  useDateState,
  useForm,
  useRequest,
  useToggle,
} from 'hooks';
import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'react-feather';
import {
  createSearchParams,
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { getServices } from 'requests';
import { facetNames } from './constants';
import ServiceFilters from './ServiceFilters';
import ServiceRightSidebar from './ServiceRightSidebar';
import ServiceSLOInfo from './ServiceSLOInfo';
import ServiceSummaryGrid from './ServiceSummaryGrid';
import ServiceTab from './ServiceTab';
import ServiceTraces from './ServiceTraces';
import { Property, SidebarState } from './types';

const tabs = [
  { label: 'Resources', property: Property.spanName },
  { label: 'Deployments', property: Property.version },
];

const labelsByProperty = tabs.reduce(
  (obj, tab) => ({ ...obj, [tab.property]: tab.label }),
  {},
);

const Service = () => {
  const navigate = useNavigate();
  const getServicesRequest = useRequest(getServices);
  const [property, setProperty] = useState<Property>(Property.spanName);
  const [sidebar, setSidebar] = useState<SidebarState>();
  const [date, setDate] = useDateState();
  const { service } = useParams();

  const colorsByServiceName = useColorsByServiceName();
  const filtersForm = useForm(
    facetNames.reduce(
      (obj, facetName) => ({ ...obj, [facetName.name]: null }),
      {},
    ),
  );

  const showTracesToggle = useToggle();

  const key = `${service}:${property}`;
  const formValues = filtersForm.values;
  const onChange = (nextService: string) => {
    navigate(`/apm/services/${nextService}`);
  };

  useEffect(() => {
    getServicesRequest.call({ date });
  }, [date]);

  return (
    <div className="service">
      <div className="service__header">
        <div className="service__header__top">
          <div className="service__header__left">
            <div className="breadcrumbs">
              <div className="breadcrumbs__item">
                <Link
                  className="text--h2"
                  to={{
                    pathname: `/apm/services`,
                    search: createSearchParams({
                      date: JSON.stringify(date),
                    }).toString(),
                  }}
                >
                  Services
                </Link>
              </div>
              <div className="breadcrumbs__chevron">
                <ChevronRight size={18} />
              </div>
              <div className="service__header__breadcrumbs__item">
                <Select
                  className="service__header__title text--h2 select--naked"
                  onChange={onChange}
                  options={(getServicesRequest.result || []).map(
                    (serviceOption: string) => ({
                      label: serviceOption,
                      value: serviceOption,
                    }),
                  )}
                  value={service}
                />
              </div>
              <ServiceSLOInfo serviceName={service} />
            </div>
          </div>
          <div className="service__header__right">
            <Datepicker onChange={setDate} value={date} />
            <DateControls date={date} setDate={setDate} />
          </div>
        </div>
        <ServiceFilters
          date={date}
          filtersForm={filtersForm}
          serviceName={service}
        />
      </div>
      <div className="service__main">
        <div className="service__section">
          <ServiceSummaryGrid
            colorsByServiceName={colorsByServiceName}
            date={date}
            formValues={formValues}
            key={key}
            service={service}
            setDate={setDate}
          />
        </div>
        <div className="service__tabs tabs__buttons tabs__buttons--underline">
          {tabs.map((tab, i) => (
            <button
              className={classnames({
                tabs__buttons__item: true,
                'tabs__buttons__item--active':
                  !showTracesToggle.value && property === tab.property,
              })}
              key={i}
              onClick={() => {
                showTracesToggle.off();
                setProperty(tab.property);
              }}
            >
              {tab.label}
            </button>
          ))}
          <button
            className={classnames({
              tabs__buttons__item: true,
              'tabs__buttons__item--active': showTracesToggle.value,
            })}
            onClick={showTracesToggle.on}
          >
            Traces
          </button>
        </div>
        {showTracesToggle.value ? (
          <ServiceTraces
            colorsByServiceName={colorsByServiceName}
            date={date}
            formValues={formValues}
            key={key}
            service={service}
            setSidebar={setSidebar}
          />
        ) : (
          <ServiceTab
            date={date}
            formValues={formValues}
            key={key}
            label={labelsByProperty[property]}
            property={property}
            service={service}
            setDate={setDate}
            setSidebar={setSidebar}
          />
        )}
      </div>
      <ServiceRightSidebar
        colorsByServiceName={colorsByServiceName}
        date={date}
        formValues={formValues}
        property={property}
        service={service}
        sidebar={sidebar}
        setSidebar={setSidebar}
      />
    </div>
  );
};

export default Service;
