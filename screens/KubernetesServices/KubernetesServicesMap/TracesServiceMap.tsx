import { Loader, ServiceMap } from 'components';
import { useRequest } from 'hooks';
import React, { useEffect, useRef, useMemo } from 'react';
import { MarkerType } from 'reactflow';
import { queryRange } from 'requests';
import {
  DateSelection,
  PrometheusDataset,
  SelectedFacetValuesByName,
} from 'types';
import { buildPromQLClausesFromSelectedFacetValuesByName } from 'utils';
import TracesServiceMapNodeTooltip from './TracesServiceMapNodeTooltip';
import TracesServiceMapLinkTooltip from './TracesServiceMapLinkTooltip';
import { getTimeParameter } from './utils';

const customFilters = [
  {
    key: 'hideExternalServices',
    filter: ({ edges, nodes }) =>
      nodes.filter((node) => node.data.attributes.service_name),
    label: 'Hide External Services',
  },
];

const formatRequestsByServiceName = (result: PrometheusDataset[]) => {
  const requestsByServiceName: { [key: string]: number } = {};

  result.forEach((dataset) => {
    const { metric, value } = dataset;
    const { service_name } = metric;

    if (value && value.length > 1 && service_name) {
      requestsByServiceName[service_name] = Number(value[1]);
    }
  });

  const max = Math.max(...Object.values(requestsByServiceName));

  return Object.keys(requestsByServiceName).reduce(
    (obj, serviceName) => ({
      ...obj,
      [serviceName]:
        20 + Math.round((requestsByServiceName[serviceName] / max) * 40),
    }),
    {},
  );
};

