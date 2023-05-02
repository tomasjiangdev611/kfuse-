const getPrometheusValues = (values: any[]) => {
  if (values.length) {
    const lastValue = Number(values[values.length - 1]);
    if (isNaN(lastValue)) {
      return values.slice(0, values.length - 1);
    }
  }

  return values;
};

export default getPrometheusValues;
