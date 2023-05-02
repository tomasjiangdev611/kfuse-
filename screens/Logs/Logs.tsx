import {
  LeftSidebar,
  RightSidebar,
  useColumnsState,
  useLeftSidebarState,
  useTableOptions,
} from 'components';
import { useLocalStorageToggle, useRequest, useToggle } from 'hooks';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getFacetNames } from 'requests';
import { User } from 'types';
import {
  useLogsLiveTail,
  useLogsState,
  useLogsWorkbooksState,
  useQueryScheduler,
} from './hooks';
import LogsAnalytics from './LogsAnalytics';
import LogsFingerprintsList from './LogsFingerprintsList';
import LogsSearch from './LogsSearch';
import LogsSelectedLog from './LogsSelectedLog';
import LogsSelectedLogTitle from './LogsSelectedLogTitle';
import LogsSidebar from './LogsSidebar';
import LogsTimeline from './LogsTimeline';
import LogsTable from './LogsTable';
import LogsTransactions from './LogsTransactions';
import LogsWorkbookHistory from './LogsWorkbookHistory';
import { SelectedLog } from './types';
import { columns, MESSAGE, SOURCE, TIMESTAMP } from './constants';
import Smartour from 'smartour/dist/index.esm';

type Props = {
  user: User;
};

const Logs = ({ user }: Props): ReactElement => {
  const getFacetNamesRequest = useRequest(getFacetNames);
  const prevLogsState = useLogsState();
  const logsWorkbooksState = useLogsWorkbooksState();
  const { currentLogsState, currentWorkbook, isReady, setWorkbooks } =
    logsWorkbooksState;
  const logsState = { ...prevLogsState, ...currentLogsState };
  const leftSidebarState = useLeftSidebarState('logs');
  const queryScheduler = useQueryScheduler(leftSidebarState);
  const showHistoryToggle = useToggle();
  const showTimelineToggle = useLocalStorageToggle(
    'show-timeline-toggle',
    true,
  );
  const [tour, setTour] = useState(new Smartour());

  const [searchParams] = useSearchParams();
  const bindKeyHandlersRef = useRef<VoidFunction>();
  const logsLiveTail = useLogsLiveTail();
  const { tab } = useParams();

  const tableOptions = useTableOptions();
  const [hoveredLogDateUnix, setHoveredLogDateUnix] = useState(null);

  const columnsState = useColumnsState({
    columns,
    initialState: {
      resizedWidths: {},
      selectedColumns: {
        [MESSAGE]: 1,
        [SOURCE]: 1,
        [TIMESTAMP]: 1,
      },
    },
    key: 'logs-table',
  });
  const selectedLogFromContext = currentWorkbook.selectedLogFromContext || null;
  const [selectedLog, setSelectedLog] = useState<SelectedLog>(null);

  const clearHoveredLogDateUnix = () => {
    setHoveredLogDateUnix(null);
  };

  useEffect(() => {
    logsLiveTail.init(logsState);
  }, [searchParams]);

  useEffect(() => {
    setWorkbooks([]);
  }, []);
  useEffect(() => {
    if (
      queryScheduler.firstQueryCompletedAt &&
      queryScheduler.secondQueryCompletedAt
    ) {
      tour
        .queue([
          {
            el: '.logs__search',
            options: {
              layerEvent: tour.next.bind(tour),
              slotPosition: 'bottom',
            },
            slot: `This is Search Logs Input`,
          },
          {
            el: '.logs__sheet',
            options: {
              layerEvent: tour.next.bind(tour),
              slotPosition: 'top',
            },
            slot: 'This is Logs Table',
          },
          {
            el: '.left-sidebar__inner',
            options: {
              layerEvent: tour.next.bind(tour),
              slotPosition: 'right',
            },
            slot: 'This is FilterSideBar',
          },
        ])
        .run();
    }
  }, [queryScheduler]);
  return (
    <div className="logs">
      {isReady ? (
        <div className="logs__main">
          <LeftSidebar leftSidebarState={leftSidebarState}>
            <LogsSidebar
              logsState={logsState}
              queryScheduler={queryScheduler}
            />
          </LeftSidebar>
          <div className="logs__content">
            <LogsSearch
              getFacetNamesRequest={getFacetNamesRequest}
              leftSidebarState={leftSidebarState}
              logsLiveTail={logsLiveTail}
              logsState={logsState}
              showTimelineToggle={showTimelineToggle}
            />
            {showTimelineToggle.value && !logsLiveTail.isEnabled ? (
              <LogsTimeline
                hoveredLogDateUnix={hoveredLogDateUnix}
                logsState={logsState}
                queryScheduler={queryScheduler}
                selectedLog={selectedLog}
                showTimelineToggle={showTimelineToggle}
              />
            ) : null}
            <div className="logs__main__content">
              {tab === undefined ? (
                <LogsTable
                  columnsState={columnsState}
                  clearHoveredLogDateUnix={clearHoveredLogDateUnix}
                  logsLiveTail={logsLiveTail}
                  logsState={logsState}
                  logsWorkbooksState={logsWorkbooksState}
                  queryScheduler={queryScheduler}
                  selectedLog={selectedLog}
                  selectedLogFromContext={selectedLogFromContext}
                  setHoveredLogDateUnix={setHoveredLogDateUnix}
                  setSelectedLog={setSelectedLog}
                  bindKeyHandlersRef={bindKeyHandlersRef}
                  tableOptions={tableOptions}
                />
              ) : null}
              {tab === 'fingerprints' ? (
                <LogsFingerprintsList
                  logsState={logsState}
                  queryScheduler={queryScheduler}
                />
              ) : null}
              {tab === 'transactions' ? (
                <LogsTransactions
                  getFacetNamesRequest={getFacetNamesRequest}
                  logsState={logsState}
                />
              ) : null}
              {tab === 'chart' ? (
                <LogsAnalytics
                  logsState={logsState}
                  queryScheduler={queryScheduler}
                />
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
      {showHistoryToggle.value && currentWorkbook ? (
        <RightSidebar
          className="logs__workbook-history"
          close={showHistoryToggle.off}
          title="History"
        >
          <LogsWorkbookHistory
            logsWorkbooksState={logsWorkbooksState}
            showHistoryToggle={showHistoryToggle}
            user={user}
          />
        </RightSidebar>
      ) : null}
      {selectedLog && selectedLog.index < selectedLog.logs.length ? (
        <RightSidebar
          close={() => {
            const bindKeyHandlers = bindKeyHandlersRef.current;
            if (bindKeyHandlers) {
              bindKeyHandlers();
            }
            setSelectedLog(null);
          }}
          title={
            <LogsSelectedLogTitle
              logEvent={selectedLog.logs[selectedLog.index]}
            />
          }
        >
          <LogsSelectedLog
            logsState={logsState}
            logsWorkbooksState={logsWorkbooksState}
            selectedLog={selectedLog}
            setSelectedLog={setSelectedLog}
          />
        </RightSidebar>
      ) : null}
    </div>
  );
};

export default Logs;
