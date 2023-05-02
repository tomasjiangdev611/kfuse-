import dayjs from 'dayjs';

/**
 * find the max value in the matrix
 * [
 *  ['1', '3', '10', '1.2121'],
 *  ['2', '4', '20', '2.2121'],
 *  ['3', '5', '30', '3.2121'],
 * ]
 * result: 30
 * @param matrix
 * @returns max value
 */
export function findMaxValueInMatrix(matrix: string[][]): number {
  let max = 0;
  matrix.forEach((row) => {
    row.forEach((value) => {
      const num = Number(value);
      if (num > max) {
        max = num;
      }
    });
  });
  return max;
}

/**
 * Split number into array
 * @param num
 * @count number of times to split
 * example: splitNumberIntoArray(1, 5) => [0.2, 0.4, 0.6, 0.8, 1]
 */
export function splitNumber(count: number, num: number): string[] {
  const result = [];
  const step = num / count;
  for (let i = 1; i <= count; i++) {
    result.push((step * i).toFixed(2));
  }
  return result;
}

/**
 * Convert an array of numbers to min and max 2D array
 * @param nums
 * example: convertArrayToMinMaxArray([1, 2, 3, 4, 5]) => [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]]
 * start from 0
 */
export const convertArrayToMinMaxArray = (nums: string[]): number[][] => {
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    result.push([i, Number(nums[i])]);
  }
  return result;
};

const findNumberInBucket = (num: number, buckets: number[][]): number => {
  for (let i = 0; i < buckets.length; i++) {
    if (num > buckets[i][0] && num <= buckets[i][1]) {
      return buckets[i][1];
    }
  }
};

/**
 * Bucketize the data
 * @param data
 * @param buckets
 * @returns [{time: number, bucket: number, count: number}]
 * example -> [
 *  [1,2,3,4],
 *  [2,5,1,3],
 *  [3,1,2,4],
 *  [4,3,1,2],
 *  [undefined, undefined, undefined, 2],
 * ]
 * buckets: [[0, 2], [2, 4], [4, 6]]
 * time: [12:00, 12:10, 12:20, 12:30]
 * result: [
 *    {time: 12:00, bucket: 0, count: 2}, // 1,2
 *    {time: 12:00, bucket: 1, count: 2}, // 3,4
 *    {time: 12:10, bucket: 0, count: 1}, // 1,2
 *    {time: 12:10, bucket: 1, count: 2}, // 3
 *    {time: 12:10, bucket: 2, count: 1}, // 4
 *    {time: 12:20, bucket: 0, count: 3}, // 1,2,1
 *    {time: 12:20, bucket: 1, count: 1}, // 3
 *    {time: 12:30, bucket: 0, count: 2}, // 2,2
 *    {time: 12:30, bucket: 1, count: 3}, // 4,3,4
 * ]
 * Find how many times a value is in a bucket vertically
 * size of time and data should be the same
 * exclude undefined
 */

export function bucketizeData(
  data: string[][],
  buckets: number[][],
  times: string[],
): {
  maxCount: number;
  bucketData: { time: string; bucket: string; count: number }[];
} {
  const result: any = [];
  let maxCount = 0;

  const ROW_SIZE = data.length;
  const COL_SIZE = data[0].length;

  // loop through each column
  for (let i = 0; i < COL_SIZE; i++) {
    // loop through each row
    const timeBitmap: { [key: string]: number } = {};
    for (let j = 0; j < ROW_SIZE; j++) {
      const value = data[j][i];
      if (value === undefined) {
        continue;
      }
      const valueNum = Number(value);
      const time = times[i];
      const bucket = findNumberInBucket(valueNum, buckets);
      const bitmapKey = `${time}-${bucket}`;
      if (timeBitmap[bitmapKey]) {
        timeBitmap[bitmapKey] += 1;
      } else {
        timeBitmap[bitmapKey] = 1;
      }
    }
    Object.keys(timeBitmap).forEach((key) => {
      const [time, bucket] = key.split('-');
      maxCount = Math.max(maxCount, timeBitmap[key]);
      result.push({
        time,
        bucket: Number(bucket).toFixed(2),
        count: timeBitmap[key],
      });
    });
  }
  return { bucketData: result, maxCount };
}

/**
 * Return the time
 * @param timestamps
 * @returns
 * return only 10 item and fill the rest with null
 */

export const convertTimeForHeatmap = (timestamps: number[]): string[] => {
  const interval = Math.ceil(timestamps.length / 10);

  const firstTimestamp = timestamps[0];
  const lastTimestamp = timestamps[timestamps.length - 1];
  const timeDiff = lastTimestamp - firstTimestamp;

  return timestamps.map((timestamp, idx) => {
    if (idx % interval !== 0) {
      return null;
    }
    const time = dayjs.unix(timestamp);
    // less than 1 hour
    if (timeDiff < 60 * 60) {
      return time.format('HH:mm');
    }

    // less than 1 day
    if (timeDiff < 60 * 60 * 24) {
      return time.format('HH:mm');
    }

    // less than 10 days
    if (timeDiff < 60 * 60 * 24 * 10 && time.format('HH:mm') !== '00:00') {
      return time.format('HH:mm');
    }

    return time.format('MMM D');
  });
};
