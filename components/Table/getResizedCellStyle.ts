import { CSSProperties } from 'react';

type Args = {
  isLast: boolean;
  shouldRenderDiv: boolean;
  width: number;
};

const getResizedCellStyle = ({
  isLast,
  shouldRenderDiv,
  width,
}: Args): CSSProperties => {
  if (shouldRenderDiv) {
    if (isLast) {
      return { flex: 1, overflow: 'hidden' };
    }

    return { width: `${width}px` };
  }

  return {};
};

export default getResizedCellStyle;
