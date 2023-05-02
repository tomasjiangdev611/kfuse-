import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import colors from 'constants/colors';

type Props = {
  total: number;
};

const D3ProgressBar = ({ total }: Props) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Define the dimensions of the progress bar
    const width = 50;
    const height = 20;
    const yHeight = 15;
    const margin = { top: 10, right: 10, bottom: 3, left: 5 };
    const progressColor = total > 75 ? 'red' : total > 40 ? 'orange' : 'green';

    // Create the background rectangle
    svg
      .append('rect')
      .attr('x', margin.left)
      .attr('y', yHeight)
      .attr('rx', 2)
      .attr('ry', 2)
      .attr('width', width)
      .attr('height', height - margin.top - margin.bottom)
      .style('fill', colors.gray);

    // Create the progress bar rectangle
    svg
      .append('rect')
      .attr('x', margin.left)
      .attr('y', yHeight)
      .attr('rx', 2)
      .attr('ry', 2)
      .attr('width', total / 2)
      .attr('height', height - margin.top - margin.bottom)
      .style('fill', progressColor);

    // Create the percent text
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height - margin.right)
      .attr('text-anchor', 'middle')
      .style('fill', 'black')
      .text(`${Math.round(total)}%`);
  }, [total]);

  return <svg ref={svgRef} width="60" height="24" />;
};

export default D3ProgressBar;
