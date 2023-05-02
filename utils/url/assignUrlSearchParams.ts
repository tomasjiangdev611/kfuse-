const assignUrlSearchParams = (
  urlSearchParams: URLSearchParams,
): URLSearchParams => {
  const nextUrlSearchParams = new URLSearchParams();

  urlSearchParams.forEach((value, key) => {
    nextUrlSearchParams.set(key, value);
  });

  return nextUrlSearchParams;
};

export default assignUrlSearchParams;
