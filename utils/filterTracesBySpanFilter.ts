import { SpanFilter, Trace } from 'types';
import isSpanRoot from './isSpanRoot';

const filterTracesBySpanFilter = (rows: Trace[], spanFilter: SpanFilter) => {
  const spansById: { [key: string]: Trace['span'] } = rows.reduce(
    (obj, trace) => ({ ...obj, [trace.span.spanId]: trace.span }),
    {},
  );

  switch (spanFilter) {
    case SpanFilter.serviceEntrySpans:
      return rows.filter(
        (row) =>
          spansById[row.span.parentSpanId]?.serviceName !==
          row.span.serviceName,
      );
    case SpanFilter.traceRootSpans:
      return rows.filter(
        (row) => !row.span.parentSpanId || isSpanRoot(row.span),
      );
    default:
      return rows;
  }
};

export default filterTracesBySpanFilter;
