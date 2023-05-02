import React, { ReactElement } from 'react';
import { convertNumberToReadableUnit } from 'utils';

import SizeObserver from '../SizeObserver';

const TopList = ({
  data,
}: {
  data: Array<{ label: string; count: number }>;
}): ReactElement => {
  const maxCount = data[0]?.count || 0;
  const countWidth = maxCount > 999 ? 90 : 60;
  return (
    <div className="top-list">
      <SizeObserver>
        {({ width: basWidth }) => (
          <>
            {data.map(({ label, count }) => {
              const width = (count / maxCount) * basWidth - countWidth - 20;
              return (
                <div className="top-list__item" key={label}>
                  <div
                    className="top-list__item__count"
                    style={{ width: countWidth }}
                  >
                    {convertNumberToReadableUnit(count, 2)}
                  </div>
                  <div className="top-list__item__label" style={{ width }}>
                    {label}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </SizeObserver>
    </div>
  );
};

export default TopList;
