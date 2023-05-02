import React from 'react';
import { DateSelection } from 'types';
import ChartGridItem from './ChartGridItem';
import { Chart } from './types';

type Props = {
  date: DateSelection;
  rows: Chart[][];
};

const ChartGrid = ({ date, rows }: Props) => {
  return (
    <div className="chart-grid">
      {rows.map((row, i) => (
        <div className="chart-grid__row" key={i}>
          {row.map((chart, j) => (
            <div className="chart-grid__row__item" key={j}>
              {chart.render ? (
                chart.render()
              ) : (
                <ChartGridItem chart={chart} date={date} />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ChartGrid;
