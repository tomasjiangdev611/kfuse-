const formatLatencyYAxisTick = (n: number) => {
  if (n >= 1000) {
    if (n % 1) {
      return `${Math.round(n / 1000)}s`
    }

    return `${(n / 1000).toFixed(1)}s`;
  }

  return `${n}ms`;
}

export default formatLatencyYAxisTick;
