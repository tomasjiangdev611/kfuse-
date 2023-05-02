import { chartingPalette } from 'constants';
import { useRequest } from 'hooks';
import { useEffect } from 'react';
import { traceColorsByServiceName } from 'requests';

const useColorsByServiceName = (date: DateSelection) => {
  const serviceNamesRequest = useRequest((args) =>
    traceColorsByServiceName(args).then((result) =>
      result.map((valueCount) => valueCount.value),
    ),
  );

  const serviceNames = serviceNamesRequest.result || [];
  const colorsByServiceName = serviceNames.reduce(
    (obj, s, i) => ({
      ...obj,
      [s]: chartingPalette[i % chartingPalette.length],
    }),
    {},
  );

  useEffect(() => {
    serviceNamesRequest.call(date);
  }, [date]);

  return colorsByServiceName;
};

export default useColorsByServiceName;
