import * as d3 from 'd3';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { convertNumberToReadableUnit } from 'utils/formatNumber';

import { ChartRenderProps } from '../types';
import {
  bucketizeData,
  convertArrayToMinMaxArray,
  convertTimeForHeatmap,
  findMaxValueInMatrix,
  splitNumber,
} from './utils';

const HeatmapTooltip = ({ buckets, data, left, top }: any) => {
  const bucketIndex = buckets.indexOf(data.bucket);
  const bucket = bucketIndex > 0 ? buckets[bucketIndex - 1] : '0';
  return (
    <div
      className="heatmap__tooltip"
      style={{ left: left + 32, top: top + 32 }}
    >
      <div className="heatmap__tooltip__item">
        <div className="heatmap__tooltip__item__name">{data.count} series</div>
      </div>
      <div className="heatmap__tooltip__value">
        <div>
          {bucket} to {data.bucket}
        </div>
      </div>
    </div>
  );
};

const Heatmap = ({
  chartWidth,
  chartHeight,
  grafanaData,
  ...rest
}: ChartRenderProps): ReactElement => {
  const heatmapRef = useRef(null);
  const [tooltipData, setTooltipData] = useState({
    buckets: [],
    data: null,
    left: 0,
    top: 0,
  });

  const create = () => {
    const { data, series } = grafanaData;
    const margin = { top: 0, right: 0, bottom: 40, left: 60 };
    const width = chartWidth - margin.left - margin.right;
    const height = chartHeight - margin.top - margin.bottom;

    const svg = d3
      .select(heatmapRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const dataWithoutFirstRow = data.slice(1);
    const maxData = findMaxValueInMatrix(dataWithoutFirstRow);
    const yData = splitNumber(10, maxData);

    const xData = data[0].map((d) => d.toString());
    const minMaxBucket = convertArrayToMinMaxArray(yData);
    const { bucketData, maxCount } = bucketizeData(
      dataWithoutFirstRow,
      minMaxBucket,
      xData,
    );
    const readableTime = convertTimeForHeatmap(data[0]);

    const x = d3.scaleBand().domain(xData).range([0, width]).padding(0.05);
    const y = d3.scaleBand().domain(yData).range([height, 0]).padding(0.05);

    svg
      .append('g')
      .style('font-size', 14)
      .style('padding-top', 8)
      .attr('transform', `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .tickSize(0)
          .tickFormat((d) => {
            const index = xData.indexOf(d);
            return readableTime[index];
          }),
      )
      .select('.domain')
      .remove();

    // draw horizontal 1px lines for y axis
    svg
      .selectAll()
      .data(yData)
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', (d) => y(d) + y.bandwidth())
      .attr('y2', (d) => y(d) + y.bandwidth())
      .attr('stroke', '#e0e0e0');

    svg
      .append('g')
      .style('font-size', 14)
      .call(
        d3
          .axisLeft(y)
          .tickSize(0)
          .tickFormat((d) => convertNumberToReadableUnit(Number(d), 2)),
      )
      .select('.domain')
      .remove();

    const myColor = d3
      .scaleSequential()
      .interpolator(d3.interpolateRgb('indigo', '#EE4B2B'))
      .domain([1, maxCount]);

    svg
      .selectAll()
      .data(bucketData, (d) => d.time + ':' + d.bucket)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.time))
      .attr('y', (d) => y(d.bucket))
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .style('fill', (d) => myColor(d.count))
      .style('stroke-width', 2)
      .style('stroke', 'none')
      .style('opacity', 1)
      .on('mouseover', function (d) {
        d3.select(this).style('stroke', '#3d8bc9');
        handleTooltipSet(yData, d.target.__data__, d.offsetX, d.offsetY);
      })
      .on('mouseleave', function (d) {
        d3.select(this).style('stroke', 'none');
        setTooltipData({ buckets: null, data: null, left: 0, top: 0 });
      })
      .on('mousemove', function (d) {
        d3.select(this).style('stroke', '#3d8bc9');
        handleTooltipSet(yData, d.target.__data__, d.offsetX, d.offsetY);
      });
  };

  const handleTooltipSet = (
    buckets: string[],
    data: any,
    left: number,
    top: number,
  ) => {
    if (tooltipData.left === left && tooltipData.top === top) return;
    setTooltipData({ buckets, data, left, top });
  };

  useEffect(() => {
    if (grafanaData?.data.length > 1) {
      if (heatmapRef.current) {
        d3.select(heatmapRef.current).selectAll('svg').remove();
      }
      create();
    }
  }, [grafanaData, chartHeight, chartWidth]);

  return (
    <div>
      <div className="heatmap" ref={heatmapRef}></div>
      {tooltipData.data && <HeatmapTooltip {...tooltipData} />}
    </div>
  );
};

export default Heatmap;
