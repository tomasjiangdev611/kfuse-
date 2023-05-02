const pickUrlSearchParamsByKeys = (
  urlSearchParams: URLSearchParams,
  keys: string[],
): string => {
  const nextUrlSearchParams = new URLSearchParams();

  if (!urlSearchParams) return '';
  keys.forEach((key) => {
    const value = urlSearchParams.get(key);
    if (value) {
      nextUrlSearchParams.set(key, value);
    }
  });

  const nextUrlSearchParamsString = nextUrlSearchParams.toString();
  return nextUrlSearchParamsString ? `?${nextUrlSearchParamsString}` : '';
};

export default pickUrlSearchParamsByKeys;
