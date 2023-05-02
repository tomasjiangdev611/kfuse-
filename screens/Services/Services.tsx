import classnames from 'classnames';
import {
  DateControls,
  LeftSidebar,
  Loader,
  TooltipTrigger,
  useColumnsState,
  useLeftSidebarState,
} from 'components';
import { Datepicker } from 'composite';
import { chartingPalette, serviceTableKpis } from 'constants';
import {
  useDateState,
  useSelectedFacetValuesByNameState,
  useToggle,
} from 'hooks';
import React, { useMemo, useState } from 'react';
import { Maximize2 } from 'react-feather';
import { ImTable } from 'react-icons/im';
import { RiNodeTree } from 'react-icons/ri';
import { DateSelection, PanelPosition, SelectedFacetValuesByName } from 'types';
import getColumns from './getColumns';
import ServicesSidebar from './ServicesSidebar';
import ServicesTable from './ServicesTable';
import useKpisByServiceNameRequest from './useKpisByServiceNameRequest';
import TracesServiceMap from '../Traces/TracesServiceMap';

enum ServicesTab {
  serviceMap = 'Service Map',
  table = 'Table',
}

const getShouldDisable7Days = (
  selectedFacetValuesByName: SelectedFacetValuesByName,
): boolean => {
  const selectedFacetNames = Object.keys(selectedFacetValuesByName);
  return (
    selectedFacetNames.length === 0 ||
    !selectedFacetNames.find((facetName) => facetName === 'kube_namespace')
  );
};

const servicesTabs = [
  { icon: <ImTable size={14} />, serviceTab: ServicesTab.table },
  { icon: <RiNodeTree size={14} />, serviceTab: ServicesTab.serviceMap },
];

const Services = () => {
  const [date, setDate] = useDateState();
  const leftSidebarState = useLeftSidebarState('services');
  const showSidebarToggle = useToggle(true);
  const selectedFacetValuesByNameState = useSelectedFacetValuesByNameState();

  const [activeTab, setActiveTab] = useState<ServicesTab>(ServicesTab.table);
  const selectActiveTab = (servicesTab: ServicesTab) => () => {
    setActiveTab(servicesTab);
  };

  const kpisByServiceNameRequest = useKpisByServiceNameRequest();
  const kpisByServiceName = useMemo(
    () => kpisByServiceNameRequest.result || {},
    [kpisByServiceNameRequest.result],
  );

  const colorsByServiceName = Object.keys(kpisByServiceNameRequest.result || [])
    .sort()
    .reduce(
      (obj, serviceName, i) => ({
        ...obj,
        [serviceName]: chartingPalette[i % chartingPalette.length],
      }),
      {},
    );

  const columns = getColumns(colorsByServiceName, date, kpisByServiceName);
  const columnsState = useColumnsState({
    columns,
    initialState: {
      resizedWidths: {},
      selectedColumns: {
        name: 1,
        requestsPerSecond: 1,
        p50latency: 1,
        p99latency: 1,
        maxlatency: 1,
        errorRate: 1,
        apdex: 1,
      },
    },
    key: 'services-table',
    onSelectedColumnToggle: ({ key, isSelected }) => {
      if (isSelected) {
        kpisByServiceNameRequest.fetchSingleColumn({
          date,
          key,
          selectedFacetValuesByName: selectedFacetValuesByNameState.state,
        });
      }
    },
  });

  const shouldDisable7Days = useMemo(
    () => getShouldDisable7Days(selectedFacetValuesByNameState.state),
    [selectedFacetValuesByNameState.state],
  );

  return (
    <div
      className={classnames({
        services: true,
        'services--disable-7-day': shouldDisable7Days,
      })}
    >
      <LeftSidebar leftSidebarState={leftSidebarState}>
        <ServicesSidebar
          date={date}
          kpisByServiceName={kpisByServiceName}
          kpisByServiceNameRequest={kpisByServiceNameRequest}
          selectedFacetValuesByNameState={selectedFacetValuesByNameState}
          showSidebarToggle={showSidebarToggle}
        />
      </LeftSidebar>
      <div className="services__main">
        <div className="services__header">
          <div className="services__header__left">
            {leftSidebarState.width === 0 ? (
              <TooltipTrigger
                className="logs__search__show-filters-button"
                position={PanelPosition.TOP_LEFT}
                tooltip="Show Filters"
              >
                <button
                  className="button button--icon"
                  onClick={leftSidebarState.show}
                >
                  <Maximize2 size={12} />
                </button>
              </TooltipTrigger>
            ) : null}
            <div className="services__header__title text--h1">Services</div>
            <div className="services__header__tabs button-group">
              {servicesTabs.map((tab) => (
                <button
                  className={classnames({
                    'button-group__item': true,
                    'button-group__item--active': tab.serviceTab === activeTab,
                  })}
                  key={tab.serviceTab}
                  onClick={selectActiveTab(tab.serviceTab)}
                >
                  <div className="button-group__item__icon">{tab.icon}</div>
                  {tab.serviceTab}
                </button>
              ))}
            </div>
          </div>
          <div className="services__header__right">
            <Datepicker
              onChange={setDate as (dateSelection: DateSelection) => void}
              value={date as DateSelection}
            />
            <DateControls date={date} setDate={setDate} />
          </div>
        </div>
        <div className="services__body">
          {activeTab === ServicesTab.table ? (
            <Loader className="services__table">
              <ServicesTable
                columnsState={columnsState}
                date={date}
                kpisByServiceName={kpisByServiceNameRequest.result || {}}
                kpisByServiceNameRequest={kpisByServiceNameRequest}
                selectedFacetValuesByNameState={selectedFacetValuesByNameState}
              />
            </Loader>
          ) : (
            <TracesServiceMap
              colorsByServiceName={colorsByServiceName}
              date={date}
              selectedFacetValuesByName={selectedFacetValuesByNameState.state}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;
