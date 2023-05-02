const getLinkKey = (link) => {
  const parentServiceName = link.source?.data?.id;
  const serviceName = link.target?.data?.id;
  return `${parentServiceName}-${serviceName}`;
};

export default getLinkKey;
