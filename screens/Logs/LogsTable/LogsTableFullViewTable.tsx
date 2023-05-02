import { useThemeContext } from 'components';
import { dateTimeFormat } from 'constants';
import dayjs from 'dayjs';
import { useRequest } from 'hooks';
import React, { useEffect, useMemo } from 'react';
import { Table } from 'react-fluid-table';
import { getLogs } from 'requests';
import { DateSelection, LogEvent, LogEventList, LogsWorkbook } from 'types';
import LogsVirtualizedTableMessage from '../LogsVirtualizedTable/LogsVirtualizedTableMessage';

const formatResults = (results: LogEventList[]) => {
  const messagesByTimestamp: {
    [key: string]: { [key: number]: { [key: number]: string } };
  } = {};

  results.forEach((result, index) => {
    const { events } = result;
    events.forEach((event: LogEvent) => {
      const { message, timestamp } = event;
      const unix = dayjs(timestamp).valueOf();

      if (!messagesByTimestamp[unix]) {
        messagesByTimestamp[unix] = {};
      }

      if (!messagesByTimestamp[unix][index]) {
        messagesByTimestamp[unix][index] = {} as { [key: string]: string };
      }

      messagesByTimestamp[unix][index][message] = event;
    });
  });

  return Object.keys(messagesByTimestamp)
    .sort((a, b) => b.localeCompare(a))
    .map((unix) => messagesByTimestamp[unix]);
};

type Props = {
  date: DateSelection;
  selectedWorkbooks: { [key: string]: number };
  workbooks: LogsWorkbook[];
};

const LogsTableFullViewTable = ({
  date,
  selectedWorkbooks,
  workbooks,
}: Props) => {
  const fetchLogs = async () => {
    return Promise.all(
      workbooks.map((workbook) => getLogs({ ...workbook.logsState, date })),
    ).then(formatResults);
  };

  const columns = useMemo(() => {
    return [
      {
        key: 'unixTimestamp',
        header: 'Date',
        content: ({ row }) => {
          const { utcTimeEnabled } = useThemeContext();
          const { unixTimestamp } = row;
          const timestampDayJs = utcTimeEnabled
            ? dayjs(unixTimestamp).utc()
            : dayjs(unixTimestamp);

          return timestampDayJs.format(dateTimeFormat);
        },
        width: 140,
      },
      ...workbooks
        .filter((_, i) => selectedWorkbooks[i])
        .map((workbook, i) => ({
          key: i,
          header: workbook.name || 'Untitled',
          content: ({ row }) => {
            if (row[i]) {
              return Object.values(row[i]).map((event, j) => (
                <div
                  className="logs__virtualized-table__full-view__table__message"
                  key={j}
                >
                  <LogsVirtualizedTableMessage row={event} />
                </div>
              ));
            }

            return null;
          },
        })),
    ];
  }, [selectedWorkbooks, workbooks]);

  const fetchLogsRequest = useRequest(fetchLogs);

  const rows = useMemo(
    () => fetchLogsRequest.result || [],
    [fetchLogsRequest.result],
  );

  useEffect(() => {
    fetchLogsRequest.call();
  }, []);

  return (
    <div className="logs__virtualized-table__full-view__table">
      <Table columns={columns} data={rows} />
    </div>
  );
};

export default LogsTableFullViewTable;
