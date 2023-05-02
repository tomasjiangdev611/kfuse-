import { facetNames } from './constants';
import camelcaseKeys from 'camelcase-keys';
import { Loader, Select, Table, Input } from 'components';
import cicdTableKpis from 'constants/cicdTableKpis';
import colors from 'constants/colors';
import dayjs from 'dayjs';
import cicdPipelineDetailsColumns from 'constants/cicdPipelineDetailsColumns';
import { Datepicker } from 'composite';
import {
  useColorsByServiceName,
  useDateState,
  useForm,
  useRequest,
  useToggle,
  useSelectedFacetValuesByNameState,
  useLiveTail,
} from 'hooks';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { ChevronRight } from 'react-feather';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { queryRange } from 'requests';
import cicdTraces from 'requests/cicdTraces';
import CicdSideBar from 'screens/Cicd/CicdSidebar';
import CicdPipelineExecutions from './CicdPipelineExecutions';
import CicdPipelineRightSidebar from './CicdPipelineRightSidebar';
import CicdPipelineSummaryGrid from './CicdPipelineSummaryGrid';
import CicdPipelineSummaryTable from './CicdPipelineSummaryTable';
import { SelectedFacetValuesByName, Trace } from 'types';
import { DateSelection } from 'types/DateSelection';
import { formatDiffNs } from 'utils/timeNs';
import { formatDatasets } from './utils';

const getQueries = (
  date: DateSelection,
  selectedFacetValuesByName: SelectedFacetValuesByName,
) => {
  const timeDuration = `${date.endTimeUnix - date.startTimeUnix}s`;
  return cicdTableKpis.map((kpi) =>
    kpi.servicesQuery(timeDuration, selectedFacetValuesByName),
  );
};

