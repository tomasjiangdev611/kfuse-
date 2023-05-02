import { Graph } from 'react-d3-graph';
import React from 'react';

const D3Graph = ({ config, data, id, height, width, ...rest }) => {
  return (
    <Graph
      config={{ ...config, height, width }}
      data={data}
      id={id}
      {...rest}
    />
  );
};

export default D3Graph;
