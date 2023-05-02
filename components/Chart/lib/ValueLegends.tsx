import { Table } from 'components/Table';
import React, {
  MouseEvent,
  ReactElement,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { AlignedData } from 'uplot';

import { ScrollView, SeriesIcon } from './components';
import { UPlotConfig } from '../types';
import { tooltipFormatter } from '../utils';

const columns = [
  { key: 'label', label: 'Label' },
  { key: 'value', label: 'Value' },
];

const LegendsRow = ({
  onFocusSeries,
  onRowClick,
  row,
  rowValue,
}: {
  onFocusSeries: () => void;
  onRowClick: (e: MouseEvent) => void;
  row: any;
  rowValue: number | string;
}) => {
  return (
    <tr
      className="table__row table__row--body"
      onClick={onRowClick}
      style={{ opacity: row.show ? 1 : 0.5 }}
      onMouseEnter={onFocusSeries}
    >
      <th className="table__cell table__cell--body">
        <span>
          <SeriesIcon backgroundColor={row.stroke || row.fill} />
          {row.label.length > 125 ? row.label.slice(0, 125) + '...' : row.label}
        </span>
      </th>
      <th className="table__cell table__cell--body">{rowValue}</th>
    </tr>
  );
};

const ValueLegends = ({
  config,
  data,
  onItemClick,
  onFocusSeries,
  unit,
}: {
  config: UPlotConfig;
  data: AlignedData;
  onItemClick: (e: MouseEvent<HTMLLIElement>, idx: number) => void;
  onFocusSeries: (idx: number) => void;
  unit?: string;
}): ReactElement => {
  const [focusedPointIdx, setFocusedPointIdx] = useState<number>(0);

  const valueSeries = useMemo(() => {
    return config.series.slice(1);
  }, [config]);

  useLayoutEffect(() => {
    config.addHook('setLegend', (u: uPlot) => {
      if (u.cursor.idx && u.cursor.idx !== focusedPointIdx) {
        setFocusedPointIdx(u.cursor.idx);
      }
    });
  }, [config]);

  return (
    <div onMouseLeave={() => onFocusSeries(null)}>
      <ScrollView
        height={'auto'}
        width={config.width - 16}
        scrollIndicator={false}
      >
        <Table
          className="uplot__aggregate-legends__table"
          columns={columns}
          rows={valueSeries || []}
          renderRow={({ row, rowIndex }) => {
            const rowValue = data[rowIndex + 1][focusedPointIdx];

            return (
              <LegendsRow
                key={rowIndex}
                onFocusSeries={() => onFocusSeries(rowIndex + 1)}
                onRowClick={(e: any) => onItemClick(e, rowIndex + 1)}
                row={row}
                rowValue={
                  rowValue !== undefined ? tooltipFormatter(rowValue, unit) : 0
                }
              />
            );
          }}
        />
      </ScrollView>
    </div>
  );
};

export default ValueLegends;
