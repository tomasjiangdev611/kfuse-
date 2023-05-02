import * as d3 from 'd3';
import { useLayoutEffect } from 'react';

const D3Line = ({ data, element, height, width }): null => {
  useLayoutEffect(() => {
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const x = d3
      .scaleUtc()
      .domain(d3.extent(data, (d) => new Date(d.date)))
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line()
      .defined((d) => !isNaN(d.value))
      .x((d) => x(new Date(d.date)))
      .y((d) => y(d.value));

    const xAxis = (g) =>
      g.attr('transform', `translate(0,${height - margin.bottom})`).call(
        d3
          .axisBottom(x)
          .ticks(width / 80) // default tick speration width from d3 example
          .tickSizeOuter(0),
      );

    const yAxis = (g) =>
      g
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call((g) => g.select('.domain').remove())
        .call((g) =>
          g
            .select('.tick:last-of-type text')
            .clone()
            .attr('x', 3)
            .attr('text-anchor', 'start')
            .attr('font-weight', 'bold'),
        );

    const svg = d3
      .select(element)
      .append('svg')
      .attr('viewBox', [0, 0, width, height]);
    svg.append('g').call(xAxis);
    svg.append('g').call(yAxis);
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', line);

    return () => {
      svg.remove();
    };
  }, []);

  return null;
};

export default D3Line;
