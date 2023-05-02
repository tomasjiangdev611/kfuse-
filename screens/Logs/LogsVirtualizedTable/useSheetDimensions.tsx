import React from 'react';

const getColumnLefts = ({ columns }) => {
  let total = 0;
  const result = [];

  for (let i = 0, columnsLength = columns.length; i < columnsLength; i += 1) {
    result.push(total);
    total += columns[i].width;
  }

  return result;
};

const useSheetDimensions = ({ columns, rows, width, height }) => {
  const rowHeight = 32;
  const columnLefts = getColumnLefts({ columns });
  const contentHeight = rowHeight * rows.length;
  const contentWidth = columns.reduce((sum, column) => sum + column.width, 0);
  const sheetHeight = height;
  const sheetWidth = width;
  const maxScrollX = contentWidth - sheetWidth;
  const maxScrollY = contentHeight - sheetHeight + rowHeight;

  return {
    columnLefts,
    contentHeight,
    contentWidth,
    maxScrollX,
    maxScrollY,
    rowHeight,
    sheetHeight,
    sheetWidth,
  };
};
