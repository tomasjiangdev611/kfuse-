export const includeSpecialCharacters = (value: string, entity: any) => {
  let result = '';
  if (value.includes('-')) {
    const [firstPart, lastPart] = value.split('-');
    const [secondPart, thirdPart] = lastPart.split('/');
    const name = entity.spec.ports[0][firstPart];
    const ports = entity.spec.ports[0][secondPart];
    const protocol = entity.spec.ports[0][thirdPart];
    result = `${name} ${ports}/${protocol}`;
  } else {
    const [value1, value2] = value.split('/');
    const result1 = eval(`entity.${value1}`) ? eval(`entity.${value1}`) : 0;
    const result2 = eval(`entity.${value2}`) ? eval(`entity.${value2}`) : 0;
    result = result1 + '/' + result2;
  }
  return result;
};

export const valueInsideArray = (value: string, entity: any) => {
  let answer = '';
  answer = eval(`entity.${value}`);
  if (value.endsWith('ready')) {
    answer = typeof answer === 'boolean' && answer == true ? '1/1' : '0/0';
  } else if (value.endsWith('restartCount')) {
    answer = answer ? answer : '0';
  }
  return answer;
};

export const objectType = (value: string, entity: any) => {
  let answer = '';
  if (entity[value] == null) {
    answer = '0';
  } else {
    const newValue = entity[value];
    answer = Object.keys(newValue);
  }
  return answer;
};

export const lastScheduleTime = (result: any) => {
  const date = new Date(result * 1000);
  result = date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  return result;
};

export const getResult = (value: string, entity: any) => {
  let result = entity;
  for (const key of value.split('.')) {
    result = result?.[key];
  }
  if (value.includes('storage')) {
    result = result ? `${result / 1024 ** 3} GiB` : 'false';
  }
  if (value.includes('externalIPs') && !result) {
    result = 'None';
  }
  if (value.includes('lastScheduleTime')) {
    result = lastScheduleTime(result);
  }
  if (result) {
    return result;
  } else {
    return 'False';
  }
};
