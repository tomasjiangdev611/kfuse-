import * as d3 from 'd3';
import { hexbin } from 'd3-hexbin';
import { useLayoutEffect } from 'react';

const D3Hexbin = ({
  activeIndex,
  colors,
  data,
  element,
  onClick,
  height,
  width,
}) => {
  const clear = () => {
    d3.select(element).selectAll('svg').remove();
  };

  const draw = () => {
    const margin = {
      top: 10,
      right: 30,
      bottom: 20,
      left: 10,
    };

    const hexCount = data.length;

    const chartHeight = height - 60 - 18 - margin.top - margin.bottom;
    const chartWidth = width - margin.left - margin.right;

    const columns = Math.round(
      Math.sqrt((chartWidth / chartHeight) * hexCount),
    );
    const rows = Math.ceil(hexCount / columns);

    const hexRadius = d3.min([
      chartWidth / ((columns + 0.5) * Math.sqrt(3)),
      chartHeight / ((rows + 1 / 3) * 1.5),
    ]);

    const svgWidth = columns * hexRadius * Math.sqrt(3);
    const svgHeight = rows * 1.5 * hexRadius + 0.5 * hexRadius;

    const d3hexbin = hexbin().radius(hexRadius);

    const points = [];

    for (let i = 0; i < rows; i += 1) {
      for (let j = 0; j < columns; j += 1) {
        if (points.length < hexCount) {
          points.push([hexRadius * j * 1.75, hexRadius * i * 1.5]);
        }
      }
    }

    const translateX = hexRadius / 2 + (width - svgWidth) / 2;
    const translateY = hexRadius + (height - 60 - 18 - svgHeight) / 2 + 18;

    let activeHexagon = null;

    const svg = d3
      .select(element)
      .append('svg')
      .attr('width', `${width}px`)
      .attr('height', `${height - 60}px`)
      .append('g')
      .attr('transform', `translate(${translateX}, ${translateY})`);

    svg
      .append('g')
      .selectAll('workspace-component-workflow__hexagon')
      .data(d3hexbin(points))
      .enter()
      .append('path')
      .attr('id', (d, i) => {
        return i;
      })
      .attr('d', (d, i) => {
        if (i === activeIndex) {
          activeHexagon = d;
        }

        return `M${d.x}, ${d.y}, ${d3hexbin.hexagon()}`;
      })
      .attr('stroke', (d, i) => '#a6a5c1')
      .attr('stroke-width', '2px')
      .style('fill', (d, i) => colors[i] || '#d5e0ed')
      .on('click', (d, i) => {
        onClick(i);
      });

    if (activeHexagon) {
      svg
        .append('g')
        .append('path')
        .attr(
          'd',
          `M${activeHexagon.x}, ${activeHexagon.y}, ${d3hexbin.hexagon()}`,
        )
        .attr('stroke', (d, i) => '#000000')
        .attr('stroke-width', '2px')
        .style('fill-opacity', 0);
    }
  };

  useLayoutEffect(() => {
    draw();

    return () => {
      clear();
    };
  }, [colors, data, height, width]);

  return null;
};

export default D3Hexbin;
