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
import { buildPromQLFilterFromSelectedFacetValuesByName } from 'utils';
import TracesServiceMapLinkTooltip from './TracesServiceMapLinkTooltip';
import TracesServiceMapNodeTooltip from './TracesServiceMapNodeTooltip';
import { getTimeParameter } from './utils';

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
    const { parent_service_name, service_name } = metric;

    if (parent_service_name && !nodeById[parent_service_name]) {
      nodeById[parent_service_name] = {
        id: parent_service_name,
        data: {
          label: parent_service_name,
        },
      };
    }

    if (!nodeById[service_name]) {
      nodeById[service_name] = {
        id: service_name,
        data: {
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

type ServiceMapQueryArgs = {
  date: DateSelection;
  selectedFacetValuesByName: SelectedFacetValuesByName;
};

const serviceMapQuery = ({
  date,
  selectedFacetValuesByName,
}: ServiceMapQueryArgs) => {
  const timeParameter = getTimeParameter(date);
  const promqlFilter = buildPromQLFilterFromSelectedFacetValuesByName(
    selectedFacetValuesByName,
  );

  return `sum by (service_name,parent_service_name) (rate(trace_edge_spans_total${promqlFilter}[${timeParameter}]))`;
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

  const requestsByServiceNameRequest = useRequest((args) => {
    const timeDuration = getTimeParameter(args.date);
    const selectedFacetValuesByNameToFilter = {
      ...args.selectedFacetValuesByName,
    };

    if (selectedFacetValuesByNameToFilter['kube_namespace']) {
      delete selectedFacetValuesByNameToFilter['kube_namespace'];
    }

    const promqlFilter = buildPromQLFilterFromSelectedFacetValuesByName(
      selectedFacetValuesByNameToFilter,
    );

    return queryRange({
      date: args.date,
      query: `ceil(sum by (service_name) (increase(spans_total${promqlFilter}[${timeDuration}])))`,
      instant: true,
    }).then(formatRequestsByServiceName);
  });

  const spanTypeByServiceNameRequest = useRequest((args) => {
    return queryRange({
      date: args.date,
      query: `sum by (span_type, service_name) (spans_total{service_entry="true"})`,
    }).then(formatSpanTypeByServiceName);
  });

  const errorsByServiceNameRequest = useRequest((args) =>
    queryRange({
      date: args.date,
      instant: true,
      query: `sum by (service_name, parent_service_name) (span_errors_total{service_entry="true"})`,
    }).then(formatErrorsByServiceName),
  );

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

  useEffect(() => {
    requestsByServiceNameRequest.call({ date, selectedFacetValuesByName });
    queryRangeRequest.call({ date, selectedFacetValuesByName });
    // spanTypeByServiceNameRequest.call({ date });
    errorsByServiceNameRequest.call({ date });
  }, [date, selectedFacetValuesByName]);

  return (
    <div className="traces__service-map">
      <Loader
        className="traces__service-map__loader"
        isLoading={queryRangeRequest.isLoading}
        ref={containerRef}
      >
        <ServiceMap
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
