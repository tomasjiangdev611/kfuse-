export const getDashboardName = (dashboard: string): string => {
  if (dashboard === 'overview') {
    return 'Kloudfuse Overview';
  }

  if (dashboard === 'hawkeye') {
    return 'HawkEye-knight-scores-anomalies';
  }

  return dashboard.charAt(0).toUpperCase() + dashboard.slice(1);
};
