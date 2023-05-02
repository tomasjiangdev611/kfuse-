import * as d3 from 'd3';
import React, { ReactElement, useEffect, useRef } from 'react';

const PIE_OFFSET = 0.3;
const PIE_MAIN = 0.7;
const CIRCLE_FULL = Math.PI * 2;
const PIE_OFFSET_ANGLE = CIRCLE_FULL * PIE_OFFSET;

const GaugeGraph = ({
  height,
  label,
  max,
  threshold,
  stat,
  width,
}: {
  height: number;
  label: string;
  max: number;
  threshold: number;
  stat: { prefix: string; value: number; suffix: string; textColor: string };
  width: number;
}): ReactElement => {
  const gaugeRef = useRef(null);

  const create = () => {
    const { prefix, value, suffix, textColor } = stat;
    const radius = Math.min(width, height) / 2;
    const svg = d3
      .select(gaugeRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2}) rotate(125)`);

    const num = parseFloat(threshold / max).toFixed(4);
    const green = Number(num) > 1 ? 0.8 * PIE_MAIN : Number(num) * PIE_MAIN;
    const statusLine = [
      {
        color: 'none',
        startAngle: 0,
        endAngle: PIE_OFFSET_ANGLE,
      },
      {
        color: '#0e9f6e', // green
        startAngle: PIE_OFFSET_ANGLE,
        endAngle: CIRCLE_FULL * green + PIE_OFFSET_ANGLE,
      },
      {
        color: '#da545b', // red
        startAngle: CIRCLE_FULL * green + PIE_OFFSET_ANGLE,
        endAngle: CIRCLE_FULL,
      },
    ];

    const arc = d3
      .arc()
      .innerRadius(radius - 10)
      .outerRadius(radius - 8)
      .startAngle((d) => d.startAngle)
      .endAngle((d) => d.endAngle);

    svg
      .selectAll('path')
      .data(statusLine)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => d.color);

    const PIE_OUTER_RADIUS = 12 + radius * 0.15;
    const arc2 = d3
      .arc()
      .innerRadius(radius - 12)
      .outerRadius(radius - PIE_OUTER_RADIUS)
      .startAngle(PIE_OFFSET_ANGLE)
      .endAngle(
        CIRCLE_FULL * (Number(value) / Math.max(max, threshold)) * PIE_MAIN +
          PIE_OFFSET_ANGLE,
      );

    svg.append('path').attr('d', arc2).attr('fill', textColor);

    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', `${radius * 0.25}px`)
      .attr('y', 30)
      .attr('fill', textColor)
      .text(`${prefix || ''}${value}${suffix || ''}`)
      .attr('transform', 'rotate(235)');

    if (label) {
      if (label.length > radius / 6) {
        label = label.slice(0, radius / 6) + '...';
      }
      svg
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', `${radius * 0.15}px`)
        .attr('y', radius * 0.7)
        .attr('class', 'gauge__label')
        .text(label)
        .attr('transform', 'rotate(235)');
    }
  };

  const clear = () => {
    d3.select(gaugeRef.current).selectAll('svg').remove();
  };

  useEffect(() => {
    create();

    return () => {
      clear();
    };
  }, [height, width, stat]);

  return <div ref={gaugeRef}></div>;
};

export default GaugeGraph;
