import {
  sci,
  toHex,
  toHex0x,
  toPercent,
  toPercentUnit,
} from './arithmetic-formatters';
import {
  binaryPrefix,
  locale,
  scaledUnits,
  SIPrefix,
  stringFormater,
  toFixedUnit,
} from './symbol-utils';
import {
  toDays,
  toHours,
  toMilliSeconds,
  toMinutes,
  toSeconds,
} from './time-utils';
import { ValueFormatCategory, ValueFormat } from './types';

export const getUnitCategories = (): ValueFormatCategory[] => [
  {
    name: 'Misc',
    formats: [
      { name: 'Number', id: 'none', fn: toFixedUnit('') },
      { name: 'String', id: 'string', fn: stringFormater },
      {
        name: 'short',
        id: 'short',
        fn: scaledUnits(1000, [
          '',
          ' K',
          ' Mil',
          ' Bil',
          ' Tri',
          ' Quadr',
          ' Quint',
          ' Sext',
          ' Sept',
        ]),
      },
      { name: 'Percent (0-100)', id: 'percent', fn: toPercent },
      { name: 'Percent (0.0-1.0)', id: 'percentunit', fn: toPercentUnit },
      { name: 'Humidity (%H)', id: 'humidity', fn: toFixedUnit('%H') },
      { name: 'Decibel', id: 'dB', fn: toFixedUnit('dB') },
      { name: 'Hexadecimal (0x)', id: 'hex0x', fn: toHex0x },
      { name: 'Hexadecimal', id: 'hex', fn: toHex },
      { name: 'Scientific notation', id: 'sci', fn: sci },
      { name: 'Locale format', id: 'locale', fn: locale },
      { name: 'Pixels', id: 'pixel', fn: toFixedUnit('px') },
    ],
  },
  {
    name: 'Data',
    formats: [
      { name: 'bytes(IEC)', id: 'bytes', fn: binaryPrefix('B') },
      { name: 'bytes(SI)', id: 'decbytes', fn: SIPrefix('B') },
      { name: 'bits(IEC)', id: 'bits', fn: binaryPrefix('b') },
      { name: 'bits(SI)', id: 'decbits', fn: SIPrefix('b') },
      { name: 'kibibytes', id: 'kbytes', fn: binaryPrefix('B', 1) },
      { name: 'kilobytes', id: 'deckbytes', fn: SIPrefix('B', 1) },
      { name: 'mebibytes', id: 'mbytes', fn: binaryPrefix('B', 2) },
      { name: 'megabytes', id: 'decmbytes', fn: SIPrefix('B', 2) },
      { name: 'gibibytes', id: 'gbytes', fn: binaryPrefix('B', 3) },
      { name: 'gigabytes', id: 'decgbytes', fn: SIPrefix('B', 3) },
      { name: 'tebibytes', id: 'tbytes', fn: binaryPrefix('B', 4) },
      { name: 'terabytes', id: 'dectbytes', fn: SIPrefix('B', 4) },
      { name: 'pebibytes', id: 'pbytes', fn: binaryPrefix('B', 5) },
      { name: 'petabytes', id: 'decpbytes', fn: SIPrefix('B', 5) },
    ],
  },
  {
    name: 'Data rate',
    formats: [
      { name: 'packets/sec', id: 'pps', fn: SIPrefix('p/s') },
      { name: 'bytes/sec(IEC)', id: 'binBps', fn: binaryPrefix('B/s') },
      { name: 'bytes/sec(SI)', id: 'Bps', fn: SIPrefix('B/s') },
      { name: 'bits/sec(IEC)', id: 'binbps', fn: binaryPrefix('b/s') },
      { name: 'bits/sec(SI)', id: 'bps', fn: SIPrefix('b/s') },
      { name: 'kibibytes/sec', id: 'KiBs', fn: binaryPrefix('B/s', 1) },
      { name: 'kibibits/sec', id: 'Kibits', fn: binaryPrefix('b/s', 1) },
      { name: 'kilobytes/sec', id: 'KBs', fn: SIPrefix('B/s', 1) },
      { name: 'kilobits/sec', id: 'Kbits', fn: SIPrefix('b/s', 1) },
      { name: 'mebibytes/sec', id: 'MiBs', fn: binaryPrefix('B/s', 2) },
      { name: 'mebibits/sec', id: 'Mibits', fn: binaryPrefix('b/s', 2) },
      { name: 'megabytes/sec', id: 'MBs', fn: SIPrefix('B/s', 2) },
      { name: 'megabits/sec', id: 'Mbits', fn: SIPrefix('b/s', 2) },
      { name: 'gibibytes/sec', id: 'GiBs', fn: binaryPrefix('B/s', 3) },
      { name: 'gibibits/sec', id: 'Gibits', fn: binaryPrefix('b/s', 3) },
      { name: 'gigabytes/sec', id: 'GBs', fn: SIPrefix('B/s', 3) },
      { name: 'gigabits/sec', id: 'Gbits', fn: SIPrefix('b/s', 3) },
      { name: 'tebibytes/sec', id: 'TiBs', fn: binaryPrefix('B/s', 4) },
      { name: 'tebibits/sec', id: 'Tibits', fn: binaryPrefix('b/s', 4) },
      { name: 'terabytes/sec', id: 'TBs', fn: SIPrefix('B/s', 4) },
      { name: 'terabits/sec', id: 'Tbits', fn: SIPrefix('b/s', 4) },
      { name: 'pebibytes/sec', id: 'PiBs', fn: binaryPrefix('B/s', 5) },
      { name: 'pebibits/sec', id: 'Pibits', fn: binaryPrefix('b/s', 5) },
      { name: 'petabytes/sec', id: 'PBs', fn: SIPrefix('B/s', 5) },
      { name: 'petabits/sec', id: 'Pbits', fn: SIPrefix('b/s', 5) },
    ],
  },
  {
    name: 'Time',
    formats: [
      { name: 'Hertz (1/s)', id: 'hertz', fn: SIPrefix('Hz') },
      { name: 'milliseconds (ms)', id: 'ms', fn: toMilliSeconds },
      { name: 'seconds (s)', id: 's', fn: toSeconds },
      { name: 'minutes (m)', id: 'm', fn: toMinutes },
      { name: 'hours (h)', id: 'h', fn: toHours },
      { name: 'days (d)', id: 'd', fn: toDays },
    ],
  },
];

export const findUnitCategoryFormatById = (
  id: string,
): ValueFormat | undefined => {
  for (const category of getUnitCategories()) {
    for (const format of category.formats) {
      if (format.id === id) {
        return format;
      }
    }
  }
  return undefined;
};
