export type TimeZoneUtc = 'utc';
export type TimeZoneBrowser = 'browser';
export type TimeZone = TimeZoneBrowser | TimeZoneUtc | string;
export type DecimalCount = number | null | undefined;

export interface FormattedValue {
  text: string;
  prefix?: string;
  suffix?: string;
}

export type ValueFormatter = (
  value: number,
  decimals?: DecimalCount,
  scaledDecimals?: DecimalCount,
  timeZone?: TimeZone,
  showMs?: boolean,
) => FormattedValue;

export interface ValueFormat {
  name: string;
  id: string;
  fn: ValueFormatter;
}

export interface ValueFormatCategory {
  name: string;
  formats: ValueFormat[];
}

export interface ValueFormatterIndex {
  [id: string]: ValueFormatter;
}

export interface DecimalInfo {
  decimals: DecimalCount;
  scaledDecimals: DecimalCount;
}
