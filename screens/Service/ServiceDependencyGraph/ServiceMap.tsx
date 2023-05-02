import { Orientation, ServiceMap } from 'components';
import { useRequest } from 'hooks';
import React, { useEffect, useMemo, useState } from 'react';
import { MarkerType } from 'reactflow';
import { queryRange } from 'requests';
import { DateSelection } from 'types';
import ServiceMapLinkTooltip from './ServiceMapLinkTooltip';
import ServiceMapNodeTooltip from './ServiceMapNodeTooltip';
import { getTimeParameter } from './utils';
import { buildFilterFromFormValues } from '../utils';

type ServiceMapQueryArgs = {
  date: DateSelection;
  isDownStream: boolean;
  formValues: { [key: string]: any };
  serviceName: string;
};

const serviceMapQuery = ({
  date,
  formValues,
  isDownStream,
  serviceName,
}: ServiceMapQueryArgs) => {
  const timeParameter = getTimeParameter(date);
  const formValueFilters = buildFilterFromFormValues(formValues);
  const formValueFiltersString = formValueFilters ? `,${formValueFilters}` : '';

  return `sum by (service_name, parent_service_name) (rate(trace_edge_latency_ms_bucket{${
    isDownStream ? 'parent_service_name' : 'service_name'
  }="${serviceName}"${formValueFiltersString}}[${timeParameter}]))`;
};

export interface Datum {
  metric: Metric;
  value: [number, string];
}

export interface Metric {
  parent_service_name: string;
  service_name: string;
}

const formatDataset = (result: PrometheusDataset[]) => {
  const edgeById: { [id: string]: any } = {};
  const nodeById: { [serviceName: string]: any } = {};
  result.forEach((dataset) => {
    const { metric } = dataset;
    const { parent_service_name, service_name } = metric;

    if (parent_service_name && !nodeById[parent_service_name]) {
      nodeById[parent_service_name] = {
        id: parent_service_name,
        data: {
          attributes: metric,
          label: parent_service_name,
        },
      };
    }

    if (!nodeById[service_name]) {
      nodeById[service_name] = {
        id: service_name,
        data: {
          attributes: metric,
          label: service_name,
        },
      };
    }

    if (parent_service_name && parent_service_name !== service_name) {
      const edgeIds = [service_name, parent_service_name];
      const edgeId = edgeIds.sort().join('->');
      if (!edgeById[edgeId]) {
        edgeById[edgeId] = {
          source: parent_service_name,
          target: service_name,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: '#FF0072',
          },
        };
      } else {
        const edge = edgeById[edgeId];
        const { source } = edge;
        if (source !== parent_service_name) {
          edge.markerStart = {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: '#FF0072',
          };
        }
      }
    }
  });

  const edges = Object.values(edgeById);
  const nodes = Object.values(nodeById);

  return { edges, nodes };
};

type Props = {
  colorsByServiceName: { [key: string]: string };
  date: DateSelection;
  formValues: { [key: string]: string };
  serviceName: string;
};

const fetchServiceMap = ({ date, formValues, isDownStream, serviceName }) =>
  queryRange({
    date,
    instant: true,
    query: serviceMapQuery({
      date,
      formValues,
      isDownStream,
      serviceName,
    }),
  });

const ServiceDependencyGraph = ({
  colorsByServiceName,
  date,
  formValues,
  serviceName,
}: Props) => {
  const [hoveredLink, setHoveredLink] = useState(null);
  const queryRangeRequest = useRequest(async (args) => {
    const resultSets = await Promise.all([
      fetchServiceMap({
        date: args.date,
        formValues,
        isDownStream: false,
        serviceName,
      }),
      fetchServiceMap({
        date: args.date,
        formValues,
        isDownStream: true,
        serviceName,
      }),
    ]);

    const dataset = [...resultSets[0], ...resultSets[1]];
    return formatDataset(dataset);
  });

  const { edges, nodes } = useMemo(() => {
    const initialNodes = queryRangeRequest.result?.nodes || [];
    const initialEdges = queryRangeRequest.result?.edges || [];

    return {
      nodes: initialNodes.filter((node) => ({
        ...node,
        data: {
          ...node.data,
          color: colorsByServiceName[node.data.attributes.service_name],
        },
      })),
      edges: initialEdges,
    };
  }, [queryRangeRequest.result, colorsByServiceName]);

  useEffect(() => {
    queryRangeRequest.call({
      date,
      formValues,
    });
  }, [date, formValues]);

  return (
    <div style={{ height: '240px' }}>
      <ServiceMap
        initialEdges={edges}
        initialNodes={nodes}
        orientation={Orientation.horizontal}
        renderNodeTooltip={(id, data) => (
          <ServiceMapNodeTooltip date={date} data={data} serviceName={id} />
        )}
        renderEdgeTooltip={(edge) => (
          <ServiceMapLinkTooltip
            date={date}
            parentServiceName={edge.source}
            serviceName={edge.target}
          />
        )}
      />
    </div>
  );
};

export default ServiceDependencyGraph;
