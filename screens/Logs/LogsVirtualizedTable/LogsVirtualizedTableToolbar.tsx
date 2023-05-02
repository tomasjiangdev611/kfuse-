import { useToggle } from 'hooks';
import React from 'react';
import { BsLayoutSplit } from 'react-icons/bs';
import { DateSelection } from 'types';
import LogsVirtualizedTableFullView from './LogsVirtualizedTableFullView';
import { useLogsWorkbooksState } from '../hooks';

type Props = {
  date: DateSelection;
  logsWorkbooksState: ReturnType<typeof useLogsWorkbooksState>;
};

const LogsVirtualizedTableToolbar = ({ date, logsWorkbooksState }: Props) => {
  const { workbooks } = logsWorkbooksState;
  const showFullsizeModal = useToggle();

  if (workbooks.length <= 1) {
    return null;
  }

  return (
    <>
      <div className="logs__virtualized-table__toolbar">
        <div className="logs__virtualized-table__toolbar__left" />
        <div className="logs__virtualized-table__toolbar__right">
          <button
            className="button button--naked button--short"
            onClick={showFullsizeModal.on}
          >
            <BsLayoutSplit className="button__icon" size={12} />
            <span className="button__text">Compare with another view</span>
          </button>
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

export default LogsVirtualizedTableToolbar;
