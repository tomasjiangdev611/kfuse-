import React, { ReactElement } from 'react';
import { Series } from 'uplot';

const SeriesIcon = ({
  backgroundColor,
}: {
  backgroundColor: Series.Stroke;
}): ReactElement => {
  return (
    <div
      className="uplot__seriesicon "
      style={{ background: `${backgroundColor}` }}
    ></div>
  );
};

export default SeriesIcon;
