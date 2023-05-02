import { Key } from 'components';
import { keyCodes } from 'constants';
import React from 'react';
import { LogEvent } from 'types';
import useSheetState from './useSheetState';

type Props = {
  logs: LogEvent[];
  sheetState: ReturnType<typeof useSheetState>;
};

const LogsSheetToolbarSelection = ({ logs, sheetState }: Props) => {
  const { state } = sheetState;
  const { selection } = state;
  const { startY, endY } = selection;

  if (startY !== null && endY !== null) {
    const start = Math.max(startY, 0);
    const end = Math.min(endY, logs.length - 1);
    const selectedRowCount = end - start + 1;

    if (start < logs.length && selectedRowCount) {
      return (
        <div className="logs__sheet__toolbar__selection">
          <span>
            {`${selectedRowCount} Log Line${
              selectedRowCount === 1 ? '' : 's'
            } Selected, Press`}
          </span>
          <Key
            className="logs__sheet__toolbar__selection__key"
            keyCode={keyCodes.ENTER}
            text="enter"
          />
          <span>for log details</span>
        </div>
      );
    }
  }

  return null;
};

export default LogsSheetToolbarSelection;
