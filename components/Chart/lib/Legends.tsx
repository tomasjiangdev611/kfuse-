import React, { MouseEvent, ReactElement } from 'react';

import { ScrollView, SeriesIcon } from './components';
import { UPlotConfig } from '../types';

const Legends = ({
  config,
  onItemClick,
}: {
  config: UPlotConfig;
  onItemClick: (e: MouseEvent<HTMLLIElement>, idx: number) => void;
}): ReactElement => {
  return (
    <ScrollView
      height={'auto'}
      width={config.width - 16}
      scrollIndicator={false}
    >
      <ul>
        {config?.series.map((s, idx) => {
          if (!s.label) {
            return null;
          }
          return (
            <li
              style={{ opacity: s.show ? 1 : 0.5 }}
              className="uplot__legend__listitem"
              key={idx}
              onClick={(e) => onItemClick(e, idx)}
            >
              <SeriesIcon backgroundColor={s.stroke || s.fill} />
              {s.label}
            </li>
          );
        })}
      </ul>
    </ScrollView>
  );
};

export default Legends;
