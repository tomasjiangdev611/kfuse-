import {
  Input,
  LeftSidebar,
  Loader,
  TooltipTrigger,
  useLeftSidebarState,
} from 'components';
import { Datepicker } from 'composite';
import cicdTableKpis from 'constants/cicdTableKpis';
import {
  useColorsByServiceName,
  useDateState,
  useRequest,
  useSelectedFacetValuesByNameState,
  useToggle,
} from 'hooks';
import React, { useEffect, useRef, useState } from 'react';
import { Maximize2 } from 'react-feather';
import { queryRange } from 'requests';
import cicdTraces from 'requests/cicdTraces';
import { DateSelection, PanelPosition, SelectedFacetValuesByName } from 'types';

import { formatDataset } from 'screens/Services/utils';

import CicdSidebar from './CicdSidebar';
import CicdTable from './CicdTable';

const getQueries = (
  date: DateSelection,
  selectedFacetValuesByName: SelectedFacetValuesByName,
) => {
  const timeDuration = `${date.endTimeUnix - date.startTimeUnix}s`;
  return cicdTableKpis.map((kpi) =>
    kpi.servicesQuery(timeDuration, selectedFacetValuesByName),
  );
};

const Cicd = ({}) => {
  const [date, setDate] = useDateState();
  const [cicdTableData, setCicdTableData] = useState();
  const [cicdData, setCicdData] = useState();
  const [search, setSearch] = useState('');
  const leftSidebarState = useLeftSidebarState('cicd');
  const selectedFacetValuesByNameState = useSelectedFacetValuesByNameState();
  const focusToggle = useToggle();
  const inputRef = useRef<HTMLInputElement>(null);
  const colorsByServiceName = useColorsByServiceName();

  const kpisByServiceNameRequest = useRequest((args) => {
    const queries = getQueries(args.date, args.selectedFacetValuesByName);
    return Promise.all(
      queries.map((query) => queryRange({ date, instant: true, query })),
    ).then(formatDataset);
  });

  const cicdMainTraceRequest = useRequest(cicdTraces);

  useEffect(() => {
    cicdMainTraceRequest.call({
      date,
      selectedFacetValuesByName: {
        ...{
          ci_test: {
            true: 1,
          },
        },
        ...selectedFacetValuesByNameState.state,
      },
      ParentSpanIdFilter: '0000000000000000',
    });
    kpisByServiceNameRequest.call({
      date,
      selectedFacetValuesByName: {},
    });
  }, [date, selectedFacetValuesByNameState.state]);

  useEffect(() => {
    if (cicdMainTraceRequest.result && kpisByServiceNameRequest.result) {
      const result = cicdMainTraceRequest.result.map((values) => ({
        ...values,
        ...Object.entries(kpisByServiceNameRequest.result).find((sp) => {
          if (sp[0] === values.span.serviceName) {
            return sp[1];
          }
        }),
      }));
      setCicdData(result);
      setCicdTableData(result);
    }
  }, [kpisByServiceNameRequest.result, cicdMainTraceRequest.result]);

  useEffect(() => {
    searchFromCICDTable(search);
  }, [search]);

  const searchFromCICDTable = (searchText) => {
    const searchedData: unknown[] = [];
    setCicdTableData(cicdData);
    if (searchText) {
      cicdData.forEach((rowData) => {
        if (
          rowData.span.name?.includes(searchText) ||
          rowData.span.serviceName?.includes(searchText) ||
          rowData.span.attributes.branch?.includes(searchText)
        ) {
          searchedData.push(rowData);
        }
      });
      setCicdTableData(searchedData);
      if (
        searchText === '' ||
        searchText === null ||
        searchText === undefined ||
        searchedData.length === 0
      ) {
        setCicdTableData(cicdData);
      }
    }
  };

  const onClick = () => {
    if (!focusToggle.value) {
      const input = inputRef.current;

      if (input) {
        input.focus();
      }
    }
  };

  return (
    <div className="cicd">
      <LeftSidebar leftSidebarState={leftSidebarState}>
        <CicdSidebar
          colorsByServiceName={colorsByServiceName}
          date={date}
          selectedFacetValuesByNameState={selectedFacetValuesByNameState}
        />
      </LeftSidebar>
      <div className="cicd__main">
        <div className="cicd__header">
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
          <div className="cicd__header__left">
            <div className="cicd__header__tabs button-group">
              <div className="cicd__search-bar" onClick={onClick}>
                <Input
                  className="cicd__search-bar__input"
                  onChange={setSearch}
                  placeholder="Filter pipelines"
                  type="text"
                  onBlur={focusToggle.off}
                  value={search}
                />
              </div>
            </div>
          </div>
          <div className="cicd__header__right">
            <Datepicker
              className="cicd__search__datepicker"
              onChange={setDate}
              value={date}
            />
          </div>
        </div>
        <div className="cicd__body">
          <Loader
            className="cicd__table"
            isLoading={kpisByServiceNameRequest.isLoading}
          >
            <CicdTable
              colorsByServiceName={colorsByServiceName}
              date={date as DateSelection}
              kpisByServiceName={cicdTableData || {}}
            />
          </Loader>
        </div>
      </div>
    </div>
  );
};

export default Cicd;
