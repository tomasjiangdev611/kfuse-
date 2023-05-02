import React from 'react';

const getActions = ({
  close,
  column,
  columnLocked,
  columnsState,
  index,
  onToggleLock,
  sortByColumn,
}) => {
  const { toggleSelectedColumnByKey } = columnsState;
  const onClickHandler = (f: VoidFunction) => (e) => {
    f();
    close();
  };

  const result = [
    {
      label: `${columnLocked ? 'Unlock' : 'Lock'} column`,
      onClick: onClickHandler(onToggleLock),
    },
    {
      label: 'Remove column',
      onClick: onClickHandler(() => {
        toggleSelectedColumnByKey(column.key);
      }),
    },
  ];

  if (sortByColumn) {
    result.push({
      label: 'Sort Ascending',
      onClick: onClickHandler(() => {
        sortByColumn(column.key, 'Asc');
      }),
    });

    result.push({
      label: 'Sort Descending',
      onClick: onClickHandler(() => {
        sortByColumn(column.key, 'Desc');
      }),
    });
  }

  return result;
};

const SheetHeaderCellMore = ({
  close,
  column,
  columnLocked,
  columnsState,
  index,
  onToggleLock,
  sortByColumn,
}) => {
  const onMouseDown = (e) => {
    e.stopPropagation();
  };

  const actions = getActions({
    close,
    column,
    columnLocked,
    columnsState,
    index,
    onToggleLock,
    sortByColumn,
  });
  return (
    <div>
      {actions.map((action, i) => (
        <div
          className="popover__panel__item"
          key={i}
          onClick={action.onClick}
          onMouseDown={onMouseDown}
        >
          {action.label}
        </div>
      ))}
    </div>
  );
};

export default SheetHeaderCellMore;
