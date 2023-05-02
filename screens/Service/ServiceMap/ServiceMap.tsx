import { Orientation, ServiceMap } from 'components';
import { useRequest } from 'hooks';
import React, { useEffect, useMemo, useState } from 'react';
import { MarkerType } from 'reactflow';
import { queryRange } from 'requests';
import { DateSelection } from 'types';
import ServiceMapNodeTooltip from './ServiceMapNodeTooltip';
import ServiceMapLinkTooltip from './ServiceMapLinkTooltip';
import { getTimeParameter } from './utils';
import { SidebarState } from '../types';
import { buildFilterFromFormValues } from '../utils';

type ServiceMapQueryArgs = {
  date: DateSelection;
  isDownStream: boolean;
  formValues: { [key: string]: any };
  name: string;
  serviceName: string;
};

const serviceMapQuery = ({
  date,
  formValues,
  isDownStream,
  name,
  serviceName,
}: ServiceMapQueryArgs) => {
  const timeParameter = getTimeParameter(date);
  const formValueFilters = buildFilterFromFormValues(formValues);
  const formValueFiltersString = formValueFilters ? `,${formValueFilters}` : '';

  return `sum by (service_name, parent_service_name, span_name, parent_span_name,span_type) (rate(trace_edge_spans_total{${
    isDownStream ? 'parent_span_name' : 'span_name'
  }="${name}",${
    isDownStream ? 'parent_service_name' : 'service_name'
  }="${serviceName}"${formValueFiltersString}}[${timeParameter}]))`;
};

export interface Datum {
  metric: Metric;
  value: [number, string];
}

export interface Metric {
  parent_service_name: string;
  parent_span_name: string;
  service_name: string;
  span_name: string;
  span_type: string;
}

const formatDataset = (result: PrometheusDataset[]) => {
  const edgeById: { [id: string]: any } = {};
  const nodeById: { [serviceName: string]: any } = {};
  result.forEach((dataset) => {
    const { metric } = dataset;
    const { parent_service_name, parent_span_name, service_name, span_name } =
      metric;
    const key =
      service_name && span_name ? `${service_name}:${span_name}` : null;
    const parentKey =
      parent_service_name && parent_span_name
        ? `${parent_service_name}:${parent_span_name}`
        : null;

    if (parentKey && !nodeById[parentKey]) {
      nodeById[parentKey] = {
        id: parentKey,
        data: {
          attributes: metric,
          label: parentKey,
        },
      };
    }

    if (!nodeById[key]) {
      nodeById[key] = {
        id: key,
        data: {
          attributes: metric,
          label: key,
        },
      };
    }

    if (parentKey && parentKey !== key) {
      const edgeIds = [key, parentKey];
      const edgeId = edgeIds.sort().join('->');
      if (!edgeById[edgeId]) {
        edgeById[edgeId] = {
          source: parentKey,
          target: key,
          data: {
            attributes: metric,
          },
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
        if (source !== parentKey) {
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

// const formatDataset = (data: Datum[]) => {
//   const childrenByKey: { [key: string]: string[] } = {};
//   const keysBitmap: { [key: string]: number } = {};
//   const attributesByKey: { [key: string]: Datum } = {};
//
//   data.forEach((datum) => {
//     const { parent_service_name, parent_span_name, service_name, span_name } =
//       datum.metric;
//     const key = `${service_name}:${span_name}`;
//     const parentKey = `${parent_service_name}:${parent_span_name}`;
//
//     attributesByKey[key] = datum;
//     keysBitmap[key] = 1;
//
//     if (key === parentKey) {
//       return;
//     }
//
//     if (!childrenByKey[parentKey]) {
//       childrenByKey[parentKey] = [];
//     }
//
//     if (childrenByKey[parentKey].indexOf(key) === -1) {
//       childrenByKey[parentKey].push(key);
//     }
//   });
//
//   const foundRootKeys = Object.keys(childrenByKey).filter(
//     (key) => !keysBitmap[key],
//   );
//
//   const circularNodeRootKeys = data
//     .filter(
//       (datum) =>
//         datum.metric.service_name === datum.metric.parent_service_name &&
//         datum.metric.span_name === datum.metric.parent_span_name,
//     )
//     .map((datum) => `${datum.metric.service_name}:${datum.metric.span_name}`);
//
//   const rootKeys = foundRootKeys.length ? foundRootKeys : circularNodeRootKeys;
//
//   return rootKeys.map((rootKey) => {
//     const [service_name, span_name] = rootKey.split(':');
//     const result = {
//       name: rootKey,
//       children: [],
//       attributes: {
//         ...(attributesByKey[rootKey]?.metric || {}),
//         service_name,
//         span_name,
//       },
//     };
//
//     attachChildren(rootKey, result, childrenByKey, attributesByKey);
//     return result;
//   });
// };

type Props = {
  colorsByServiceName: { [key: string]: string };
  date: DateSelection;
  formValues: { [key: string]: string };
  name: string;
  serviceName: string;
  setSidebar: (sidebar: SidebarState) => void;
};

const fetchServiceMap = ({
  date,
  formValues,
  isDownStream,
  name,
  serviceName,
}) =>
  queryRange({
    date,
    instant: true,
    query: serviceMapQuery({
      date,
      formValues,
      isDownStream,
      name,
      serviceName,
    }),
  });

const ServiceSidebarServiceMap = ({
  colorsByServiceName,
  date,
  formValues,
  name,
  serviceName,
  setSidebar,
}: Props) => {
  const [hoveredLink, setHoveredLink] = useState(null);
  const queryRangeRequest = useRequest(async (args) => {
    const resultSets = await Promise.all([
      fetchServiceMap({
        date: args.date,
        formValues,
        isDownStream: false,
        name: args.name,
        serviceName,
      }),
      fetchServiceMap({
        date: args.date,
        formValues,
        isDownStream: true,
        name: args.name,
        serviceName,
      }),
    ]);

    const dataset = [...resultSets[0], ...resultSets[1]];
    return formatDataset(dataset);
  });
  useEffect(() => {
    queryRangeRequest.call({
      date,
      formValues,
      name,
    });
  }, []);

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

  return (
    <div style={{ height: '240px' }}>
      <ServiceMap
        initialEdges={edges}
        initialNodes={nodes}
        orientation={Orientation.horizontal}
        renderNodeTooltip={(id, data) => (
          <ServiceMapNodeTooltip
            date={date}
            data={data}
            serviceName={data.attributes.service_name}
            spanName={data.attributes.span_name}
          />
        )}
        renderEdgeTooltip={(edge) => (
          <ServiceMapLinkTooltip
            date={date}
            parentServiceName={edge.data.attributes.parent_service_name}
            parentSpanName={edge.data.attributes.parent_span_name}
            spanName={edge.data.attributes.span_name}
            serviceName={edge.data.attributes.service_name}
          />
        )}
      />
    </div>
  );
};

export default ServiceSidebarServiceMap;
