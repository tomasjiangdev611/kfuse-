import classnames from 'classnames';
import { SquareWithLabel } from 'components';
import { useMap } from 'hooks';
import React from 'react';
import { ChartJsData } from 'types';

type Props = {
  colorMap: { [key: string]: string };
  data: ChartJsData[];
  deselectedKeysMap: ReturnType<typeof useMap>;
  keys: string[];
  toggleKey: (key: string) => void;
};

const ChartGridItemLegendTableCompact = ({
  colorMap,
  data,
  deselectedKeysMap,
  keys,
  toggleKey,
}: Props) => {
  const onClickHandler = (key) => () => {
    toggleKey(key);
  };

  return (
    <div className="chart-grid__item__legend__compact">
      {keys.map((key) => (
        <div
          className={classnames({
            'chart-grid__item__legend__compact__item': true,
            'chart-grid__item__legend__compact__item--deselected':
              deselectedKeysMap.state[key],
          })}
          key={key}
          onClick={onClickHandler(key)}
        >
          <SquareWithLabel color={colorMap[key]} label={key} />
        </div>
      ))}
    </div>
  );
};

export default ChartGridItemLegendTableCompact;
