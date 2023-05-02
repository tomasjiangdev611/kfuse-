const traverseBitmap = (spanId, bitmap, result) => {
  if (spanId in bitmap) {
    const spanIds = Object.keys(bitmap[spanId]);
    spanIds.forEach((nextSpanId) => {
      const traverseResult = traverseBitmap(nextSpanId, bitmap, {
        ...result,
        [nextSpanId]: 1,
      });

      Object.keys(traverseResult).forEach((key) => {
        result[key] = traverseResult[key];
      });
    });
  }

  return result;
};

const getHighlightedSpanBitmap = (spanId, spans) => {
  if (!spanId) {
    return {};
  }

  const spanByParentSpanId = {};
  const spanByChildSpanId = {};

  spans.forEach((span) => {
    const { parentSpanId, spanId } = span;
    if (!spanByParentSpanId[parentSpanId]) {
      spanByParentSpanId[parentSpanId] = {};
    }

    spanByParentSpanId[parentSpanId][spanId] = 1;

    if (!spanByChildSpanId[spanId]) {
      spanByChildSpanId[spanId] = {};
    }

    spanByChildSpanId[spanId][parentSpanId] = 1;
  });

  const parentSpanBitmap = traverseBitmap(spanId, spanByParentSpanId, {});
  const childSpanBitmp = traverseBitmap(spanId, spanByChildSpanId, {});

  return {
    ...parentSpanBitmap,
    ...childSpanBitmp,
  };
};

export default getHighlightedSpanBitmap;
