import { Node } from 'sunburst-chart';

export const getParentData = (node: Node) => {
  const parentData = [];
  let currentNode = node.__dataNode;
  while (currentNode) {
    parentData.push(currentNode.data.__dataNode);
    currentNode = currentNode.parent;
  }

  const tooltipData = [];
  const reversedData = parentData.reverse();
  for (let i = 1; i < reversedData.length; i++) {
    const data = reversedData[i];
    tooltipData.push({
      color: data.data.color,
      name: data.data.name,
      size: data.value,
    });
  }

  return tooltipData;
};
