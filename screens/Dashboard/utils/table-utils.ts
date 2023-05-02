import { transformInstantQueryToTable } from 'requests';
import { findUnitCategoryFormatById } from 'utils';

import {
  DashboardPanelTableTransformProps,
  DashboardPanelOverrideProps,
} from '../types';

const SUPPORTED_TRANSFORMS = ['seriesToColumns', 'joinByField'];

const getColumnsFromObject = (data: { [key: string]: any }[]): string[] => {
  // get all columns from data
  const cols = data.reduce((acc, curr) => {
    Object.keys(curr).forEach((key) => {
      if (!acc.includes(key)) {
        acc.push(key);
      }
    });
    return acc;
  }, [] as string[]);

  // rename time and value column to Time and Value
  return cols.map((col) => {
    if (col === 'time') {
      return 'Time';
    }

    if (col === 'value') {
      return 'Value';
    }

    return col;
  });
};

const getDefaultColumns = (obj: { [key: string]: any }) => {
  const cols = Object.keys(obj).map((key) => {
    return { key: key, label: key };
  });

  // keep key time as first column in table
  // key value as last column in table
  const timeCol = cols.find((col) => col.key === 'time');
  timeCol.label = 'Time';
  const valueCol = cols.find((col) => col.key === 'value');
  valueCol.label = 'Value';
  const otherCols = cols.filter(
    (col) => col.key !== 'time' && col.key !== 'value',
  );
  return [timeCol, ...otherCols, valueCol];
};

export const hideTableColumn = (
  excludeByName: { [key: string]: boolean },
  columns: string[],
): string[] => {
  if (excludeByName) {
    columns = columns.filter((col) => {
      if (!excludeByName[col]) {
        return true;
      }

      if (excludeByName[col] === false) {
        return true;
      }

      return false;
    });

    Object.keys(excludeByName).forEach((item) => {
      const isExisted = columns.includes(item);
      if (!isExisted && excludeByName[item] === false) {
        columns.push(item);
      }
    });
  }

  return columns;
};

export const sortTableColumn = (
  indexByName: { [key: string]: number },
  columns: string[],
): string[] => {
  if (indexByName) {
    columns.sort((a, b) => {
      const indexA = indexByName[a] || 0;
      const indexB = indexByName[b] || 0;

      return indexA - indexB;
    });
  }

  return columns;
};

export const renameTableColumn = (
  renameByName: { [key: string]: string },
  columns: string[],
): Array<{ key: string; label: string }> => {
  if (renameByName) {
    const renameCols: Array<{ key: string; label: string }> = [];
    columns.map((col) => {
      if (renameByName[col]) {
        renameCols.push({ key: col, label: renameByName[col] });
        return renameByName[col];
      }

      return { key: col, label: col };
    });

    Object.keys(renameByName).forEach((item) => {
      const [key, num] = item.split(' ');
      if (!key) return;

      if (!renameByName[item]) return;

      if (key && columns.includes(key) && !Number.isNaN(Number(num))) {
        renameCols.push({ key: key, label: renameByName[item] });
      }
    });

    return renameCols;
  }

  return columns.map((col) => ({ key: col, label: col }));
};

const renameTableColumnByRegex = (
  columns: Array<{ key: string; label: string }>,
  options: { regex: string; renamePattern: string },
) => {
  const { regex, renamePattern } = options;
  const regexPattern = new RegExp(regex);
  const colIndex = columns.findIndex((col) => col.key === regex);
  if (colIndex === -1) return columns;

  const newColumns = [...columns];
  newColumns[colIndex].label = newColumns[colIndex].label.replace(
    regexPattern,
    renamePattern,
  );
  return newColumns;
};

const filterFieldsByName = (
  columns: string[],
  options: {
    include: { names: string[] };
    exclude: { names: string[] };
  },
): Array<{ key: string; label: string }> => {
  const { include, exclude } = options;

  const newColumns = [];
  columns.map((col) => {
    if (include && include.names.includes(col)) {
      newColumns.push({ key: col, label: col });
    }
  });

  return newColumns;
};

