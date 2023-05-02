import classnames from 'classnames';
import { TooltipTrigger, TooltipPosition } from 'components';
import { useRequest } from 'hooks';
import React, { useEffect } from 'react';
import { AiOutlineBarChart } from 'react-icons/ai';
import { getSpanMetrics } from 'requests';
import { Span } from 'types';
import { formatDurationNs } from 'utils';

type Props = {
  label: string;
  span: Span;
};

const TraceSidebarLatencyTooltip = ({ label, span }: Props) => {
  const { latency, serviceName, name } = span;
  const getSpanMetricsRequest = useRequest(getSpanMetrics);

  useEffect(() => {
    getSpanMetricsRequest.call({
      latencyNs: latency,
      serviceName,
      spanName: name,
    });
  }, []);

  const spanMetrics = getSpanMetricsRequest.result || null;
  if (!spanMetrics) {
    return (
      <div className="trace-sidebar__time__pvalue">
        <div className="status-tag status-tag--hoverable">
          {'-'}
          <div className="status-tag__icon">
            <AiOutlineBarChart size={13} />
          </div>
        </div>
      </div>
    );
  }

  const { spanDurationRank } = spanMetrics;
  const percentileSummary = spanMetrics.spanDurationPercentiles;
  const pLabels = Object.keys(percentileSummary)
    .filter((pLabel) => pLabel.startsWith('p'))
    .sort((a, b) => b.localeCompare(a));

  const latencyPercentile = spanDurationRank
    ? Math.round(spanDurationRank * 100)
    : 0;

  return (
    <TooltipTrigger
      className="trace-sidebar__time__pvalue tooltip-trigger--altBg"
      position={TooltipPosition.BOTTOM_RIGHT}
      tooltip={
        <div className="trace-sidebar__latency__tooltip">
          <div className="trace-sidebar__latency__tooltip__header">
            {`This ${label} duration is `}
            <span className="text--green text--weight-bold">{`p${latencyPercentile}`}</span>
            {` out of the distribution of this resource`}
          </div>
          <div className="trace-sidebar__latency__tooltip__pvalues">
            <div className="trace-sidebar__latency__tooltip__pvalues__item">
              <div className="trace-sidebar__latency__tooltip__pvalues__item__label">
                Max
              </div>
              <div className="trace-sidebar__latency__tooltip__pvalues__item__value">
                {formatDurationNs(percentileSummary.max)}
              </div>
            </div>
            {latencyPercentile === 100 ? (
              <div className="trace-sidebar__latency__tooltip__pvalues__item trace-sidebar__latency__tooltip__pvalues__item--active">
                <div className="trace-sidebar__latency__tooltip__pvalues__item__label">
                  {`p${latencyPercentile}`}
                </div>
                <div className="trace-sidebar__latency__tooltip__pvalues__item__value">
                  {`(This ${label}) ${formatDurationNs(latency)}`}
                </div>
              </div>
            ) : null}
            {pLabels.map((pLabel: string, i) => {
              const pValue = Number(pLabel.slice(1));
              const isSpanPLabel = pValue === latencyPercentile;

              const nextPValue =
                i < pLabels.length - 1 ? Number(pLabels[i + 1].slice(1)) : null;

              const isAfter =
                (typeof nextPValue === 'number' &&
                  latencyPercentile < pValue &&
                  latencyPercentile > nextPValue) ||
                (i === pLabels.length - 1 && latencyPercentile < pValue);

              return (
                <>
                  <div
                    className={classnames({
                      'trace-sidebar__latency__tooltip__pvalues__item': true,
                      'trace-sidebar__latency__tooltip__pvalues__item--active':
                        isSpanPLabel,
                    })}
                    key={pLabel}
                  >
                    <div className="trace-sidebar__latency__tooltip__pvalues__item__label">
                      {pLabel}
                    </div>
                    <div className="trace-sidebar__latency__tooltip__pvalues__item__value">
                      {isSpanPLabel ? `(This ${label}) ` : ''}
                      {isSpanPLabel
                        ? formatDurationNs(latency)
                        : formatDurationNs(percentileSummary[pLabel])}
                    </div>
                  </div>
                  {isAfter ? (
                    <div className="trace-sidebar__latency__tooltip__pvalues__item trace-sidebar__latency__tooltip__pvalues__item--active">
                      <div className="trace-sidebar__latency__tooltip__pvalues__item__label">
                        {`p${latencyPercentile}`}
                      </div>
                      <div className="trace-sidebar__latency__tooltip__pvalues__item__value">
                        {`(This ${label}) ${formatDurationNs(latency)}`}
                      </div>
                    </div>
                  ) : null}
                </>
              );
            })}
          </div>
        </div>
      }
    >
      <div className="status-tag status-tag--hoverable">
        {`p${latencyPercentile}`}
        <div className="status-tag__icon">
          <AiOutlineBarChart size={13} />
        </div>
      </div>
    </TooltipTrigger>
  );
};

export default TraceSidebarLatencyTooltip;
