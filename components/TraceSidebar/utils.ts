import { Span } from 'types';
import { Attribute } from './types';

export const getAttribute = (attribute: Attribute, span: Span): string => {
  if (attribute === Attribute.service) {
    return span.serviceName;
  }

  return span.attributes[attribute];
};
