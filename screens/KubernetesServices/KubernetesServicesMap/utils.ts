import { DateSelection, Span } from 'types';
import { formatDiffNs, isSpanRoot } from 'utils';
import { SpanNode } from './types';

export const getTimeParameter = (date: DateSelection) => {
  const { endTimeUnix, startTimeUnix } = date;
  const diffInSeconds = endTimeUnix - startTimeUnix;
  if (diffInSeconds > 60 * 5) {
    return `${diffInSeconds}s`;
  }

  return `5m`;
};

type FindSpanNodeChildrenArgs = {
  attribute: string;
  colorsByHostname: { [key: string]: string };
  colorsByServiceName: { [key: string]: string };
  parentSpanId: string;
  spanNode: SpanNode;
  spans: Span[];
};

const findSpanNodeChildren = ({
  attribute,
  colorsByHostname,
  colorsByServiceName,
  parentSpanId,
  spanNode,
  spans,
}: FindSpanNodeChildrenArgs): void => {
  spanNode.children = spans
    .filter((span) => span.parentSpanId === parentSpanId)
    .map((span) =>
      makeSpanNode({
        attribute,
        colorsByHostname,
        colorsByServiceName,
        span,
        spans,
      }),
    );
};

type MakeSpanNodeArgs = {
  attribute: string;
  colorsByHostname: { [key: string]: string };
  colorsByServiceName: { [key: string]: string };
  span: Span;
  spans: Span[];
};

const makeSpanNode = ({
  attribute,
  colorsByHostname,
  colorsByServiceName,
  span,
  spans,
}: MakeSpanNodeArgs): SpanNode => {
  const { attributes, serviceName, startTimeNs, endTimeNs } = span;
  const { hostname } = attributes;
  const backgroundColor =
    attribute === 'service'
      ? colorsByServiceName[serviceName]
      : colorsByHostname[hostname];

  const time = formatDiffNs(startTimeNs, endTimeNs);

  const spanNode = {
    backgroundColor,
    children: [] as SpanNode[],
    name: `${span.name} (${time})`,
    spanId: span.spanId,
    value: Math.max(endTimeNs - startTimeNs, 1),
  };

  findSpanNodeChildren({
    attribute,
    colorsByHostname,
    colorsByServiceName,
    parentSpanId: span.spanId,
    spanNode,
    spans,
  });

  return spanNode;
};

type Args = {
  attribute: string;
  colorsByHostname: { [key: string]: string };
  colorsByServiceName: { [key: string]: string };
  spans: Span[];
};

export const makeSpanTree = ({
  attribute,
  colorsByHostname,
  colorsByServiceName,
  spans,
}: Args): SpanNode => {
  const parentSpanIndex = spans.length === 1 ? 0 : spans.findIndex(isSpanRoot);
  if (parentSpanIndex > -1) {
    const parentSpan = spans[parentSpanIndex];

    const spanNode = makeSpanNode({
      attribute,
      colorsByHostname,
      colorsByServiceName,
      span: parentSpan,
      spans,
    });
    return spanNode;
  }

  return null;
};
