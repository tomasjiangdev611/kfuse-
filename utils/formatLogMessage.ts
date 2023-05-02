const formatLogMessage = (s: string): string => {
  const regex = /\\n|\\r\\n|\\n\\r|\\r/g;
  return s.replace(regex, '\n');
};

export default formatLogMessage;
