export const getSelector = (row: any) => {
  const allSelectors = row?.spec?.selectors?.map((item) => {
    return `${item?.key}:${item?.Values?.map((element) => {
      return `${element} `;
    })}`;
  });

  if (allSelectors && allSelectors.length > 1) {
    if (Object.keys(allSelectors[0]).length > 25) {
      const obj = allSelectors[0];
      return obj.toString().substring(0, 25) + '...';
    } else {
      return allSelectors[0] + '...';
    }
  } else {
    return allSelectors;
  }
};

export const getRules = (row: any) => {
  const allRules = row?.rules?.map((element) => {
    return `${element?.verbs?.map((item) => {
      return `${item}`;
    })} ${element?.apiGroups?.map((item) => {
      return ` ${item}`;
    })} ${
      element?.resource
        ? element?.resource?.map((item) => {
            return `${item ? item : ''}`;
          })
        : ''
    } ${
      element?.resourceNames
        ? element?.resourceNames?.map((item) => {
            return `${item ? item : ''}`;
          })
        : ''
    }`;
  });

  if (allRules && allRules.length > 1) {
    if (Object.keys(allRules[0]).length > 25) {
      const obj = allRules[0];
      return obj.toString().substring(0, 25) + '...';
    } else {
      return allRules[0] + '...';
    }
  } else {
    return allRules;
  }
};

export const ingressRules = (row: any) => {
  const ingressRulesData = row?.spec?.rules?.map((rule) => {
    const host = rule?.host ? rule.host : '';
    const httpPaths = rule?.httpPaths?.map((path) => {
      const pathType = path?.pathType;
      const serviceName = path?.backend?.service?.serviceName;
      return ` ${pathType} ${serviceName}`;
    });
    const httpPathsString = httpPaths.join(', ');
    return `${host} ${httpPathsString}, `;
  });

  if (ingressRulesData && Object.keys(ingressRulesData[0]).length > 25) {
    const obj = ingressRulesData[0];
    return obj.toString().substring(0, 25) + '...';
  } else {
    return ingressRulesData ? ingressRulesData[0] + '...' : ingressRulesData;
  }
};
export const groupLabels = (getlabelNamesResult: string[]) => {
  const additionalLabels = [];
  const cloudLabels = [];
  const kubernetesLabels = [];

  getlabelNamesResult.sort().forEach((labelName) => {
    additionalLabels.push({
      component: 'Additional',
      name: labelName,
      type: 'string',
    });
  });

  return {
    additionalLabels,
    cloudLabels,
    kubernetesLabels,
  };
};