export const getTableColumns = (
  data: Array<{ [key: string]: any }>,
  transformations: DashboardPanelTableTransformProps[],
): Array<{ key: string; label: string }> => {
  if (!transformations) {
    return getDefaultColumns(data[0]);
  }

  let newColumns: Array<{ key: string; label: string }> = [];
  const columns = getColumnsFromObject(data);

  transformations.forEach(({ id, options }) => {
    if (id === 'organize') {
      const { excludeByName, indexByName, renameByName } = options;
      const hideCols = hideTableColumn(excludeByName, columns);
      const sortedCols = sortTableColumn(indexByName, hideCols);
      const renameCols = renameTableColumn(renameByName, sortedCols);

      newColumns = renameCols;
    }

    if (id === 'filterFieldsByName') {
      newColumns = filterFieldsByName(columns, options);
    }

    if (id === 'renameByRegex') {
      newColumns = renameTableColumnByRegex(newColumns, options);
    }
  });

  return newColumns;
};

export const organizeTableData = (
  activePromqlQueryRefId: string[] = [],
  data: Array<{ [key: string]: any }>,
  overrides: DashboardPanelOverrideProps[],
  transformations: DashboardPanelTableTransformProps[],
): Array<{ [key: string]: any }> => {
  let transformedData: Array<{ [key: string]: any }> = [];

  if (!transformations) {
    const flattenedDatasets = data.reduce(
      (arr: any, dataum: any) => [...arr, ...dataum],
      [],
    );

    return transformInstantQueryToTable(flattenedDatasets);
  }

  const isSupportedTransform = transformations.some((t) =>
    SUPPORTED_TRANSFORMS.some((id) => t.id === id),
  );
  if (!isSupportedTransform) {
    const flattenedDatasets = data.reduce(
      (arr: any, dataum: any) => [...arr, ...dataum],
      [],
    );

    return transformInstantQueryToTable(flattenedDatasets);
  }

  transformations.forEach(({ id, options }) => {
    if (id === 'seriesToColumns' || id === 'joinByField') {
      transformedData = convertSeriesToColumns(
        data,
        options.byField,
        activePromqlQueryRefId,
      );
    }
  });

  if (overrides) {
    const newColumns = getTableColumns(transformedData, transformations);
    transformedData = overrideColumnsData(
      transformedData,
      newColumns,
      overrides,
    );
  }

  return transformedData;
};

const convertSeriesToColumns = (
  data: Array<{ [key: string]: any }>,
  byField: string,
  activePromqlQueryRefId: string[] = [],
): Array<{ [key: string]: any }> => {
  const dataBitmaps: { [key: string]: { [key: string]: any } } = {};

  data.forEach((datum, promIndex) => {
    datum.forEach((dataum: { metric: any; value: any }) => {
      const { metric, value } = dataum;
      const { [byField]: byFieldValue } = metric;

      if (dataBitmaps[byFieldValue]) {
        const newMetric = { ...dataBitmaps[byFieldValue], ...metric };
        newMetric[`Value #${activePromqlQueryRefId[promIndex]}`] = value[1];
        dataBitmaps[byFieldValue] = newMetric;
      }

      if (!dataBitmaps[byFieldValue]) {
        dataBitmaps[byFieldValue] = { ...metric, time: value[0] };
        dataBitmaps[byFieldValue][
          `Value #${activePromqlQueryRefId[promIndex]}`
        ] = value[1];
      }
    });
  });

  const transformedData = Object.values(dataBitmaps);

  return transformedData;
};

const overrideColumnsData = (
  data: Array<{ [key: string]: any }>,
  columns: Array<{ key: string; label: string }>,
  overrides: DashboardPanelOverrideProps[],
) => {
  const newData = [...data];
  newData.forEach((datum) => {
    overrides.forEach(({ matcher, properties }) => {
      const { id, options } = matcher;
      if (id === 'byName') {
        const col = columns.find((col) => col.label === options);

        if (col) {
          const value = datum[col.key];
          const { id, value: overrideValue } = properties[0];
          if (id === 'unit' && overrideValue && value) {
            const unitFormat = findUnitCategoryFormatById(overrideValue);

            if (unitFormat) {
              const { prefix, text, suffix } = unitFormat.fn(value || 0);
              datum[col.key] = `${prefix || ''}${text}${suffix || ''}`;
            }
          }
        }
      }
    });
  });

  return newData;
};
