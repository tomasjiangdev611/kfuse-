import classnames from 'classnames';
import { useMap, useToggle } from 'hooks';
import React, { useLayoutEffect, useRef } from 'react';
import { ChartJsData, ChartLegendTableColumn } from 'types';
import ChartGridItemLegendCompact from './ChartGridItemLegendCompact';
import ChartGridItemLegendTable from './ChartGridItemLegendTable';

type Props = {
  colorMap: { [key: string]: string };
  data: ChartJsData[];
  deselectedKeysMap: ReturnType<typeof useMap>;
  keys: string[];
  legendRows: any[];
  legendTableColumns: ChartLegendTableColumn[];
  showCompactLegend?: boolean;
};

const ChartGridItemLegend = ({
  colorMap,
  data,
  deselectedKeysMap,
  keys,
  legendRows,
  legendTableColumns,
  showCompactLegend,
}: Props) => {
  const isOverflowingToggle = useToggle();
  const ref = useRef();
  const showingMoreToggle = useToggle();

  const toggleKey = (key: string) => {
    const isDeselected = Boolean(key in deselectedKeysMap.state);
    if (isDeselected) {
      deselectedKeysMap.remove(key);
    } else {
      deselectedKeysMap.add(key, 1);
    }
  };

  useLayoutEffect(() => {
    const element = ref.current;
    if (element) {
      const { offsetHeight, offsetWidth, scrollHeight, scrollWidth } = element;
      const isOverflowing =
        offsetHeight < scrollHeight || offsetWidth < scrollWidth;
      if (isOverflowing) {
        isOverflowingToggle.on();
      } else {
        isOverflowingToggle.off();
      }
    }
  }, []);

  return (
    <div className="chart-grid__item__legend">
      <div
        className={classnames({
          'chart-grid__item__legend__items': true,
          'chart-grid__item__legend__items--show-more': showingMoreToggle.value,
        })}
        ref={ref}
      >
        {showCompactLegend ? (
          <ChartGridItemLegendCompact
            colorMap={colorMap}
            data={data}
            deselectedKeysMap={deselectedKeysMap}
            keys={keys}
            toggleKey={toggleKey}
          />
        ) : (
          <ChartGridItemLegendTable
            colorMap={colorMap}
            data={data}
            deselectedKeysMap={deselectedKeysMap}
            keys={keys}
            legendRows={legendRows}
            legendTableColumns={legendTableColumns}
            toggleKey={toggleKey}
          />
        )}
      </div>
      {isOverflowingToggle.value ? (
        <div className="chart-grid__item__legend__show-more">
          <button className="link" onClick={showingMoreToggle.toggle}>
            {showingMoreToggle.value ? 'Show less' : 'Show more'}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default ChartGridItemLegend;
