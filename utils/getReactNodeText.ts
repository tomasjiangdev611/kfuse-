import { ReactElement, ReactNode } from 'react';

const getReactNodeText = (reactNode: ReactElement): string => {
  const children = reactNode.props?.children || undefined;
  if (Array.isArray(reactNode)) {
    // Multiple children
    const joinedNodes: ReactNode[] = [];
    reactNode.forEach((node) => {
      if (typeof node === 'object') joinedNodes.push(getReactNodeText(node));
      else if (typeof node === 'string') joinedNodes.push(node);
    });
    return joinedNodes.join(' ');
  }
  if (children === undefined) {
    if (typeof reactNode === 'string') return reactNode;
    else return ' ';
  }
  if (typeof children === 'object') {
    // Found direct child
    return getReactNodeText(reactNode.props.children as ReactElement);
  }
  if (typeof children === 'string') {
    // Found searchable string
    return reactNode.props.children;
  }
};

export default getReactNodeText;
