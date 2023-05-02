import { Fingerprint, LogEvent } from './generated';

export type FingerprintWithLogSample = Fingerprint & {
  logSample?: LogEvent;
};