const formatDataset = (result: PrometheusDataset[]) => {
  const edgeById: { [id: string]: any } = {};
  const nodeById: { [serviceName: string]: any } = {};
  result.forEach((dataset) => {
    const { metric } = dataset;
    const { parent_service_name } = metric;
    const service_name = metric.service_name || metric.server_ip;

    if (parent_service_name && !nodeById[parent_service_name]) {
      nodeById[parent_service_name] = {
        id: parent_service_name,
        data: {
          attributes: metric,
          label: parent_service_name,
        },
      };
    }

    if (service_name && !nodeById[service_name]) {
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

// const formatDataset = (result: PrometheusDataset[]) => {
//   const serviceBitMap: { [serviceName: string]: string[] } = {};
//   result.forEach((dataset) => {
//     const { metric } = dataset;
//     const { parent_service_name, server_ip, service_name } = metric;
//     const serviceName = service_name || server_ip;
//
//     if (parent_service_name && !serviceBitMap[parent_service_name]) {
//       serviceBitMap[parent_service_name] = [];
//     }
//
//     if (!serviceBitMap[serviceName]) {
//       serviceBitMap[serviceName] = [];
//     }
//
//     if (parent_service_name && parent_service_name !== serviceName) {
//       serviceBitMap[serviceName].push(parent_service_name);
//     }
//   });
//
//   return Object.keys(serviceBitMap).map((serviceName) => ({
//     id: serviceName,
//     parentIds: serviceBitMap[serviceName],
//   }));
// };

const formatSpanTypeByServiceName = (result: PrometheusDataset[]) => {
  const spanTypeByServiceName: { [key: string]: string } = {};

  result.forEach((dataset) => {
    const { metric } = dataset;
    const { service_name, span_type } = metric;

    if (service_name && span_type) {
      spanTypeByServiceName[service_name] = span_type;
    }
  });

  return spanTypeByServiceName;
};

type ServiceMapQueryArgs = {
  date: DateSelection;
  selectedFacetValuesByName: SelectedFacetValuesByName;
};

const getNodesAndEdges = ({
  colorsByServiceName,
  edges,
  errorsByServiceName,
  nodes,
  requestsByServiceName,
}) => {
  const max = Math.max(...Object.values(requestsByServiceName));
  return {
    edges,
    nodes: nodes.map((node) => {
      const serviceName = node.data.label;
      const requests = requestsByServiceName[serviceName] || 0;
      const outerRingSize = max ? Math.round((requests / max) * 10) : 0;
      return {
        ...node,
        data: {
          ...node.data,
          color: colorsByServiceName[serviceName],
          hasError: Boolean(errorsByServiceName[serviceName]),
          outerRingSize,
        },
      };
    }),
  };
};

const serviceMapQuery = ({
  date,
  selectedFacetValuesByName,
}: ServiceMapQueryArgs) => {
  const timeParameter = getTimeParameter(date);
  const promqlFilterClauses = buildPromQLClausesFromSelectedFacetValuesByName(
    selectedFacetValuesByName,
  );
  const promqlFilterClausesJoined = promqlFilterClauses.length
    ? `${promqlFilterClauses.join(',')},`
    : '';

  return `sum by(kube_cluster_name, kube_namespace, service_name, parent_service_name, server_ip, client_ip)(rate(request_count{${promqlFilterClausesJoined}kube_service!="datadog-agent-kube-state-metrics", kube_service!="kfuse-agent", service_name=~".+", parent_service_name=~".+"}[${timeParameter}]))`;
};

type Props = {
  colorsByServiceName: { [key: string]: string };
  date: DateSelection;
  selectedFacetValuesByName: SelectedFacetValuesByName;
};

const TracesServiceMap = ({
  colorsByServiceName,
  date,
  selectedFacetValuesByName,
}: Props) => {
  const containerRef = useRef(null);

  const formatErrorsByServiceName = (result: PrometheusDataset[]) => {
    const errorsByServiceName: { [key: string]: number } = {};

    result.forEach((dataset) => {
      const { metric, value } = dataset;
      const { service_name } = metric;

      if (service_name) {
        errorsByServiceName[service_name] = Number(value[1]);
      }
    });

    return errorsByServiceName;
  };

  const errorsByServiceNameRequest = useRequest((args) => {
    const timeParameter = getTimeParameter(args.date);
    const promqlFilterClauses = buildPromQLClausesFromSelectedFacetValuesByName(
      selectedFacetValuesByName,
    );
    const promqlFilterClausesJoined = promqlFilterClauses.length
      ? `${promqlFilterClauses.join(',')},`
      : '';

    return queryRange({
      date: args.date,
      instant: true,
      query: `sum by(kube_cluster_name, kube_namespace, service_name, parent_service_name, server_ip)(rate(error{${promqlFilterClausesJoined}kube_service!="datadog-agent-kube-state-metrics", kube_service!="kfuse-agent"}[${timeParameter}]))`,
    }).then(formatErrorsByServiceName);
  });

  const requestsByServiceNameRequest = useRequest((args) => {
    const timeParameter = getTimeParameter(args.date);
    const promqlFilterClauses = buildPromQLClausesFromSelectedFacetValuesByName(
      selectedFacetValuesByName,
    );
    const promqlFilterClausesJoined = promqlFilterClauses.length
      ? `${promqlFilterClauses.join(',')},`
      : '';
    return queryRange({
      date: args.date,
      query: `ceil(sum by(kube_cluster_name, kube_namespace, service_name, server_ip)(rate(request_count{${promqlFilterClausesJoined}kube_service!="datadog-agent-kube-state-metrics", kube_service!="kfuse-agent"}[${timeParameter}])))`,
      instant: true,
    }).then(formatRequestsByServiceName);
  });

  const spanTypeByServiceNameRequest = useRequest((args) => {
    return queryRange({
      date: args.date,
      query: `sum by (span_type, service_name) (spans_total{service_entry="true"})`,
    }).then(formatSpanTypeByServiceName);
  });

  const queryRangeRequest = useRequest(async (args) =>
    queryRange({
      date: args.date,
      instant: true,
      query: serviceMapQuery({
        date: args.date,
        selectedFacetValuesByName: args.selectedFacetValuesByName,
      }),
    }).then(formatDataset),
  );

  useEffect(() => {
    requestsByServiceNameRequest.call({ date, selectedFacetValuesByName });
    queryRangeRequest.call({ date, selectedFacetValuesByName });
    // spanTypeByServiceNameRequest.call({ date });
    errorsByServiceNameRequest.call({ date });
  }, [date, selectedFacetValuesByName]);

  const requestsByServiceName = useMemo(
    () => requestsByServiceNameRequest.result || {},
    [requestsByServiceNameRequest.result],
  );

  const { edges, nodes } = useMemo(
    () =>
      getNodesAndEdges({
        colorsByServiceName,
        errorsByServiceName: errorsByServiceNameRequest.result || {},
        nodes: queryRangeRequest.result?.nodes || [],
        edges: queryRangeRequest.result?.edges || [],
        requestsByServiceName,
      }),
    [
      colorsByServiceName,
      errorsByServiceNameRequest.result,
      queryRangeRequest.result,
      requestsByServiceName,
    ],
  );

  return (
    <div className="traces__service-map">
      <Loader
        className="traces__service-map__loader"
        isLoading={queryRangeRequest.isLoading}
        ref={containerRef}
      >
        <ServiceMap
          customFilters={customFilters}
          initialEdges={edges}
          initialNodes={nodes}
          renderNodeTooltip={(id, node) => (
            <TracesServiceMapNodeTooltip
              date={date}
              serviceName={id}
              selectedFacetValuesByName={selectedFacetValuesByName}
            />
          )}
          renderEdgeTooltip={(edge) => (
            <TracesServiceMapLinkTooltip date={date} edge={edge} />
          )}
        />
      </Loader>
    </div>
  );
};

export default TracesServiceMap;
