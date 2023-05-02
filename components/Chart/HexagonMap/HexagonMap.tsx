import * as d3 from 'd3';
import { hexbin } from 'd3-hexbin';
import React, { ReactElement, useLayoutEffect, useRef, useState } from 'react';

import { CompactTooltipContainer, CompactTooltipText } from '../lib/Tooltip';
import { HostmapDataProps } from './types';
import {
  calculateHostmapLabelSize,
  calculateHostmapRadius,
  calculateHostmapPoints,
  getHexagonColAndRow,
} from './utils';

const HexagonMapTooltip = ({
  data,
  left,
  top,
}: {
  data: HostmapDataProps;
  left: number;
  top: number;
}) => {
  const polyData = data;
  const coords = { x: left + 32, y: top + 32, position: 'left' };

  return (
    <CompactTooltipContainer coords={coords}>
      <CompactTooltipText
        color={polyData.color as string}
        label={polyData.label}
        position={coords.position}
        value={polyData.value}
        timestamp={polyData.timestamp}
      />
    </CompactTooltipContainer>
  );
};

const HexagonMap = ({
  data,
  height,
  hostmapType = 'hexagon',
  width,
}: {
  data: HostmapDataProps[];
  height: number;
  hostmapType?: 'hexagon' | 'circle' | 'square';
  width: number;
}): ReactElement => {
  const hexagonMapRef = useRef(null);
  const [tooltipData, setTooltipData] = useState({
    data: null,
    left: 0,
    top: 0,
  });

  const drawHexagon = (
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    points: [number, number][],
    hexRadius: number,
  ) => {
    const d3hexbin = hexbin().radius(hexRadius);
    const strokeWidth = hexRadius / 6;

    svg
      .append('g')
      .selectAll('.hostmap-hexagon')
      .data(d3hexbin(points))
      .enter()
      .append('path')
      .attr('class', 'hostmap-hexagon')
      .attr('d', function (d) {
        return 'M' + d.x + ',' + d.y + d3hexbin.hexagon();
      })
      .style('fill', function (d) {
        if (d.length > 0) {
          return d[0][2]?.color || '#69a2a2';
        }
        return '#69a2a2';
      })
      .on('mouseover', function (d: MouseEvent) {
        d3.select(this).style('stroke-width', `${strokeWidth}px`);

        const hostData = d.target.__data__[0];
        handleTooltipSet(hostData[2], d.offsetX, d.offsetY);
      })
      .on('mouseleave', function (d) {
        d3.select(this).style('stroke-width', '1px');
        d3.select(this).attr('class', 'hostmap-hexagon hostmap__stroke');
        setTooltipData({ data: null, left: 0, top: 0 });
      })
      .on('mousemove', function (d: MouseEvent) {
        d3.select(this).style('stroke-width', `${strokeWidth}px`);

        const hostData = d.target.__data__[0];
        handleTooltipSet(hostData[2], d.offsetX, d.offsetY);
      });
  };

  const drawCircle = (
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    points: [number, number][],
    hexRadius: number,
  ) => {
    const strokeWidth = hexRadius / 6;
    svg
      .append('g')
      .selectAll('circle')
      .data(points)
      .enter()
      .append('circle')
      .attr('class', 'hostmap-circle')
      .attr('cx', (d) => d[0])
      .attr('cy', (d) => d[1])
      .attr('r', hexRadius * 0.85)
      .style('fill', (d) => d[2].color || '#69a2a2')
      .on('mouseover', function (d: MouseEvent) {
        d3.select(this).style('stroke-width', `${strokeWidth}px`);

        const hostData = d.target.__data__[2];
        handleTooltipSet(hostData, d.offsetX, d.offsetY);
      })
      .on('mouseleave', function (d) {
        d3.select(this).style('stroke-width', '1px');
        setTooltipData({ data: null, left: 0, top: 0 });
      })
      .on('mousemove', function (d: MouseEvent) {
        d3.select(this).style('stroke-width', `${strokeWidth}px`);

        const hostData = d.target.__data__[2];
        handleTooltipSet(hostData, d.offsetX, d.offsetY);
      });
  };

  const drawSquare = (
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    points: [number, number][],
    hexRadius: number,
  ) => {
    const strokeWidth = hexRadius / 6;
    svg
      .append('g')
      .selectAll('rect')
      .data(points)
      .enter()
      .append('rect')
      .attr('class', 'hostmap-square')
      .attr('x', (d) => d[0] - hexRadius * 0.65)
      .attr('y', (d) => d[1] - hexRadius * 0.65)
      .attr('width', hexRadius * 1.3)
      .attr('height', hexRadius * 1.3)
      .style('fill', (d) => d[2].color || '#69a2a2')
      .on('mouseover', function (d: MouseEvent) {
        d3.select(this).style('stroke-width', `${strokeWidth}px`);

        const hostData = d.target.__data__[2];
        handleTooltipSet(hostData, d.offsetX, d.offsetY);
      })
      .on('mouseleave', function (d) {
        d3.select(this).style('stroke-width', '1px');
        setTooltipData({ data: null, left: 0, top: 0 });
      })
      .on('mousemove', function (d: MouseEvent) {
        d3.select(this).style('stroke-width', `${strokeWidth}px`);

        const hostData = d.target.__data__[2];
        handleTooltipSet(hostData, d.offsetX, d.offsetY);
      });
  };

  const draw = () => {
    const margin = { top: 0, right: 0, bottom: 0, left: 0 };
    const hexCount = data.length;
    const { cols, rows } = getHexagonColAndRow(hexCount, height);
    const hexRadius = calculateHostmapRadius(cols, rows, width, height);
    const points = calculateHostmapPoints(data, hexRadius, cols, rows);

    const svgWidth = cols * hexRadius * Math.sqrt(3);
    const svgHeight = rows * 1.5 * hexRadius + 0.5 * hexRadius;
    const translateX = (width - svgWidth) / 2;
    const translateY = hexRadius + (height - svgHeight) / 2;

    const svg = d3
      .select(hexagonMapRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr(
        'transform',
        `translate(${translateX + hexRadius / 2}, ${translateY})`,
      );

    if (hostmapType === 'hexagon') {
      drawHexagon(svg, points, hexRadius);
    } else if (hostmapType === 'circle') {
      drawCircle(svg, points, hexRadius);
    } else if (hostmapType === 'square') {
      drawSquare(svg, points, hexRadius);
    }

    // add label
    const labelSize = calculateHostmapLabelSize(hexRadius);
    if (labelSize) {
      svg
        .append('g')
        .selectAll('labels')
        .data(points)
        .enter()
        .append('text')
        .attr('x', (d) => d[0])
        .attr('y', (d) => d[1])
        .text((d) => d[2].value)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('font-size', `${labelSize}px`)
        .attr('fill', 'white');
    }
  };

  const clear = () => {
    d3.select(hexagonMapRef.current).selectAll('svg').remove();
  };

  const handleTooltipSet = (data: any, left: number, top: number) => {
    if (tooltipData.left === left && tooltipData.top === top) return;
    setTooltipData({ data, left, top });
  };

  useLayoutEffect(() => {
    if (!data || data.length === 0) return;

    draw();
    return () => {
      clear();
    };
  }, [data, width, height]);

  return (
    <>
      <div className="hexagon-map" ref={hexagonMapRef}></div>
      {tooltipData.data && <HexagonMapTooltip {...tooltipData} />}
    </>
  );
};

export default HexagonMap;
