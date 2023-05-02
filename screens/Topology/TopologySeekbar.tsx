import { Slider } from 'components';
import React from 'react';
import { Pause, Play, SkipBack, SkipForward } from 'react-feather';

const TopologySeekbar = ({ topology }) => {
  const {
    durationSecs,
    isPlaying,
    next,
    prev,
    seekbarDots,
    seekbarValue,
    setSeekbarValue,
    step,
    stop,
    togglePlay,
    tooltip,
  } = topology;

  return (
    <div className="topology__seekbar">
      <div className="topology__seekbar__slider">
        <Slider
          dots={seekbarDots}
          min={0}
          max={durationSecs}
          onChange={setSeekbarValue}
          onMouseDown={stop}
          step={step}
          tooltip={tooltip}
          value={seekbarValue}
        />
      </div>
      <div className="topology__seekbar__buttons">
        <button className="topology__seekbar__button" onClick={prev}>
          <SkipBack size={24} />
        </button>
        <button className="topology__seekbar__button" onClick={togglePlay}>
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button className="topology__seekbar__button" onClick={next}>
          <SkipForward size={24} />
        </button>
      </div>
    </div>
  );
};

export default TopologySeekbar;
