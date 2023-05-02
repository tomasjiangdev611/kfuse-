import dayjs from 'dayjs';
import {
  convertTimeStringToUnix,
  validateDate,
  validateCodifiedDate,
} from './index';

describe('convertTimeStringToUnix', () => {
  it('should return a number', () => {
    const result = convertTimeStringToUnix('now-1h');
    expect(typeof result).toBe('number');
  });

  it('should return null', () => {
    const result = convertTimeStringToUnix('now-1h1s');
    expect(result).toBe(null);
  });

  it('should return 5 hours ago', () => {
    const result = convertTimeStringToUnix('now-5h');
    const fiveHoursAgo = dayjs().subtract(5, 'hour').unix();
    expect(result).toBe(fiveHoursAgo);
  });

  it('should return number 900s agos', () => {
    const result = convertTimeStringToUnix('now-900s');
    const nineHundred = dayjs().subtract(900, 'second').unix();
    expect(result).toBe(nineHundred);
  });
});

describe('validateCodifiedDate', () => {
  it('now-1h should return true', () => {
    const result = validateCodifiedDate('now-1h');
    expect(result).toBe(true);
  });

  it('now-1h1s should return false', () => {
    const result = validateCodifiedDate('now-1h1s');
    expect(result).toBe(false);
  });

  it('now-70m should return true', () => {
    const result = validateCodifiedDate('now-70m');
    expect(result).toBe(true);
  });

  it('now-1d should return true', () => {
    const result = validateCodifiedDate('now-1d');
    expect(result).toBe(true);
  });

  it('now-3w should return true', () => {
    const result = validateCodifiedDate('now-3w');
    expect(result).toBe(true);
  });

  it('now-1M should return true', () => {
    const result = validateCodifiedDate('now-1M');
    expect(result).toBe(true);
  });

  it('now-1y should return true', () => {
    const result = validateCodifiedDate('now-1y');
    expect(result).toBe(true);
  });
});

/**
 * Test for validateDate
 */
describe('validateDate', () => {
  it('should return true', () => {
    const result = validateDate('2020-01-01 00:00:00');
    expect(result).toBe(true);
  });

  it('should return false', () => {
    const result = validateDate('2020-01-01 00:00:00.001');
    expect(result).toBe(false);
  });

  it('missing hour should return false', () => {
    const result = validateDate('2020-01-01 :00:00');
    expect(result).toBe(false);
  });

  it('missing minute should return false', () => {
    const result = validateDate('2020-01-01 00: :00');
    expect(result).toBe(false);
  });

  it('Invalid year should return false', () => {
    const result = validateDate('202-01-01 12:00:00');
    expect(result).toBe(false);
  });
});
