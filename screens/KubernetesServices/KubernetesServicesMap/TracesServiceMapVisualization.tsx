import * as d3Base from 'd3';
import * as d3Dag from 'd3-dag';
import React, { MutableRefObject, useMemo, useState } from 'react';
import { DateSelection, SelectedFacetValuesByName } from 'types';
import { Group } from '@visx/group';
import { MarkerArrow } from '@visx/marker';
import TracesServiceMapLink from './TracesServiceMapLink';
import TracesServiceMapLinkTooltip from './TracesServiceMapLinkTooltip';
import TracesServiceMapNode from './TracesServiceMapNode';
import { ServiceMapType } from './types';

const getDagLayout = ({
  activeServiceMapType,
  requestsByServiceName,
  height,
  width,
}) => {
  const d3 = Object.assign({}, d3Base, d3Dag);
  switch (activeServiceMapType) {
    case ServiceMapType.cluster:
      return d3
        .sugiyama()
        .size([width, height])
        .decross(d3.decrossDfs())
        .coord(d3.coordCenter())
        .nodeSize((node: any) => {
          const id = node?.data?.id;
          if (id && requestsByServiceName[id]) {
            const size = Math.max(20, requestsByServiceName[id]);
            return [size, size];
          }

          return [20, 20];
        });
    case ServiceMapType.flow:
      return d3
        .sugiyama()
        .size([width, height])
        .decross(d3.decrossTwoLayer())
        .coord(d3.coordGreedy())
        .nodeSize(() => {
          return [220, 20];
        });
    case ServiceMapType.mini:
      return d3
        .sugiyama()
        .size([width, height])
        .decross(d3.decrossTwoLayer())
        .coord(d3.coordGreedy())
        .nodeSize(() => {
          return [50, 50];
        });
  }
};

type Args = {
  activeServiceMapType: ServiceMapType;
  data: ServiceMapData;
  requestsByServiceName: { [key: string]: number };
  height: number;
  width: number;
};

const getDag = ({
  activeServiceMapType,
  data,
  requestsByServiceName,
  width,
  height,
}: Args) => {
  const d = d3Dag.dagStratify().decycle(true)(data);
  const layout = getDagLayout({
    activeServiceMapType,
    requestsByServiceName,
    width,
    height,
  });

  layout(d);
  return d;
};

type ServiceMapData = { id: string; parentIds?: string[] }[];

type Props = {
  activeServiceMapType: ServiceMapType;
  colorsByServiceName: { [key: string]: string };
  containerRef: MutableRefObject<HTMLDivElement>;
  data: ServiceMapData;
  date: DateSelection;
  requestsByServiceName: { [key: string]: number };
  selectedFacetValuesByName: SelectedFacetValuesByName;
  spanTypeByServiceName: { [key: string]: string };
  height: number;
  width: number;
};

const TracesServiceMapVisualization = ({
  activeServiceMapType,
  colorsByServiceName,
  containerRef,
  data,
  date,
  requestsByServiceName,
  selectedFacetValuesByName,
  spanTypeByServiceName,
  height,
  width,
}: Props) => {
  const [hoveredNodeIndex, setHoveredNodeIndex] = useState(null);
  const hoveredLinkState = useState(null);

  const dag = useMemo(
    () =>
      getDag({
        activeServiceMapType,
        data,
        height,
        requestsByServiceName,
        width,
      }),
    [activeServiceMapType, data, height, requestsByServiceName, width],
  );

  const descendants = dag.descendants();

  const nodes = descendants.filter((d, i) => i !== hoveredNodeIndex);

  const hoveredNode =
    hoveredNodeIndex !== null ? descendants[hoveredNodeIndex] : null;

  return (
    <>
      <svg width={width} height={height}>
        <MarkerArrow id="marker-arrow" fill="#333" refX={2} size={1} />
        <Group top={0} left={0}>
          <>
            {dag.links().map((link, i) => (
              <TracesServiceMapLink
                activeServiceMapType={activeServiceMapType}
                containerRef={containerRef}
                date={date}
                hoveredLinkState={hoveredLinkState}
                key={i}
                link={link}
                selectedFacetValuesByName={selectedFacetValuesByName}
              />
            ))}
          </>
          <>
            {nodes.map((d, i) => (
              <TracesServiceMapNode
                activeServiceMapType={activeServiceMapType}
                colorsByServiceName={colorsByServiceName}
                date={date}
                key={d.data.id}
                index={i}
                nodeDatum={d}
                requestsByServiceName={requestsByServiceName}
                selectedFacetValuesByName={selectedFacetValuesByName}
                setHoveredNodeIndex={setHoveredNodeIndex}
                spanTypeByServiceName={spanTypeByServiceName}
              />
            ))}
            {hoveredNode ? (
              <TracesServiceMapNode
                activeServiceMapType={activeServiceMapType}
                colorsByServiceName={colorsByServiceName}
                date={date}
                index={hoveredNodeIndex}
                isHovered
                key={hoveredNode.data.id}
                nodeDatum={hoveredNode}
                requestsByServiceName={requestsByServiceName}
                selectedFacetValuesByName={selectedFacetValuesByName}
                setHoveredNodeIndex={setHoveredNodeIndex}
                spanTypeByServiceName={spanTypeByServiceName}
              />
            ) : null}
          </>
        </Group>
      </svg>
      {hoveredLinkState[0] ? (
        <TracesServiceMapLinkTooltip
          date={date}
          left={hoveredLinkState[0].left}
          top={hoveredLinkState[0].top}
          link={hoveredLinkState[0].link}
        />
      ) : null}
    </>
  );
};

export default TracesServiceMapVisualization;
