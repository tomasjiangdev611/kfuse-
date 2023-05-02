import React from 'react';
import D3FlameGraph from './D3FlameGraph';
import D3Graph from './D3Graph';
import D3Hexbin from './D3Hexbin';
import D3Line from './D3Line';
import D3StackedBar from './D3StackedBar';
import { D3ChartTypes } from './types';

const D3Chart = ({ type, ...rest }) => {
  switch (type) {
    case D3ChartTypes.FlameGraph:
      return <D3FlameGraph {...rest} />;
    case D3ChartTypes.Graph:
      return <D3Graph {...rest} />;
    case D3ChartTypes.Hexbin:
      return <D3Hexbin {...rest} />;
    case D3ChartTypes.Line:
      return <D3Line {...rest} />;
    case D3ChartTypes.StackedBar:
      return <D3StackedBar {...rest} />;
    default:
      return null;
  }
};

export default D3Chart;
