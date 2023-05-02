import React, { ReactElement, useRef } from 'react';

const ScrollView = ({
  children,
  height,
  horizontal,
  maxHeight,
  scrollIndicator,
  vertical,
  width,
}: {
  children: React.ReactNode;
  height: number | string;
  horizontal?: boolean;
  maxHeight?: number;
  scrollIndicator?: boolean;
  vertical?: boolean;
  width: number;
}): ReactElement => {
  return (
    <div
      className={scrollIndicator ? '' : 'overflow-srcoll'}
      style={{
        width,
        height,
        maxHeight: maxHeight ? maxHeight : 150,
        overflowX: horizontal ? 'scroll' : 'auto',
        overflowY: vertical ? 'scroll' : 'auto',
      }}
    >
      {children}
    </div>
  );
};

export default ScrollView;
