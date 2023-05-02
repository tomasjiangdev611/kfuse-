import React, { ReactElement, useEffect, useRef } from 'react';
import Treemap from 'treemap-chart';
import { SunburstDataProps } from 'types';

const TreemapGraph = ({
  data,
  height,
  width,
}: {
  data: SunburstDataProps;
  height?: number;
  width?: number;
}): ReactElement => {
  const treemapRef = useRef<HTMLDivElement>(null);

  function create() {
    Treemap()
      .data(data)
      .size('size')
      .height(height || 400)
      .width(width || 400)
      .color('color')
      .tooltipTitle(() => '')(treemapRef.current);
  }

  useEffect(() => {
    if (treemapRef.current) {
      treemapRef.current.innerHTML = '';
    }
    create();
  }, [data, height, width]);

  return <div className="treemap" ref={treemapRef}></div>;
};

export default TreemapGraph;
