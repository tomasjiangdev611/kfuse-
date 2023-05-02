import { Table } from 'components/Table';
import React, {
  MouseEvent,
  ReactElement,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import uPlot, { AlignedData } from 'uplot';

import CompactTooltipContainer from './Tooltip/CompactTooltipContainer';
import CompactTooltipText from './Tooltip/CompactTooltipText';
import { ScrollView, SeriesIcon } from './components';
import { UPlotConfig } from '../types';
import {
  getCursorValue,
  getCursorTimestamp,
  getLabelColor,
  getLabelFromSeries,
  positionTooltipCompact,
  tooltipCursorCompact,
  tooltipFormatter,
} from '../utils';

const columns = [
  { key: 'label', label: 'Metric' },
  { key: 'avg', label: 'Avg' },
  { key: 'min', label: 'Min' },
  { key: 'max', label: 'Max' },
  { key: 'sum', label: 'Sum' },
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
          <SeriesIcon backgroundColor={row.color} />
          {row.label.length > 125 ? row.label.slice(0, 125) + '...' : row.label}
        </span>
      </th>
      <th className="table__cell table__cell--body">{row.avg}</th>
      <th className="table__cell table__cell--body">{row.min}</th>
      <th className="table__cell table__cell--body">{row.max}</th>
      <th className="table__cell table__cell--body">{row.sum}</th>
      <th className="table__cell table__cell--body">{rowValue}</th>
    </tr>
  );
};

const AggregateLegends = ({
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
  unit: string;
}): ReactElement => {
  const [focusedPointIdx, setFocusedPointIdx] = useState<number>(0);
  const [focusedSeriesIdx, setFocusedSeriesIdx] = useState<number>(0);
  const [coords, setCoords] = useState(null);

  const aggregateData: any = useMemo(() => {
    if (config && config.series) {
      const newAggregateData = [];
      for (let i = 1; i < data.length; i++) {
        const row: Array<any> = data[i];
        const rowNum = row.map((val) => (val ? Number(val) : 0));
        const sm = rowNum.reduce((a, b) => a + b, 0);
        newAggregateData.push({
          avg: tooltipFormatter(sm / rowNum.length, unit),
          max: tooltipFormatter(Math.max(...rowNum), unit),
          min: tooltipFormatter(Math.min(...rowNum), unit),
          sum: tooltipFormatter(sm, unit),
          label: config.series[i].label,
          color: config.series[i].stroke || config.series[i].fill,
          show: config.series[i].show,
        });
      }
      return newAggregateData;
    }
    return [];
  }, [config]);

  useLayoutEffect(() => {
    config.addHook('setLegend', (u: uPlot) => {
      if (u.cursor.idx && u.cursor.idx !== focusedPointIdx) {
        setFocusedPointIdx(u.cursor.idx);

        if (u.cursor.idx) {
          const value = data[focusedSeriesIdx || 0][u.cursor.idx];
          const posX = u.valToPos(value, 'x');
          const posY = config.height / 2;

          const newCoords = positionTooltipCompact(
            { cursorLeft: posX, cursorTop: posY },
            { width: config.width, height: config.height },
          );

          setCoords(newCoords);
        }
      }
    });
  }, [config]);

  const renderTooltip = (): ReactElement => {
    const tooltipCursor = tooltipCursorCompact(
      coords,
      config.height,
      config.width,
    );

    const value = getCursorValue(data, focusedSeriesIdx, focusedPointIdx);

    return (
      <CompactTooltipContainer coords={tooltipCursor}>
        <CompactTooltipText
          color={getLabelColor(config.series, focusedSeriesIdx) as string}
          label={getLabelFromSeries(config.series, focusedSeriesIdx)}
          position={tooltipCursor?.position}
          value={tooltipFormatter(value, unit)}
          timestamp={getCursorTimestamp(data, focusedPointIdx)}
        />
      </CompactTooltipContainer>
    );
  };

  return (
    <div
      onMouseLeave={() => {
        onFocusSeries(null);
        setFocusedSeriesIdx(null);
      }}
    >
      <ScrollView
        height={'auto'}
        width={config.width - 16}
        scrollIndicator={false}
      >
        <Table
          className="uplot__aggregate-legends__table"
          columns={columns}
          rows={aggregateData}
          renderRow={({ row, rowIndex }) => {
            const rowValue = data[rowIndex + 1][focusedPointIdx];
            return (
              <LegendsRow
                key={rowIndex}
                onFocusSeries={() => setFocusedSeriesIdx(rowIndex + 1)}
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
      {focusedSeriesIdx && focusedPointIdx && coords && renderTooltip()}
    </div>
  );
};

export default AggregateLegends;
