import { bytesToSize, durationToSize } from './axis-formatting';

describe('bytesToSize', () => {
  it('bytes to size', () => {
    expect(bytesToSize(1)).toEqual('1 Byte');
    expect(bytesToSize(4)).toEqual('4 Byte');
    expect(bytesToSize(1024)).toEqual('1 KB');
    expect(bytesToSize(8794)).toEqual('9 KB');
    expect(bytesToSize(1024 * 1024)).toEqual('1 MB');
    expect(bytesToSize(1024 * 1024 * 1024)).toEqual('1 GB');
  });
});

describe('durationToSize', () => {
  it('millisecond to duration', () => {
    expect(durationToSize(0.0001)).toEqual('0.0001s');
    expect(durationToSize(1)).toEqual('1s');
    expect(durationToSize(1 * 60)).toEqual('1m');
    expect(durationToSize(1 * 60 * 3)).toEqual('3m');
    expect(durationToSize(1 * 60 * 60)).toEqual('1h');
    expect(durationToSize(1 * 60 * 60 * 24)).toEqual('1d');
    expect(durationToSize(1 * 60 * 60 * 24 * 7)).toEqual('1w');
    expect(durationToSize(1 * 60 * 60 * 24 * 7 * 30)).toEqual('1mo');
  });
});
