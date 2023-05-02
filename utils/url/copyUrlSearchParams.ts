const copyUrlSearchParams = (urlSearchParams: URLSearchParams) => {
  const nextUrlSearchParams = new URLSearchParams();
  for (const key of urlSearchParams.keys()) {
    const value = urlSearchParams.get(key);
    if (value) {
      nextUrlSearchParams.set(key, value);
    }
  }

  return nextUrlSearchParams;
};

export default copyUrlSearchParams;
