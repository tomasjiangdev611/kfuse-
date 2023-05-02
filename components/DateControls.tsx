import { useLiveTail } from 'hooks';
import React from 'react';
import { Play, Pause, RefreshCw } from 'react-feather';
import { DateSelection } from 'types';

type Props = {
  date: DateSelection;
  liveTail?: ReturnType<typeof useLiveTail>;
  setDate: (date: DateSelection) => void;
};

const DateControls = ({ date, liveTail, setDate }: Props) => {
  const isLiveTailEnabled = liveTail?.isEnabled;
  const isPlaying = liveTail?.isPlaying;
  const toggleLiveTail = liveTail?.toggleLiveTail || (() => {});

  const { endLabel } = date;
  const isRelativeTime = endLabel && endLabel.indexOf('now') === 0;
  const showRefreshButton = !isLiveTailEnabled && isRelativeTime;

  if (!isLiveTailEnabled && !showRefreshButton) {
    return null;
  }

  const onRefresh = () => {
    const { endTimeUnix, startTimeUnix } = date;
    const diffInSeconds = endTimeUnix - startTimeUnix;
    const nextEndTimeUnix = Math.floor(new Date().getTime() / 1000);
    const nextStartTimeUnix = nextEndTimeUnix - diffInSeconds;
    setDate({
      endLabel: 'now',
      endTimeUnix: nextEndTimeUnix,
      startLabel: `now-${Math.floor(diffInSeconds / 60)}m`,
      startTimeUnix: nextStartTimeUnix,
    });
  };

  return (
    <div className="date-controls">
      {isLiveTailEnabled ? (
        <button className="date-controls__button" onClick={toggleLiveTail}>
          {isPlaying ? (
            <Pause className="date-controls__button__icon" size={16} />
          ) : (
            <Play className="date-controls__button__icon" size={16} />
          )}
        </button>
      ) : null}
      {showRefreshButton ? (
        <button className="date-controls__button" onClick={onRefresh}>
          <RefreshCw size={16} />
        </button>
      ) : null}
    </div>
  );
};

export default DateControls;
