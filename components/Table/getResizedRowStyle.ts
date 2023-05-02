import { CSSProperties } from 'react';

type Args = {
  isFullWidth: boolean;
  shouldRenderDiv: boolean;
  totalWidth: number;
};

const getResizedRowStyle = ({
  isFullWidth,
  shouldRenderDiv,
  totalWidth,
}: Args): CSSProperties => {
  if (shouldRenderDiv) {
    if (isFullWidth) {
      return { width: '100%' };
    }

    return { width: `${totalWidth}px` };
  }

  return {};
};

export default getResizedRowStyle;
