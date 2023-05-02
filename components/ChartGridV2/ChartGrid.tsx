import React from 'react';
import { ChartGridItemType, DateSelection } from 'types';
import ChartGridItem from './ChartGridItem';

type Props = {
  date: DateSelection;
  rows: ChartGridItemType[][];
};

const ChartGrid = ({ date, rows }: Props) => {
  return (
    <div className="chart-grid">
      {rows.map((row, i) => (
        <div className="chart-grid__row" key={i}>
          {row.map((chartGridItem, j) => (
            <div className="chart-grid__row__item" key={j}>
              <ChartGridItem chartGridItem={chartGridItem} date={date} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ChartGrid;
