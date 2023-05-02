import dayjs from 'dayjs';
import { useRequest } from 'hooks';
import { useRef, useState } from 'react';
import { getEntitiesWithAttributes } from 'requests';
import { clamp } from 'utils';
import { colorScale } from './constants';

const filterResult = (result, search) => {
  const searchLowered = search.trim().toLowerCase();
  if (!searchLowered) {
    return result;
  }

  return Object.keys(result)
    .filter((id) => result[id]?.base.metadata.name.indexOf(searchLowered) > -1)
    .reduce((obj, id) => ({ ...obj, [id]: result[id] }), {});
};

const getColor = (n: number) => {
  for (let i = colorScale.length - 1; i > 0; i -= 1) {
    if (n >= i) {
      return colorScale[i];
    }
  }

  return colorScale[0];
};

const getColors = (hexbinData, seekbarData, seekbarValue) => {
  const indexByKrn = hexbinData.reduce(
    (obj, entity, i) => ({ ...obj, [entity.krn]: i }),
    {},
  );

  if (seekbarData[seekbarValue]) {
    return Object.keys(seekbarData[seekbarValue]).reduce(
      (obj, krn) => ({
        ...obj,
        [indexByKrn[krn]]: getColor(
          Object.keys(seekbarData[seekbarValue][krn]).length,
        ),
      }),
      {},
    );
  }

  return {};
};

const getSeekbarData = (entitiesWithAttributes, step, startTimeUnix) => {
  const result = {};
  Object.keys(entitiesWithAttributes).forEach((krn) => {
    Object.keys(entitiesWithAttributes[krn])
      .filter((timestamp) => timestamp !== 'base')
      .forEach((timestamp) => {
        const unixTimestamp = dayjs(timestamp).unix();
        const unixTimestampBucket =
          Math.floor((unixTimestamp - startTimeUnix) / step) * step;
        const change = entitiesWithAttributes[krn][timestamp];

        if (!result[unixTimestampBucket]) {
          result[unixTimestampBucket] = {};
        }

        if (!result[unixTimestampBucket][krn]) {
          result[unixTimestampBucket][krn] = [];
        }

        result[unixTimestampBucket][krn].push({
          change,
        });
      });
  });

  return result;
};

const getHexbinData = (entitiesWithAttributes: any): any[] => {
  return Object.keys(entitiesWithAttributes).map((krn) => ({
    krn,
    ...entitiesWithAttributes[krn].base,
  }));
};

const getTooltip = (startTimeUnix, seekbarValue) => {
  const startTime = dayjs.unix(startTimeUnix);
  const seekbarTime = startTime.add(seekbarValue, 'seconds');
  return seekbarTime.format('MMMM D, YYYY h:mm a');
};

const useTopology = () => {
  const step = 300;
  const [activeIndex, setActiveIndex] = useState(null);
  const [date, setDate] = useState({
    preset: null,
    endTimeUnix: dayjs('2021-09-25T00:00:00Z').unix(),
    startTimeUnix: dayjs('2021-09-25T00:00:00Z')
      .subtract(10000, 'seconds')
      .unix(),
  });
  const [entityType, setEntityType] = useState('Pod');
  const intervalRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [search, setSearch] = useState('');
  const [seekbarValue, setSeekbarValue] = useState(0);

  const durationSecs = date.endTimeUnix - date.startTimeUnix;

  const getEntitiesWithAttributesRequest = useRequest(
    getEntitiesWithAttributes,
  );

  const filteredResult = filterResult(
    getEntitiesWithAttributesRequest.result?.entitySnapshotDiffsByKrn || {},
    search,
  );

  const fetch = () => {
    getEntitiesWithAttributesRequest.call({
      entityType,
      startTimeUnix: date.startTimeUnix,
      endTimeUnix: date.endTimeUnix,
    });
  };

  const hexbinData = getHexbinData(filteredResult);

  const onChangeDate = (nextDate) => {
    setDate(nextDate);
    getEntitiesWithAttributesRequest.call({
      entityType,
      startTimeUnix: nextDate.startTimeUnix,
      endTimeUnix: nextDate.endTimeUnix,
    });
  };

  const onChangeEntityType = (nextEntityType: string) => {
    setEntityType(nextEntityType);
    setSearch('');
    getEntitiesWithAttributesRequest.call({
      entityType: nextEntityType,
      startTimeUnix: date.startTimeUnix,
      endTimeUnix: date.endTimeUnix,
    });
  };

  const next = () => {
    stop();
    setSeekbarValue((prevSeekbarValue: number) => {
      const times = Object.keys(seekbarData);
      for (let i = 0; i < times.length; i += 1) {
        const time = Number(times[i]);
        if (time > prevSeekbarValue) {
          return time;
        }
      }

      return prevSeekbarValue;
    });
  };

  const prev = () => {
    stop();
    setSeekbarValue((prevSeekbarValue: number) => {
      const times = Object.keys(seekbarData);
      for (let i = times.length; i >= 0; i -= 1) {
        const time = Number(times[i]);
        if (time < prevSeekbarValue) {
          return time;
        }
      }

      return prevSeekbarValue;
    });
  };

  const stop = () => {
    setIsPlaying(false);
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const play = () => {
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setSeekbarValue((prevSeekbarValue) => {
        const nextSeekbarValue = clamp(
          prevSeekbarValue + step,
          0,
          durationSecs,
        );

        if (nextSeekbarValue >= durationSecs) {
          stop();
        }

        return nextSeekbarValue;
      });
    }, 1000);
  };

  const seekbarData = getSeekbarData(filteredResult, step, date.startTimeUnix);

  const seekbarDots = Object.keys(seekbarData);

  const togglePlay = () => {
    if (!isPlaying) {
      play();
    } else {
      stop();
    }
  };

  return {
    activeIndex,
    colors: getColors(hexbinData || [], seekbarData, seekbarValue),
    date,
    durationSecs,
    entityType,
    entitySnapshotByTimeByKrn:
      getEntitiesWithAttributesRequest.result
        ?.entitySnapshotByTimeByKrn || {},
    fetch,
    hexbinData,
    isLoading: getEntitiesWithAttributesRequest.isLoading,
    isPlaying,
    onChangeEntityType,
    onChangeDate,
    next,
    prev,
    result: filteredResult,
    search,
    seekbarData,
    seekbarDots,
    seekbarValue,
    setActiveIndex,
    togglePlay,
    setSearch,
    setSeekbarValue,
    step,
    stop,
    tooltip: getTooltip(date.startTimeUnix, seekbarValue),
  };
};

export default useTopology;
