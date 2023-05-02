import React, { ReactElement } from 'react';
import { colorScale } from './constants';

const TopologyLegend = (): ReactElement => {
  return (
    <div className="topology__legend">
      <div className="topology__legend__title"># of Changes</div>
      <div className="topology__legend__colors">
        {colorScale.map((color, i) => (
          <div className="topology__legend__color" key={color}>
            <div
              className="topology__legend__color__dot"
              style={{ backgroundColor: color }}
            />
            <div className="topology__legend__color__label">
              {i === colorScale.length - 1 ? `${i}+` : i}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopologyLegend;
