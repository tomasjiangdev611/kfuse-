const escapePeriod = (s: string) => s.replace(/\./g, '\\\\.');

export default escapePeriod;
