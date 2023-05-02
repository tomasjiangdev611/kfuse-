import classNames from 'classnames';
import {
  AutocompleteOption,
  AutocompleteV2,
  Loader,
  MultiselectV2,
} from 'components';
import React, { ReactElement } from 'react';

import { useDashboardState, useDashboardTemplateState } from './hooks';
import { getReloadPanelsForTemplating } from './utils';

const DashboardFilter = ({
  dashboardState,
  dashboardTemplateState,
}: {
  dashboardState: ReturnType<typeof useDashboardState>;
  dashboardTemplateState: ReturnType<typeof useDashboardTemplateState>;
}): ReactElement => {
  const { panels, reloadPanels, setReloadPanels } = dashboardState;
  const {
    isLoading,
    onTemplateChangeReload,
    setTemplateValues,
    templating,
    templateOptions,
    templateValues,
  } = dashboardTemplateState;

  const onTemplateFilterChange = (
    name: string,
    templateIndex: number,
    values: string | string[],
  ) => {
    const newTemplateValues = { ...templateValues };
    if (typeof values === 'string') {
      newTemplateValues[name] = values;
    }

    if (Array.isArray(values)) {
      const template = templating[templateIndex];
      if (template.includeAll) {
        const checkAllSelected =
          values[values.length - 1] === template.allValue;
        if (checkAllSelected) {
          newTemplateValues[name] = [template.allValue];
        } else {
          newTemplateValues[name] = values.filter(
            (value) => value !== template.allValue,
          );
        }
      } else {
        newTemplateValues[name] = values;
      }
    }

    const newReloadPanels = getReloadPanelsForTemplating(panels, name, {});
    setReloadPanels({ ...reloadPanels, ...newReloadPanels });
    setTemplateValues(newTemplateValues);
    onTemplateChangeReload(name, newTemplateValues);
  };

  return (
    <Loader isLoading={isLoading}>
      <div
        className={classNames({
          dashboard__filter: true,
          'dashboard__filter--loading': isLoading,
        })}
      >
        {templateOptions &&
          templateOptions.map(
            (labelValues: AutocompleteOption[], index: number) => {
              if (!templating[index]) {
                return null;
              }
              const { label, multi, name } = templating[index];
              return (
                <div key={index}>
                  <label>{label || name}</label>
                  {multi && (
                    <MultiselectV2
                      className="autocomplete__fixed-height-28"
                      components={{ ClearIndicator: null }}
                      onChange={(values: string[]) =>
                        onTemplateFilterChange(name, index, values)
                      }
                      options={labelValues}
                      placeholder={label || name}
                      value={templateValues[name] || []}
                    />
                  )}
                  {!multi && (
                    <AutocompleteV2
                      className="autocomplete__fixed-height-28"
                      components={{ ClearIndicator: null }}
                      onChange={(values: string) =>
                        onTemplateFilterChange(name, index, values)
                      }
                      options={labelValues}
                      placeholder={label || name}
                      value={templateValues[name] || ''}
                    />
                  )}
                </div>
              );
            },
          )}
      </div>
    </Loader>
  );
};

export default DashboardFilter;
