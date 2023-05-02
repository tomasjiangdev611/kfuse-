import { Span } from 'types';
import { RelatedSpansBySpanId, SpanBitMap, SpanRow, SpanRows } from './types';

const niceNum = (range: number, round: boolean) => {
  const exponent = Math.floor(Math.log10(range));
  const fraction = range / Math.pow(10, exponent);
  let niceFraction;

  if (round) {
    if (fraction < 1.5) niceFraction = 1;
    else if (fraction < 3) niceFraction = 2;
    else if (fraction < 7) niceFraction = 5;
    else niceFraction = 10;
  } else {
    if (fraction <= 1) niceFraction = 1;
    else if (fraction <= 2) niceFraction = 2;
    else if (fraction <= 5) niceFraction = 5;
    else niceFraction = 10;
  }

  return niceFraction * Math.pow(10, exponent);
};

const niceScale = (
  lowerBound: number,
  upperBound: number,
  maxTicks: number,
) => {
  const range = niceNum(upperBound - lowerBound, false);
  const tickSpacing = niceNum(range / (maxTicks - 1), true);
  const niceLowerBound = Math.floor(lowerBound / tickSpacing) * tickSpacing;
  const niceUpperBound = Math.ceil(upperBound / tickSpacing) * tickSpacing;

  return { niceLowerBound, niceUpperBound, tickSpacing };
};

const sortByStartTimeNs = (spanBitMap: SpanBitMap) => (a: string, b: string) =>
  spanBitMap[a].startTimeNs - spanBitMap[b].startTimeNs;

type CanAddSpanToRowArgs = {
  minPresentationalSpanDuration: number;
  row: SpanRow;
  spanBitMap: SpanBitMap;
  spanId: string;
};

const canAddSpanToRow = ({
  minPresentationalSpanDuration,
  row,
  spanBitMap,
  spanId,
}: CanAddSpanToRowArgs): boolean => {
  if (!row.length) {
    return true;
  }

  const { startTimeNs } = spanBitMap[spanId];
  const prevSpanId = row[row.length - 1];
  const prevSpan = spanBitMap[prevSpanId];
  return (
    startTimeNs >
    Math.max(
      prevSpan.endTimeNs,
      prevSpan.startTimeNs + minPresentationalSpanDuration,
    )
  );
};

type AddChildToSpanRowArgs = {
  minPresentationalSpanDuration: number;
  result: SpanRows;
  spanBitMap: SpanBitMap;
  spanId: string;
};

const addChildToSpanRow = ({
  minPresentationalSpanDuration,
  result,
  spanBitMap,
  spanId,
}: AddChildToSpanRowArgs) => {
  const lastRow = result[result.length - 1];
  if (
    canAddSpanToRow({
      row: lastRow,
      minPresentationalSpanDuration,
      spanBitMap,
      spanId,
    })
  ) {
    lastRow.push(spanId);
  } else {
    result.push([spanId]);
  }
};

const findMaxEndTime = ({
  childrenSpanIds,
  childrenBySpanId,
  maxEndTimeNs,
  spanBitMap,
}) => {
  let nextChildrenSpanIds: string[] = [];
  childrenSpanIds.forEach((spanId) => {
    const { endTimeNs } = spanBitMap[spanId];
    if (endTimeNs > maxEndTimeNs) {
      maxEndTimeNs = endTimeNs;
    }

    nextChildrenSpanIds = [
      ...nextChildrenSpanIds,
      ...(childrenSpanIds[spanId] || []),
    ];
  });

  if (nextChildrenSpanIds.length) {
    return findMaxEndTime({
      childrenSpanIds: nextChildrenSpanIds,
      childrenBySpanId,
      maxEndTimeNs,
      spanBitMap,
    });
  }

  return maxEndTimeNs;
};

type LayoutChildrenSpanArgs = {
  childrenBySpanId: RelatedSpansBySpanId;
  childrenSpanIds: string[];
  minPresentationalSpanDuration: number;
  spanBitMap: SpanBitMap;
  result: SpanRows;
};

const layoutChildrenSpan = ({
  childrenBySpanId,
  childrenSpanIds,
  minPresentationalSpanDuration,
  spanBitMap,
  result,
}: LayoutChildrenSpanArgs) => {
  const nextChildrenSpanIdBitmap: { [key: string]: number } = {};
  childrenSpanIds.sort(sortByStartTimeNs(spanBitMap)).forEach((spanId) => {
    addChildToSpanRow({
      minPresentationalSpanDuration,
      result,
      spanBitMap,
      spanId,
    });

    (childrenBySpanId[spanId] || []).forEach((childSpanId) => {
      nextChildrenSpanIdBitmap[childSpanId] = 1;
    });
  });

  const nextChildrenSpanIds = Object.keys(nextChildrenSpanIdBitmap);

  if (nextChildrenSpanIds.length) {
    layoutChildrenSpan({
      childrenBySpanId,
      childrenSpanIds: nextChildrenSpanIds,
      minPresentationalSpanDuration,
      spanBitMap,
      result,
    });
  }
};

