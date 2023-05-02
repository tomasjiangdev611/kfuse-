import { Checkbox } from 'components';
import React, { useMemo, useState } from 'react';
import { X } from 'react-feather';
import { DateSelection, LogsWorkbook } from 'types';
import LogsVirtualizedTableFullViewTable from './LogsVirtualizedTableFullViewTable';

const getKey = (
  selectedWorkbooks: { [key: string]: number },
  workbooks: LogsWorkbook[],
) => {
  const ids = Object.keys(selectedWorkbooks)
    .filter((index) => selectedWorkbooks[index])
    .sort()
    .map((index) => workbooks[Number(index)].id || index);

  return ids.join(':');
};

type Props = {
  close: () => void;
  date: DateSelection;
  workbooks: LogsWorkbook[];
};

const LogsVirtualizedTableFullView = ({ close, date, workbooks }: Props) => {
  const [selectedWorkbooks, setSelectedWorkbooks] = useState<{
    [key: number]: number;
  }>(workbooks.reduce((obj, _, i) => ({ ...obj, [i]: 1 }), {}));

  const toggleWorkbook = (index: number) => (checked: boolean) => {
    setSelectedWorkbooks((prevSelectedWorkbooks) => ({
      ...prevSelectedWorkbooks,
      [index]: checked ? 1 : 0,
    }));
  };

  const key = useMemo(
    () => getKey(selectedWorkbooks, workbooks),
    [selectedWorkbooks, workbooks],
  );

  return (
    <div className="logs__virtualized-table__full-view">
      <div className="logs__virtualized-table__full-view__padder" />
      <div className="logs__virtualized-table__full-view__header">
        <div className="logs__virtualized-table__full-view__header__left">
          {workbooks.map((workbook, i) => (
            <div
              className="logs__virtualized-table__full-view__header__item"
              key={i}
            >
              <Checkbox
                onChange={toggleWorkbook(i)}
                value={Boolean(selectedWorkbooks[i])}
              />
              <div className="logs__virtualized-table__full-view__header__item__label">
                {workbook.name || 'Untitled'}
              </div>
            </div>
          ))}
        </div>
        <div className="logs__virtualized-table__full-view__header__right">
          <button onClick={close}>
            <X size={24} />
          </button>
        </div>
      </div>
      <LogsVirtualizedTableFullViewTable
        date={date}
        key={key}
        selectedWorkbooks={selectedWorkbooks}
        workbooks={workbooks}
      />
    </div>
  );
};

export default LogsVirtualizedTableFullView;
