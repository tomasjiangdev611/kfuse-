import classNames from 'classnames';
import { dateTimeFormat } from 'constants/dateTimeFormat';
import dayjs from 'dayjs';
import React, { ReactElement } from 'react';
import { Series } from 'uplot';

import SeriesIcon from './SeriesIcon';
import { tooltipFormatter } from '../../utils';

type SeriesProps = {
  color: Series.Stroke;
  isActive?: boolean;
  label: string;
  value: string;
};

const SeriesRow = ({ color, isActive, label, value }: SeriesProps) => {
  return (
    <div
      className={classNames({
        uplot__seriestable__row: true,
        'uplot__seriestable__row--active': isActive,
      })}
    >
      {color && (
        <div className="uplot__seriestable__row__cell">
          <SeriesIcon backgroundColor={color} />
        </div>
      )}
      {label && (
        <div className="uplot__seriestable__row__cell uplot__seriestable__row__cell--label">
          {label}
        </div>
      )}
      {value && (
        <div className="uplot__seriestable__row__cell uplot__seriestable__row__cell--value">
          {value}
        </div>
      )}
    </div>
  );
};

const SeriesTable = ({
  timestamp,
  series,
  unit,
}: {
  timestamp: number;
  series: SeriesProps[];
  unit?: string;
}): ReactElement => {
  return (
    <div className="uplot__seriestable">
      {timestamp && (
        <div aria-label="Timestamp">
          {dayjs.unix(timestamp).format(dateTimeFormat)}
        </div>
      )}
      {series.map((row, i) => (
        <SeriesRow {...row} key={i} value={tooltipFormatter(row.value, unit)} />
      ))}
    </div>
  );
};

export default SeriesTable;
