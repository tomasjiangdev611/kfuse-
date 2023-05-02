import { AutocompleteOption } from 'components/Autocomplete';
import { useRequest, useUrlState } from 'hooks';
import { useEffect, useState } from 'react';
import { promqlLabelValues, promqlSeries } from 'requests';
import { DateSelection } from 'types/DateSelection';

import { DashboardTemplateProps, DashboardTemplateValueProps } from '../types';
import {
  checkVariableUsedInQuery,
  firstNonEmptyValue,
  getSeriesLabelValues,
  getTemplateDependencies,
  transformTemplateQuery,
} from '../utils';

const useDashboardTemplateState = (date: DateSelection) => {
  const [isTemplateLoading, setIsTemplateLoading] = useState<boolean>(false);
  const [templating, setTemplating] = useState<DashboardTemplateProps[]>([]);
  const [templateValues, setTemplateValues] = useUrlState('templateValues', {});
  const [templateOptions, setTemplateOptions] = useState<
    Array<AutocompleteOption[]>
  >([]);

  const promqlLabelValuesRequest = useRequest(promqlLabelValues);
  const promqlSeriesRequest = useRequest(promqlSeries);

  const initialTemplateSetup = async (jsonModel: any): Promise<string> => {
    const { templating } = jsonModel;
    if (templating && templating.list.length === 0) {
      return;
    }

    const sanitizedTemplates: DashboardTemplateProps[] = templating.list;
    const dependencies = getTemplateDependencies(sanitizedTemplates);

    setIsTemplateLoading(true);
    const initialData: { [key: number]: AutocompleteOption[] } = {};
    const newTemplateValues: DashboardTemplateValueProps = {};
    await loadTemplateDataAsynchronously(
      dependencies,
      sanitizedTemplates,
      initialData,
      newTemplateValues,
    );
    const datasets = Object.keys(initialData).map((key) => {
      const templateIndex = Number(key);
      const template = sanitizedTemplates[templateIndex];
      const options = initialData[templateIndex];
      if (template.includeAll) {
        const newAllValue = template.allValue || '.*';
        return [...[{ label: 'All', value: newAllValue }], ...options];
      }
      return options;
    });

    setTemplateValues(newTemplateValues);
    setTemplating(sanitizedTemplates);
    setTemplateOptions(datasets);
    setIsTemplateLoading(false);

    return new Promise((resolve) => {
      resolve('done');
    });
  };

  const loadTemplateDataAsynchronously = async (
    dependencies: { [key: number]: number[] },
    newTemplates: DashboardTemplateProps[],
    initialData: { [key: number]: AutocompleteOption[] },
    newTemplateValues: DashboardTemplateValueProps,
  ) => {
    if (Object.keys(dependencies).length === 0) {
      return initialData;
    }

    const dependenciesKeys = Object.keys(dependencies);
    const noDependencies = dependenciesKeys.filter(
      (key) => dependencies[Number(key)].length === 0,
    );

    const datasets = await Promise.all(
      noDependencies.map(async (key) => {
        const template = newTemplates[Number(key)];
        const data = await loadTemplateValues(template, newTemplateValues);
        return { key, data };
      }),
    );

    datasets.forEach((dataset) => {
      initialData[Number(dataset.key)] = dataset.data;
      checkAndAssignDefaultValue(
        Number(dataset.key),
        dataset.data,
        newTemplates,
        newTemplateValues,
      );

      // remove the dependency
      dependenciesKeys.forEach((key) => {
        if (dependencies[Number(key)]) {
          const dependentIndex = dependencies[Number(key)].findIndex(
            (d) => d === Number(dataset.key),
          );
          if (dependentIndex !== -1) {
            dependencies[Number(key)].splice(dependentIndex, 1);
          }
        }
      });
      delete dependencies[Number(dataset.key)];
    });
    await loadTemplateDataAsynchronously(
      dependencies,
      newTemplates,
      initialData,
      newTemplateValues,
    );

    return initialData;
  };

  const checkAndAssignDefaultValue = (
    templateIndex: number,
    options: AutocompleteOption[],
    sanitizedTemplates: DashboardTemplateProps[],
    newTemplateValues: DashboardTemplateValueProps,
  ) => {
    const firstValue = firstNonEmptyValue(options);
    const {
      allValue,
      current,
      includeAll,
      multi,
      name,
      options: predefinedOptions,
    } = sanitizedTemplates[templateIndex];

    if (templateValues[name]) {
      newTemplateValues[name] = templateValues[name];
      return;
    }

    if (predefinedOptions && predefinedOptions.length > 0) {
      newTemplateValues[name] =
        predefinedOptions.find(({ selected }) => selected).value ||
        current.value;
      return;
    }

    if (!allValue) {
      sanitizedTemplates[templateIndex].allValue = '.*';
    }

    if (includeAll) {
      const newAllValue = allValue ? allValue : '.*';
      newTemplateValues[name] = multi ? [newAllValue] : newAllValue;
      return;
    }

    const defaultValue = current.value;
    let found = false;
    if (Array.isArray(defaultValue)) {
      const filterMultiOption = defaultValue.filter((val: string) =>
        options.find((option) => (option.value === val ? val : null)),
      );
      found = filterMultiOption.length > 0;
    } else {
      const filterOneOption = options.filter((option) =>
        option.value === defaultValue ? defaultValue : null,
      );
      found = filterOneOption.length > 0;
    }

    if (current.selected && found) {
      newTemplateValues[name] = current.value;
      return;
    }

    if (!multi) {
      newTemplateValues[name] = firstValue;
    }
  };

  const loadTemplateValues = async (
    template: DashboardTemplateProps,
    newTemplateValues: DashboardTemplateValueProps,
  ): Promise<AutocompleteOption[]> => {
    return new Promise((resolve, reject) => {
      const { options, query } = template;

      if (options && options.length > 0) {
        resolve(options.map(({ text, value }) => ({ label: text, value })));
      }

      const parsedTemplateQuery = transformTemplateQuery(
        query.query,
        newTemplateValues,
      );
      const { type, query: queryStr, label } = parsedTemplateQuery;
      if (type === 'label_values') {
        getLabelValuesForTemplate(label).then((options) => {
          resolve(options);
        });
      }

      if (type === 'series') {
        getSeriesValuesForTemplate(queryStr, label).then((options) => {
          resolve(options);
        });
      }

      if (type !== 'label_values' && type !== 'series') {
        resolve([]);
      }
    });
  };

  const onTemplateChangeReload = async (
    name: string,
    newTemplateValues: DashboardTemplateValueProps,
  ) => {
    const usedTemplates = checkVariableUsedInQuery(name, templating);
    if (usedTemplates.length === 0) {
      return;
    }
    setIsTemplateLoading(true);
    const datasets = await Promise.all(
      usedTemplates.map(({ template }) =>
        loadTemplateValues(template, newTemplateValues),
      ),
    );

    const newTemplateOptions = [...templateOptions];
    datasets.forEach((dataset, index) => {
      const usedIndex = usedTemplates[index].index;
      newTemplateOptions[usedIndex] = dataset;
    });
    setIsTemplateLoading(false);
    setTemplateOptions(newTemplateOptions);
  };

  const getLabelValuesForTemplate = async (
    label: string,
  ): Promise<AutocompleteOption[]> => {
    return new Promise((resolve, reject) => {
      promqlLabelValuesRequest
        .call({ date, label })
        .then((labelValuesResponse: string[]) => {
          if (labelValuesResponse) {
            const valuesOptions = [] as AutocompleteOption[];
            labelValuesResponse.map((facetValue) => {
              if (!facetValue) return;
              valuesOptions.push({ label: facetValue, value: facetValue });
            });
            resolve(valuesOptions);
          }
          resolve([]);
        });
    });
  };

  const getSeriesValuesForTemplate = async (
    query: string,
    label: string,
  ): Promise<AutocompleteOption[]> => {
    return new Promise((resolve, reject) => {
      promqlSeriesRequest
        .call({ date, match: query })
        .then((seriesResponse) => {
          const values = getSeriesLabelValues(seriesResponse.data, label);
          const valuesOptions = values.map((value) => ({
            label: value,
            value,
          }));
          resolve(valuesOptions);
        });
    });
  };

  useEffect(() => {
    if (!isTemplateLoading && date && templating.length > 0) {
      initialTemplateSetup({ templating: { list: templating } });
    }

    if (templating.length === 0) {
      setTemplateValues({ ...templateValues });
    }
  }, [date]);

  return {
    initialTemplateSetup,
    isLoading: isTemplateLoading,
    onTemplateChangeReload,
    setTemplating,
    setTemplateValues,
    templating,
    templateOptions,
    templateValues,
  };
};

export default useDashboardTemplateState;
