import React, { ReactElement, useEffect, useRef } from 'react';
import Sunburst from 'sunburst-chart';
import { SunburstDataProps } from 'types';

import { getParentData } from './utils';

const SunburstGraph = ({
  data,
  height,
  width,
}: {
  data: SunburstDataProps;
  height: number;
  width: number;
}): ReactElement => {
  const sunburstRef = useRef<HTMLDivElement>(null);

  function create() {
    Sunburst()
      .data(data)
      .size('size')
      .height(height)
      .width(width)
      .color('color')
      .radiusScaleExponent(1.5)
      .tooltipTitle(() => '')
      .tooltipContent((node) => {
        const tooltipData = getParentData(node);
        const lastData = tooltipData[tooltipData.length - 1];

        const renderTooltipItem = () => {
          let tooltipHtml = '';
          tooltipData.map((d, i) => {
            tooltipHtml += `
              <div class="sunburst__tooltip__item" >
                <div class="sunburst__tooltip__item__name">${d.name}</div>
              </div>
            `;
          });

          return tooltipHtml;
        };

        return `
          <div class="sunburst__tooltip">
            ${renderTooltipItem()}
            <div class="sunburst__tooltip__value">
              <div class="sunburst__tooltip__row__size">${lastData.size}</div>
            </div>
          </div>
        `;
      })(sunburstRef.current);
  }

  useEffect(() => {
    if (sunburstRef.current) {
      sunburstRef.current.innerHTML = '';
    }
    create();
  }, [data, height, width]);

  return <div className="sunburst" ref={sunburstRef}></div>;
};

export default SunburstGraph;
