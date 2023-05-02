import classnames from 'classnames';
import { useToggle } from 'hooks';
import React, { useLayoutEffect, useRef } from 'react';

type Props = {
  colorMap: { [key: string]: string };
  keys: string[];
};

const ChartGridItemLegend = ({ colorMap, keys }: Props) => {
  const isOverflowingToggle = useToggle();
  const ref = useRef();
  const showingMoreToggle = useToggle();

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
        {keys.map((key) => (
          <div className="chart-grid__item__legend__item" key={key}>
            <div
              className="chart-grid__item__legend__item__color"
              style={{ backgroundColor: colorMap[key] || '#26BBF0' }}
            />
            <div className="chart-grid__item__legend__item__label">{key}</div>
          </div>
        ))}
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