type Result = {
  minPresentationalSpanDuration: number;
  minStartTimeNs: number;
  maxEndTimeNs: number;
  niceUpperBound: number;
  spanBitMap: SpanBitMap;
  spanRows: SpanRows;
  tickSpacing: number;
};

const getSpanRows = ({
  scale,
  spans,
  width,
}: {
  scale: number;
  spans: Span[];
  width: number;
}): Result => {
  const childrenBySpanId: RelatedSpansBySpanId = {};
  const parentsBySpanId: RelatedSpansBySpanId = {};
  const spanBitMap: SpanBitMap = {};
  const result: SpanRows = [];

  let minStartTimeNs: number = null;
  let maxEndTimeNs: number = null;
  let rootSpanId: string = null;

  spans.forEach((span) => {
    const { startTimeNs, endTimeNs, parentSpanId, rootSpan, spanId } = span;
    spanBitMap[spanId] = span;

    if (minStartTimeNs === null || startTimeNs < minStartTimeNs) {
      minStartTimeNs = startTimeNs;
    }

    if (maxEndTimeNs === null || endTimeNs > maxEndTimeNs) {
      maxEndTimeNs = endTimeNs;
    }

    spanBitMap[spanId] = span;

    if (rootSpan) {
      rootSpanId = spanId;
    } else {
      if (!childrenBySpanId[parentSpanId]) {
        childrenBySpanId[parentSpanId] = [];
      }

      childrenBySpanId[parentSpanId].push(spanId);

      if (!parentsBySpanId[spanId]) {
        parentsBySpanId[spanId] = [];
      }

      parentsBySpanId[spanId].push(parentSpanId);
    }
  });

  const diffInNs = maxEndTimeNs - minStartTimeNs;
  const min = 0;
  const max = scale < 1 ? Math.round(diffInNs / scale) : diffInNs;

  const maxTicks = Math.floor(width / 100);
  const { niceUpperBound, tickSpacing } = niceScale(min, max, maxTicks);

  const minPresentationalSpanDuration = Math.round((10 * max) / width);

  const childrenByMissingParentSpanId: { [key: string]: string[] } = spans
    .filter(
      (span) =>
        !span.rootSpan && span.parentSpanId && !spanBitMap[span.parentSpanId],
    )
    .reduce((obj, span) => {
      const nextObj: { [key: string]: string[] } = { ...obj };
      const { parentSpanId } = span;
      const nextChildren = [...(nextObj[parentSpanId] || [])];
      nextChildren.push(span.spanId);
      nextObj[parentSpanId] = nextChildren;
      return nextObj;
    }, {});

  const childrenByMissingParentSpanIdKeys = Object.keys(
    childrenByMissingParentSpanId,
  );

  if (!rootSpanId && spans.length) {
    const onlyRootSpanMissing = childrenByMissingParentSpanIdKeys.length === 1;
    const spanId = onlyRootSpanMissing
      ? childrenByMissingParentSpanIdKeys[0]
      : '0';

    const rootSpan = {
      attributes: {
        isGhostSpan: true,
      },
      spanId,
      startTimeNs: minStartTimeNs,
      endTimeNs: maxEndTimeNs,
      latency: 0,
      parentSpanId: '',
      rootSpan: true,
    };

    spanBitMap[spanId] = rootSpan;
    rootSpanId = spanId;

    if (onlyRootSpanMissing) {
      delete childrenByMissingParentSpanId[
        childrenByMissingParentSpanIdKeys[0]
      ];
    }
  }

  Object.keys(childrenByMissingParentSpanId).forEach((missingSpanId) => {
    const childrenSpanIds = childrenByMissingParentSpanId[missingSpanId];
    const childrenSpans = childrenSpanIds.map((spanId) => spanBitMap[spanId]);

    const startTimeNs = Math.min(
      ...childrenSpans.map((span) => span.startTimeNs),
    );

    const maxEndTimeNs = Math.max(
      ...childrenSpans.map((span) => span.endTimeNs),
    );

    const endTimeNs = findMaxEndTime({
      childrenSpanIds,
      childrenBySpanId,
      maxEndTimeNs,
      spanBitMap,
    });

    const parentSpanId = rootSpanId;

    const ghostSpan = {
      attributes: {
        isGhostSpan: true,
      },
      spanId: missingSpanId,
      startTimeNs,
      endTimeNs,
      latency: 0,
      parentSpanId,
    };

    spanBitMap[missingSpanId] = ghostSpan;

    if (!childrenBySpanId[parentSpanId]) {
      childrenBySpanId[parentSpanId] = [];
    }

    childrenBySpanId[parentSpanId].push(missingSpanId);
  });

  if (rootSpanId) {
    result.push([rootSpanId]);

    const childrenSpanIds = childrenBySpanId[rootSpanId] || [];

    layoutChildrenSpan({
      childrenBySpanId,
      childrenSpanIds,
      minPresentationalSpanDuration,
      spanBitMap,
      result,
    });
  }

  return {
    minPresentationalSpanDuration,
    minStartTimeNs,
    maxEndTimeNs: minStartTimeNs + niceUpperBound,
    niceUpperBound,
    spanBitMap,
    spanRows: result,
    tickSpacing,
  };
};

export default getSpanRows;
