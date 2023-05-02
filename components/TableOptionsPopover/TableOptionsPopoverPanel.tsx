import { Checkbox, Picker } from 'components';
import React, { ReactElement } from 'react';
import useColumnsState from './useColumnsState';
import useTableOptions from './useTableOptions';

type Props = {
  close: () => void;
  columnsState: ReturnType<typeof useColumnsState>;
  shouldHideLinesToShow?: boolean;
  tableOptions: ReturnType<typeof useTableOptions>;
};

const TableOptionsPopoverPanel = ({
  columnsState,
  shouldHideLinesToShow,
  tableOptions,
}: Props): ReactElement => {
  const { columns, state, toggleSelectedColumnByKey } = columnsState;
  const { selectedColumns } = state;

  const { setLinesToShow } = tableOptions;
  const { linesToShow } = tableOptions.state;

  const onChangeHandler = (key: string) => () => {
    toggleSelectedColumnByKey(key);
  };

  return (
    <div className="logs__table__toolbar__options__panel">
      <div className="logs__table__toolbar__options__panel__section">
        {columns.map((column) => (
          <div
            className="logs__table__toolbar__options__panel__item"
            key={column.key}
          >
            <Checkbox
              onChange={onChangeHandler(column.key)}
              value={Boolean(selectedColumns[column.key])}
            />
            <div className="logs__table__toolbar__options__panel__item__label">
              {column.label}
            </div>
          </div>
        ))}
      </div>
      {!shouldHideLinesToShow ? (
        <div className="logs__table__toolbar__options__panel__section">
          <div className="logs__table__toolbar__options__panel__item">
            <div className="logs__table__toolbar__options__panel__item__label">
              Lines to show
            </div>
            <Picker
              onChange={setLinesToShow}
              options={[1, 3, 5, 10].map((value) => ({
                label: String(value),
                value,
              }))}
              value={linesToShow}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TableOptionsPopoverPanel;
