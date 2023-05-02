import { ChipWithLabel, FacetPicker, FlyoutCaret } from 'components';
import { colorsByLogLevel } from 'constants';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelectedFacetValuesByNameState, useToggle } from 'hooks';
import { DateSelection } from 'types/DateSelection';

const EventsSidebarFacetGroup = ({
  component,
  date,
  facetNames,
  forceExpanded,
  request,
  selectedFacetValuesByNameState,
}: {
  component: string;
  date: DateSelection;
  facetNames: any;
  forceExpanded?: boolean;
  request: any;
  selectedFacetValuesByNameState: ReturnType<
    typeof useSelectedFacetValuesByNameState
  >;
}): ReactElement => {
  const [lastRefreshedAt, setLastRefreshedAt] = useState(null);
  const expandedToggle = useToggle();
  const expanded = forceExpanded || expandedToggle.value;

  useEffect(() => {
    setLastRefreshedAt(new Date());
  }, [date, selectedFacetValuesByNameState.state]);

  const handlersByName = (name: string) => ({
    excludeFacetValue: (value: string) => {
      selectedFacetValuesByNameState.excludeFacetValue({ name, value });
    },
    selectOnlyFacetValue: (value: string) => {
      selectedFacetValuesByNameState.selectOnlyFacetValue({ name, value });
    },
    toggleFacetValue: (value: string) => {
      selectedFacetValuesByNameState.toggleFacetValue({ name, value });
    },
  });

  const clearFacetHandler = (name: string) => () => {
    selectedFacetValuesByNameState.clearFacet(name);
  };

  return (
    <div>
      <button
        className="events__sidebar__facet-group__header"
        onClick={expandedToggle.toggle}
      >
        <div className="events__sidebar__facet-group__header__flyout-caret">
          <FlyoutCaret isOpen={expanded} />
        </div>
        <div className="events__sidebar__facet-group__header__text">
          {component}
        </div>
      </button>
      {expanded && (
        <div className="events__sidebar__facet-group__facet-names">
          {facetNames.map((facet: any) => {
            const name = facet.name;
            return (
              <FacetPicker
                forceExpanded={false}
                clearFacet={clearFacetHandler(name)}
                key={name}
                lastRefreshedAt={lastRefreshedAt}
                name={name}
                renderName={(s) => {
                  if (s === 'source_type_name') {
                    return 'source';
                  }
                  if (s === 'alert_type') {
                    return 'status';
                  }
                  if (s === 'text') {
                    return 'message';
                  }
                  return s.replace(/_+/g, ' ');
                }}
                request={request(name)}
                selectedFacetValues={
                  selectedFacetValuesByNameState.state[name] || {}
                }
                renderValue={(label) => {
                  if (name === 'alert_type') {
                    return (
                      <ChipWithLabel
                        color={colorsByLogLevel[label]}
                        label={label}
                      />
                    );
                  }
                  return label;
                }}
                {...handlersByName(name)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventsSidebarFacetGroup;
