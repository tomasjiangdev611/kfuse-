import { Checkbox, Picker } from 'components';
import React, { ReactElement } from 'react';
import { columns } from '../constants';
import { useColumnsState, useTableOptions } from '../hooks';

type Props = {
  close: () => void;
  columnsState: ReturnType<typeof useColumnsState>;
  tableOptions: ReturnType<typeof useTableOptions>;
};

const LogsSheetToolbarOptionsPanel = ({
  columnsState,
  tableOptions,
}: Props): ReactElement => {
  const { setLinesToShow } = tableOptions;
  const { linesToShow } = tableOptions.state;
  const { state, toggleSelectedColumnByKey } = columnsState;
  const { selectedColumns } = state;

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
    </div>
  );
};

export default LogsSheetToolbarOptionsPanel;
