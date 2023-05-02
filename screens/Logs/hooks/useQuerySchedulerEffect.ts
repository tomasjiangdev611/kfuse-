import { useEffect, useRef } from 'react';

const useQuerySchedulerEffect = ({
  cb,
  logsState,
  queryScheduler,
  sort,
  tab,
}) => {
  const firstLoadRef = useRef<boolean>(false);
  const {
    date,
    filterByFacets,
    filterOrExcludeByFingerprint,
    keyExists,
    searchTerms,
    selectedFacetValues,
  } = logsState;

  useEffect(() => {
    if (firstLoadRef.current) {
      cb().finally(
        queryScheduler.setFirstQueryCompletedAt({ zoomHasBeenUpdated: false }),
      );
    }
  }, [
    date.startTimeUnix,
    date.endTimeUnix,
    filterByFacets,
    filterOrExcludeByFingerprint,
    keyExists,
    searchTerms,
    selectedFacetValues,
  ]);

  useEffect(() => {
    if (firstLoadRef.current) {
      cb().finally(
        queryScheduler.setFirstQueryCompletedAt({ zoomHasBeenUpdated: true }),
      );
    }
  }, [date.zoomedStartTimeUnix, date.zoomedEndTimeUnix]);

  useEffect(() => {
    if (firstLoadRef.current) {
      cb();
    }
  }, [sort]);

  useEffect(() => {
    firstLoadRef.current = true;
    cb().finally(
      queryScheduler.setFirstQueryCompletedAt({
        tab,
        zoomHasBeenUpdated: false,
      }),
    );
  }, []);
};

export default useQuerySchedulerEffect;
