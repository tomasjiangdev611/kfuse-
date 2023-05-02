import { ChipWithLabel, FacetPicker } from 'components';
import { colorsByAlertState } from 'constants';
import { useSelectedFacetValuesByNameState, useToggle } from 'hooks';
import React, { ReactElement, useEffect, useState } from 'react';

const AlertsSidebarFacetGroup = ({
  facetNames,
  forceExpanded,
  request,
  selectedFacetValuesByNameState,
}: {
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
  }, [selectedFacetValuesByNameState.state]);

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
      {expanded && (
        <div className="events__sidebar__facet-group__facet-names">
          {facetNames.map((facet: any) => {
            const name = facet.name;
            return (
              <FacetPicker
                forceExpanded={facet.forceExpanded || false}
                clearFacet={clearFacetHandler(name)}
                key={name}
                lastRefreshedAt={lastRefreshedAt}
                name={name}
                renderName={(s) => {
                  return s.replace(/_+/g, ' ');
                }}
                request={request(name)}
                selectedFacetValues={
                  selectedFacetValuesByNameState.state[name] || {}
                }
                renderValue={(label) => {
                  if (name === 'Status') {
                    return (
                      <ChipWithLabel
                        color={colorsByAlertState[label]}
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

export default AlertsSidebarFacetGroup;
