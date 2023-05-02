import { Span } from 'types';

const isSpanRoot = (span: Span): boolean => span.rootSpan;

export default isSpanRoot;
