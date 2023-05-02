import {
  ChartRenderer,
  Loader,
  TooltipTrigger,
  useThemeContext,
} from 'components';
import { useToggle } from 'hooks';
import React, { ReactElement, useEffect, useState } from 'react';
import { MdLegendToggle } from 'react-icons/md';
import ResizeObserver from 'rc-resize-observer';
import Uplot from 'uplot';
import { convertNumberToReadableUnit, getOperatorSign } from 'utils';

import classNames from 'classnames';
import { DateSelection, MetricsQueriesDataProps } from 'types';

const AlertChartRightToolbar = ({
  isActive,
  onClick,
}: {
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="new-metrics__chart__right-toolbar__icon" onClick={onClick}>
      <TooltipTrigger tooltip={`${isActive ? 'Hide' : 'Show'} Legends`}>
        <MdLegendToggle />
      </TooltipTrigger>
    </div>
  );
};

const AlertsDetailsCharts = ({
  conditionOperator,
  conditionValue,
  date,
  isLoading,
  queryData,
}: {
  conditionOperator: string;
  conditionValue: number;
  date?: DateSelection;
  isLoading: boolean;
  queryData: MetricsQueriesDataProps['query_1']['data'];
}): ReactElement => {
  const { darkModeEnabled } = useThemeContext();
  const legendToggle = useToggle(false);
  const [chartWidth, setChartWidth] = useState(1000);
  const [chartData, setChartData] =
    useState<MetricsQueriesDataProps['query_1']['data']>(null);

  const drawEvalLine = (u: Uplot, seriesIndex: number) => {
    if (seriesIndex > 1 || conditionValue === undefined || conditionValue < 0) {
      return;
    }

    const ctx = u.ctx;
    ctx.save();

    const [bottom, left] = u.axes;
    const TOTAL_HEIGHT = 300 * 2;
    const PADDING = {
      LEFT: (left._size * 2) as number,
      BOTTOM: (bottom._size * 2) as number,
      RIGHT: 40,
      TOP: 30,
    };
    const TOTAL_WIDTH = chartWidth * 2 - PADDING.LEFT - PADDING.RIGHT;
    const yPos = Math.max(u.valToPos(conditionValue, 'y'), PADDING.TOP / 2) * 2;
    const Y = Math.min(yPos, TOTAL_HEIGHT - PADDING.BOTTOM - PADDING.TOP);
    const X = chartWidth * 2 - PADDING.RIGHT;
    const FILL_HEIGHT = TOTAL_HEIGHT - Y;

    // draw dotted line
    ctx.beginPath();
    ctx.strokeStyle = '#fa6c7c';
    ctx.setLineDash([20, 20]);
    ctx.moveTo(PADDING.LEFT, Y + PADDING.TOP);
    ctx.lineTo(X, Y + PADDING.TOP);
    ctx.stroke();

    // fill up/down based on condition
    if (conditionValue && conditionValue > 0) {
      if (conditionOperator === 'gt') {
        ctx.rect(PADDING.LEFT, PADDING.TOP, TOTAL_WIDTH, Y);
      }
      if (conditionOperator === 'lt') {
        ctx.rect(
          PADDING.LEFT,
          Y + PADDING.TOP,
          TOTAL_WIDTH,
          FILL_HEIGHT - PADDING.BOTTOM - PADDING.TOP,
        );
      }
    } else {
      ctx.rect(PADDING.LEFT, Y, 0, FILL_HEIGHT);
    }
    ctx.fillStyle = darkModeEnabled
      ? 'rgba(77, 0, 7, 0.3)'
      : 'rgba(253, 134, 148, 0.3)';
    ctx.fill();

    // write text on top right corner
    ctx.font = 'bold 22pt Roboto';
    ctx.fillStyle = '#fa6c7c';
    ctx.fillText(
      `${getOperatorSign(conditionOperator)} ${convertNumberToReadableUnit(
        conditionValue || 0,
      )}`,
      PADDING.LEFT + TOTAL_WIDTH - 16,
      50,
    );

    ctx.restore();
  };

  useEffect(() => {
    if (queryData?.data) {
      setChartData({ ...queryData });
    }
  }, [conditionOperator, conditionValue, chartWidth, queryData]);

  return (
    <>
      <Loader
        className={classNames({
          alerts__chart__container: true,
          'alerts__chart__container--placeholder': isLoading,
        })}
        isLoading={isLoading}
      >
        <ResizeObserver onResize={(size) => setChartWidth(size.width)}>
          <ChartRenderer
            bands={queryData?.bands || []}
            unit="number"
            chartTypes={['Line']}
            date={date || null}
            chartData={chartData || { data: [], series: [] }}
            hooks={[{ hook: drawEvalLine, type: 'drawSeries' }]}
            isLoading={false}
            legend={{ legendType: legendToggle.value ? 'values' : 'none' }}
            size={{ height: 300, width: chartWidth }}
            styles={{ boxShadow: false }}
            toolbar={{
              rightToolbar: (
                <AlertChartRightToolbar
                  isActive={legendToggle.value}
                  onClick={() => legendToggle.toggle()}
                />
              ),
            }}
          />
        </ResizeObserver>
      </Loader>
    </>
  );
};

export default AlertsDetailsCharts;
