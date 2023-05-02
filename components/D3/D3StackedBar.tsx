import * as d3 from 'd3';
import { useLayoutEffect } from 'react';

const D3StackedBar = ({ data, element, width, height }) => {
  useLayoutEffect(() => {
    const formatValue = (x) => (isNaN(x) ? 'N/A' : x.toLocaleString('en'));
    const margin = { top: 10, right: 10, bottom: 20, left: 40 };

    const series = d3
      .stack()
      .keys(data.columns)(data.buckets)
      .map((d) => (d.forEach((v) => (v.key = d.key)), d));

    const x = d3
      .scaleBand()
      .domain(data.buckets.map((d) => d.unixTimestamp))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1]))])
      .rangeRound([height - margin.bottom, margin.top]);

    const color = d3
      .scaleOrdinal()
      .domain(series.map((d) => d.key))
      .range(d3.schemeSpectral[Math.max(series.length, 3)])
      .unknown('#ccc');

    const xAxis = (g) =>
      g
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .call((g) => g.selectAll('.domain').remove());

    const yAxis = (g) =>
      g
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(null, 's'))
        .call((g) => g.selectAll('.domain').remove());

    const svg = d3.select(element).attr('viewBox', [0, 0, width, height]);

    svg
      .append('g')
      .selectAll('g')
      .data(series)
      .join('g')
      .attr('fill', (d) => color(d.key))
      .selectAll('rect')
      .data((d) => d)
      .join('rect')
      .attr('x', (d, i) => x(d.data.unixTimestamp))
      .attr('y', (d) => y(d[1]))
      .attr('height', (d) => y(d[0]) - y(d[1]))
      .attr('width', x.bandwidth())
      .append('title')
      .text(
        (d) => `${d.data.unixTimestamp} ${d.key}
        ${formatValue(d.data[d.key])}`,
      );

    svg.append('g').call(xAxis);

    svg.append('g').call(yAxis);

    return () => {
      svg.remove();
    };
  }, [data, element, width, height]);

  return null;
};

export default D3StackedBar;
