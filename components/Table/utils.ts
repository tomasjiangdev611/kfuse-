import getValue from './getValue';
import { TableColumn } from './types';

interface Args<T> {
  asc: boolean;
  column: TableColumn<T>;
}

export const sortTableRowsLexicographically =
  <T>({ asc, column }: Args<T>) =>
  (a: T, b: T) =>
    asc
      ? String(getValue({ column, row: a })).localeCompare(
          String(getValue({ column, row: b })),
        )
      : String(getValue({ column, row: b })).localeCompare(
          String(getValue({ column, row: a })),
        );

export const sortTableRowsNumerically =
  <T>({ asc, column }: Args<T>) =>
  (a: T, b: T) =>
    asc
      ? Number(getValue({ column, row: a })) -
        Number(getValue({ column, row: b }))
      : Number(getValue({ column, row: b })) -
        Number(getValue({ column, row: a }));
