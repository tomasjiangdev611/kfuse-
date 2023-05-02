export const checkFingerPrintExists = (filterOrExcludeByFingerprint: {
  [key: string]: number;
}): boolean => {
  const entriesWithFilter = Object.values(filterOrExcludeByFingerprint).filter(
    (value) => Boolean(value),
  );

  return Boolean(entriesWithFilter.length);
};
