const readUrlSearchParams = (): URLSearchParams => {
  const search = window.location.href.split('?')[1] || '';
  return new URLSearchParams(`?${search}`);
};

export default readUrlSearchParams;
