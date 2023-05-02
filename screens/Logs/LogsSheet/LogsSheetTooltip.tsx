import { CopyButton, TooltipTrigger } from 'components';
import React from 'react';
import { BsLayoutSidebarInsetReverse } from 'react-icons/bs';
import { PanelPosition, PanelState } from 'types';
import { getSheetCellValue } from 'utils';

type Props = {
  state: PanelState;
};

const LogsSheetTooltip = ({
  column,
  index,
  logs,
  offsetTop,
  offsetX,
  offsetY,
  setSelectedLog,
  row,
}: Props) => {
  const tooltipPosition =
    offsetTop < 10 ? PanelPosition.BOTTOM : PanelPosition.TOP;

  const onMouseDown = (e) => {
    e.stopPropagation();
  };

  const selectLog = () => {
    setSelectedLog({ index, logs });
  };

  return (
    <div className="logs__sheet__tooltip" onMouseDown={onMouseDown}>
      <CopyButton
        offsetX={offsetX}
        offsetY={offsetY}
        text={getSheetCellValue({ column, row })}
        tooltipPosition={tooltipPosition}
      />
      <TooltipTrigger
        offsetX={offsetX}
        offsetY={offsetY}
        position={tooltipPosition}
        tooltip="Show Details"
      >
        <button
          className="logs__sheet__tooltip__button logs__sheet__tooltip__button--select"
          onClick={selectLog}
        >
          <BsLayoutSidebarInsetReverse size={18} />
        </button>
      </TooltipTrigger>
    </div>
  );
};

export default LogsSheetTooltip;