const CicdPipeline = () => {
  const location = useLocation();
  const [activeTrace, setActiveTrace] = useState<Trace>(null);
  const [executionData, setExecutionData] = useState(location.state?.rowData);
  if (location.state?.rowData) {
    localStorage.setItem(
      'executionData',
      JSON.stringify(location.state?.rowData),
    );
  }
  const [tableData, setTableData] = useState(location.state?.tableData);
  const [cicdTableData, setCicdTableData] = useState(tableData);
  const [cicdData, setCicdData] = useState(tableData);
  const cicdMainTraceRequest = useRequest(cicdTraces);
  const cicdJobTraceRequest = useRequest(cicdTraces);
  const [date, setDate] = useDateState();
  const { service } = useParams();
  const focusToggle = useToggle();
  const [updatedTableData] = useState([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedFacetValuesByNameState = useSelectedFacetValuesByNameState();
  const colorsByServiceName = useColorsByServiceName();
  const [search, setSearch] = useState('');
  const liveTail = useLiveTail(
    '/trace/livetail?traceFilter=%7B%7D',
    camelcaseKeys,
  );
  const filtersForm = useForm(
    facetNames.reduce(
      (obj, facetName) => ({ ...obj, [facetName.name]: null }),
      {},
    ),
  );
  const formValues = filtersForm.values;

  const onChange = (nextService) => {
    uniqueBranchList.map((element) => {
      if (element.span.attributes.branch === nextService) {
        setExecutionData(element);
        localStorage.setItem('executionData', JSON.stringify(element));
      }
    });
  };

  const kpisByServiceNameRequest = useRequest((args) => {
    const queries = getQueries(args.date, args.selectedFacetValuesByName);
    return Promise.all(
      queries.map((query) => queryRange({ date, instant: true, query })),
    ).then(formatDatasets);
  });

  useEffect(() => {
    if (!executionData) {
      setExecutionData(JSON.parse(localStorage.getItem('executionData')));
    }
    cicdJobTraceRequest.call({
      date,
      selectedFacetValuesByName: {},
      ParentSpanIdFilter: executionData?.span.spanId,
    });
  }, [date, executionData]);

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
      setTableData(result);
    }
  }, [kpisByServiceNameRequest.result, cicdMainTraceRequest.result]);

  useEffect(() => {
    searchFromCICDTable(search);
  }, [search]);

  const searchFromCICDTable = (searchText) => {
    const searchedData: unknown[] = [];
    setCicdTableData(cicdData);
    cicdData?.forEach((rowData) => {
      if (
        rowData.span.spanId?.includes(searchText) ||
        rowData.span.attributes.workflow_url?.includes(searchText) ||
        rowData.span.attributes.commit_id?.includes(searchText)
      ) {
        searchedData.push(rowData);
      }
    });
    setCicdTableData(searchedData);
    if (searchText === '' || searchText === null || searchText === undefined) {
      setCicdTableData(cicdData);
    }
  };

  useEffect(() => {
    rows;
  }, [cicdTableData]);

  const rows = useMemo(() => {
    updatedTableData.splice(0, updatedTableData.length);
    cicdTableData?.map((tableRow: any) => {
      if (
        tableRow.span.name === executionData?.span.name &&
        tableRow.span.serviceName === executionData?.span.serviceName &&
        tableRow.span.attributes.branch ===
          executionData?.span.attributes.branch &&
        tableRow.span.attributes.org_name ===
          executionData?.span.attributes.org_name
      ) {
        updatedTableData.push(tableRow);
      }
    });
    return updatedTableData;
  }, [cicdTableData, executionData]);

  const uniqueIds: any[] = [];
  let uniqueBranchList: any[] = [];
  if (tableData) {
    uniqueBranchList = tableData.filter((element) => {
      const isDuplicate = uniqueIds.includes(element.span.attributes.branch);
      if (
        !isDuplicate &&
        element.span.attributes.service_name ===
          executionData?.span.attributes.service_name &&
        element.span.attributes.span_name ===
          executionData?.span.attributes.span_name
      ) {
        uniqueIds.push(element.span.attributes.branch);
        return true;
      }
      return false;
    });
  }

  useEffect(() => {
    liveTail.stopLiveTail();
  }, [date]);

  const close = () => {
    setActiveTrace(null);
  };

  useEffect(() => {
    return () => {
      liveTail.closeSocket();
    };
  }, []);

  const onRowClick = ({ row }: { row: Trace }) => {
    setActiveTrace(row);
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
    <div className="cicdPipeline">
      <div className="cicdPipeline__header">
        <div className="cicdPipeline__header__top">
          <div className="cicdPipeline__header__left">
            <div className="breadcrumbs">
              <div
                className="breadcrumbs__item"
                style={{ fontSize: 14, fontWeight: 'bold' }}
              >
                {executionData?.span.attributes.service_name}
              </div>

              <div className="breadcrumbs__chevron">
                <ChevronRight size={18} />
              </div>
              <div
                className="breadcrumbs__item"
                style={{ fontSize: 14, fontWeight: 'bold' }}
              >
                {executionData?.span.attributes.span_name}
              </div>

              <div className="breadcrumbs__chevron">
                <ChevronRight size={18} />
              </div>
              <div className="cicdPipeline__header__breadcrumbs__item">
                <Select
                  className="cicdPipeline__header__title text--h2 select--naked"
                  onChange={onChange}
                  options={(uniqueBranchList || []).map((rowData: any) =>
                    rowData.span.attributes.service_name ===
                      executionData.span.attributes.service_name &&
                    rowData.span.attributes.span_name ===
                      executionData.span.attributes.span_name
                      ? {
                          label: rowData.span.attributes.branch,
                          value: rowData.span.attributes.branch,
                        }
                      : {
                          label: executionData.span.attributes.branch,
                          value: executionData.span.attributes.branch,
                        },
                  )}
                  value={executionData?.span.attributes.branch}
                />
              </div>
            </div>
          </div>
          <div className="cicdPipeline__header__right">
            <Datepicker
              onChange={setDate}
              value={date}
              hasStartedLiveTail={liveTail.isEnabled}
              startLiveTail={liveTail.startLiveTailIfNeeded}
            />
          </div>
        </div>
      </div>
      {executionData ? (
        <div className="cicdPipeline__header__container">
          <div className="cicdPipeline__header__left">
            Last Execution:{' '}
            <span
              style={{
                marginLeft: 5,
                padding: 2,
                backgroundColor:
                  executionData?.span.attributes.status === 'success'
                    ? colors.green
                    : colors.red,
              }}
            >
              {executionData?.span.attributes.status.toUpperCase()}
            </span>
            <span style={{ margin: 5 }}>&#8226;</span>
            {formatDiffNs(
              executionData?.span.startTimeNs,
              dayjs().unix() * 1000 * 1000000,
            )}
            <span style={{ margin: 5 }}>&#8226;</span>
            Pipeline ID: {executionData?.traceId}
          </div>
          <div className="cicdPipeline__header__right" style={{ marginTop: 2 }}>
            Duration:{' '}
            {formatDiffNs(
              executionData?.span.startTimeNs,
              executionData?.span.endTimeNs,
            )}
          </div>
        </div>
      ) : (
        ''
      )}
      <div className="cicdPipeline__main">
        <div className="cicdPipeline__section">
          <CicdPipelineSummaryGrid
            date={date}
            formValues={formValues}
            service={service}
          />
        </div>
        <div className="job_summary_header">
          <h2>Job Summary</h2>
        </div>
        <div className="cicdPipeline__subSection">
          <CicdPipelineSummaryTable
            colorsByServiceName={colorsByServiceName}
            date={date as DateSelection}
            kpisByServiceName={cicdJobTraceRequest.result || {}}
          />
        </div>
        <div className="cicdPipeline__subSection">
          <div className="pipeline_execution_header">
            <h2>Pipeline Executions</h2>
          </div>
          <div className="cicdPipeline__section">
            <CicdPipelineExecutions
              key={updatedTableData.length}
              tableData={updatedTableData}
            />
          </div>
        </div>
        <div className="cicdPipelines__search__header">
          <div className="cicdPipeline__search__header__title text--h1">
            Pipeline
          </div>
          <div className="cicdPipeline__search-bar-container">
            <div className="cicd__search-bar" onClick={onClick}>
              <Input
                className="cicd__search-bar__input"
                onChange={setSearch}
                placeholder="Search pipeline executions"
                type="text"
                onBlur={focusToggle.off}
                value={search}
              />
            </div>
          </div>
        </div>
        <div className="cicdPipelines__header">
          <div>
            <CicdSideBar
              colorsByServiceName={colorsByServiceName}
              date={date}
              selectedFacetValuesByNameState={selectedFacetValuesByNameState}
            />
          </div>
          <div className="cicd__body">
            <Loader
              className="cicdPipeline__table"
              isLoading={cicdMainTraceRequest.isLoading}
            >
              <Table
                className="table--padded table--bordered"
                columns={cicdPipelineDetailsColumns(colorsByServiceName)}
                isSortingEnabled
                onRowClick={onRowClick}
                rows={rows}
              />
            </Loader>
          </div>
        </div>
      </div>
      {activeTrace ? (
        <CicdPipelineRightSidebar
          close={close}
          date={date as DateSelection}
          key={activeTrace.span.spanId}
          trace={activeTrace}
          colorsByServiceName={colorsByServiceName}
        />
      ) : null}
    </div>
  );
};

export default CicdPipeline;
