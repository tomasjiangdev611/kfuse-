import {
  TooltipTrigger,
  TooltipPosition,
  useLeftSidebarState,
} from 'components';
import { Datepicker } from 'composite';
import React, { ReactElement } from 'react';
import { Maximize2, Play, Pause } from 'react-feather';
import { MdBarChart } from 'react-icons/md';
import { DateSelection, RequestResult } from 'types';

import { useLogsState, useLogsLiveTail } from './hooks';
import { LogsSearchBar, LogsSearchRefreshButton } from './LogsSearchBar';
import LogsTabs from './LogsTabs';

const LogsSearch = ({
  getFacetNamesRequest,
  leftSidebarState,
  logsLiveTail,
  logsState,
  showTimelineToggle,
}: {
  getFacetNamesRequest: RequestResult;
  leftSidebarState: ReturnType<typeof useLeftSidebarState>;
  logsLiveTail: ReturnType<typeof useLogsLiveTail>;
  logsState: ReturnType<typeof useLogsState>;
  showTimelineToggle: any;
}): ReactElement => {
  const {
    absoluteTimeRangeStorage,
    date,
    filterOrExcludeByFingerprint,
    filterByFacets,
    keyExists,
    searchTerms,
    selectedFacetValues,
    setabsoluteTimeRangeStorage,
    setDate,
  } = logsState;

  const { enableLiveTail, isEnabled, isPlaying, toggleLiveTail } = logsLiveTail;
  const onToggleLiveTailClick = () => {
    toggleLiveTail({
      date,
      filterOrExcludeByFingerprint,
      filterByFacets,
      keyExists,
      searchTerms,
      selectedFacetValues,
    });
  };

  const onDateChange = (nextDate: DateSelection) => {
    const { startTimeUnix, endTimeUnix, startLabel, endLabel } = nextDate;
    if (!startLabel && !endLabel) {
      setabsoluteTimeRangeStorage((preHistory) => {
        if (preHistory.length > 3) {
          preHistory.pop();
        }
        return [...[{ startTimeUnix, endTimeUnix }], ...preHistory];
      });
    }

    logsLiveTail.stopLiveTail();
    setDate(nextDate);
  };
  return (
    <div className="logs__search">
      <div className="logs__search__top">
        {!leftSidebarState.width ? (
          <TooltipTrigger
            className="logs__search__show-filters-button"
            position={TooltipPosition.TOP_LEFT}
            tooltip="Show Filters"
          >
            <button
              className="button button--icon"
              onClick={leftSidebarState.show}
            >
              <Maximize2 size={12} />
            </button>
          </TooltipTrigger>
        ) : null}
        <LogsSearchBar
          logsState={logsState}
          getFacetNamesRequest={getFacetNamesRequest}
        />
        <Datepicker
          absoluteTimeRangeStorage={absoluteTimeRangeStorage}
          className="logs__search__datepicker"
          hasStartedLiveTail={isEnabled}
          onChange={onDateChange}
          startLiveTail={enableLiveTail}
          value={date}
        />
        {isEnabled ? (
          <button
            className="logs__search__live-tail-button"
            onClick={onToggleLiveTailClick}
          >
            {isPlaying ? (
              <Pause
                className="logs__search__live-tail-button__icon"
                size={16}
              />
            ) : (
              <Play
                className="logs__search__live-tail-button__icon"
                size={16}
              />
            )}
          </button>
        ) : null}
        {!isEnabled ? <LogsSearchRefreshButton logsState={logsState} /> : null}
      </div>
      <div className="logs__search__bottom">
        <LogsTabs />
        <div className="logs__search__bottom__right">
          {!showTimelineToggle.value ? (
            <button
              className="button button--short"
              onClick={showTimelineToggle.on}
            >
              <div className="button__icon">
                <MdBarChart size={16} />
              </div>
              <div className="button__text">Show Timeline</div>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LogsSearch;
