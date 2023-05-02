import React, { MouseEvent, ReactElement } from 'react';

import { ScrollView, SeriesIcon } from './components';
import { UPlotConfig } from '../types';

const LegendsCompact = ({
  config,
  onItemClick,
  legendHeight,
}: {
  config: UPlotConfig;
  onItemClick: (e: MouseEvent<HTMLLIElement>, idx: number) => void;
  legendHeight?: number;
}): ReactElement => {
  return (
    <ScrollView
      height={'auto'}
      maxHeight={legendHeight}
      width={config.width - 16}
      scrollIndicator={false}
    >
      <div className="uplot__legends__compact">
        {config?.series.map((s, idx) => {
          if (!s.label) {
            return null;
          }
          return (
            <div
              style={{ opacity: s.show ? 1 : 0.5 }}
              className="uplot__legends__compact__listitem"
              key={idx}
              onClick={(e) => onItemClick(e, idx)}
            >
              <SeriesIcon backgroundColor={s.stroke || s.fill} />
              {s.label}
            </div>
          );
        })}
      </div>
    </ScrollView>
  );
};

export default LegendsCompact;
