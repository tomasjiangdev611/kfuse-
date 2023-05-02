import EnumDictionary from './EnumDictionary';

export enum SecondsFromNow {
  Last5Minutes = 'Last5Minutes',
  Last30Minutes = 'Last30Minutes',
  LastHour = 'LastHour',
  Last6Hours = 'Last6Hours',
  Last12Hours = 'Last12Hours',
  LastDay = 'LastDay',
  Last7Days = 'Last7Days',
}

export const SecondsFromNowValues: EnumDictionary<SecondsFromNow, number> = {
  [SecondsFromNow.Last5Minutes]: 60 * 5,
  [SecondsFromNow.Last30Minutes]: 60 * 30,
  [SecondsFromNow.LastHour]: 60 * 60,
  [SecondsFromNow.Last6Hours]: 60 * 60 * 6,
  [SecondsFromNow.Last12Hours]: 60 * 60 * 12,
  [SecondsFromNow.LastDay]: 60 * 60 * 24,
  [SecondsFromNow.Last7Days]: 60 * 60 * 24 * 7,
};

export const SecondsFromNowLabels: EnumDictionary<SecondsFromNow, string> = {
  [SecondsFromNow.Last5Minutes]: 'Last 5 minutes',
  [SecondsFromNow.Last30Minutes]: 'Last 30 minutes',
  [SecondsFromNow.LastHour]: 'Last Hour',
  [SecondsFromNow.Last6Hours]: 'Last 6 Hours',
  [SecondsFromNow.Last12Hours]: 'Last 12 Hours',
  [SecondsFromNow.LastDay]: 'Last Day',
  [SecondsFromNow.Last7Days]: 'Last 7 Days',
};

export const SecondsFromNowLabelsByValue = Object.keys(SecondsFromNow).reduce(
  (obj, secondsFromNow) => ({
    ...obj,
    [SecondsFromNowValues[secondsFromNow]]:
      SecondsFromNowLabels[secondsFromNow],
  }),
  {},
);
