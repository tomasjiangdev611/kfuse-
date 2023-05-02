import {
  PopoverTriggerV2,
  PopoverPosition,
  TableOptionsPopover,
  useColumnsState,
  useTableOptions,
} from 'components';
import { useToggle } from 'hooks';
import React from 'react';
import { Settings } from 'react-feather';
import { BsLayoutSplit } from 'react-icons/bs';
import { DateSelection, LogEvent } from 'types';
import LogsSheetToolbarOptionsPanel from './LogsSheetToolbarOptionsPanel';
import LogsSheetToolbarSelection from './LogsSheetToolbarSelection';
import useSheetState from './useSheetState';
import LogsVirtualizedTableFullView from '../LogsVirtualizedTable/LogsVirtualizedTableFullView';
import { useLogsWorkbooksState } from '../hooks';

type Props = {
  columnsState: ReturnType<typeof useColumnsState>;
  date: DateSelection;
  logs: LogEvent[];
  logsWorkbooksState: ReturnType<typeof useLogsWorkbooksState>;
  sheetState: ReturnType<typeof useSheetState>;
  tableOptions: ReturnType<typeof useTableOptions>;
};

const LogsSheetToolbar = ({
  columnsState,
  date,
  logs,
  logsWorkbooksState,
  sheetState,
  tableOptions,
}: Props) => {
  const { workbooks } = logsWorkbooksState;
  const showFullsizeModal = useToggle();

  return (
    <>
      <div className="logs__table__toolbar">
        <div className="logs__table__toolbar__left">
          <TableOptionsPopover
            className="logs__tabs__tools__item"
            columnsState={columnsState}
            tableOptions={tableOptions}
          />
        </div>
        <div className="logs__table__toolbar__middle">
          <LogsSheetToolbarSelection logs={logs} sheetState={sheetState} />
        </div>
        <div className="logs__table__toolbar__right">
          {workbooks.length > 1 ? (
            <button
              className="button button--naked button--short"
              onClick={showFullsizeModal.on}
            >
              <BsLayoutSplit className="button__icon" size={12} />
              <span className="button__text">Compare with another view</span>
            </button>
          ) : null}
        </div>
      </div>
      {showFullsizeModal.value ? (
        <LogsVirtualizedTableFullView
          close={showFullsizeModal.off}
          date={date}
          workbooks={workbooks}
        />
      ) : null}
    </>
  );
};

export default LogsSheetToolbar;
