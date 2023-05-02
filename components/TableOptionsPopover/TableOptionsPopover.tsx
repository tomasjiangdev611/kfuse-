import classnames from 'classnames';
import React from 'react';
import { Settings } from 'react-feather';
import TableOptionsPopoverPanel from './TableOptionsPopoverPanel';
import useColumnsState from './useColumnsState';
import useTableOptions from './useTableOptions';
import { PopoverPosition, PopoverTriggerV2 } from '../PopoverTriggerV2';

type Props = {
  className?: string;
  columnsState: ReturnType<typeof useColumnsState>;
  shouldHideLinesToShow?: boolean;
  tableOptions: ReturnType<typeof useTableOptions>;
};

const TableOptionsPopover = ({
  className,
  columnsState,
  shouldHideLinesToShow,
  tableOptions,
}: Props) => {
  return (
    <PopoverTriggerV2
      className={classnames({ [className]: className })}
      popover={(props) => (
        <TableOptionsPopoverPanel
          {...props}
          columnsState={columnsState}
          shouldHideLinesToShow={shouldHideLinesToShow}
          tableOptions={tableOptions}
        />
      )}
      position={PopoverPosition.BOTTOM_LEFT}
    >
      <div className="button button--short">
        <Settings className="button__icon" size={14} />
        <span>Options</span>
      </div>
    </PopoverTriggerV2>
  );
};

export default TableOptionsPopover;
