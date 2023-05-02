import { TableColumn } from '../Table';

interface Args<T> {
  column: TableColumn<T>;
  row: T;
}

const findValue = (key: string, obj: { [key: string]: any }): any => {
  const keys = key.split('.');
  if (keys.length === 1) {
    return obj[keys[0]];
  }

  if (keys[0] in obj) {
    return findValue(keys.slice(1).join('.'), obj[keys[0]]);
  }

  return undefined;
};

const getValue = <T>({ column, row }: Args<T>) => {
  const { key, value } = column;
  const v = typeof value === 'function' ? value({ row }) : findValue(key, row);
  return v;
};

export default getValue;
