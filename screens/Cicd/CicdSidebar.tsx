import {
  ChipWithLabel,
  FacetGroup,
  FacetPicker,
  IconWithLabel,
} from 'components';
import { iconsBySpanType } from 'constants';
import {
  useColorsByServiceName,
  useRequest,
  useSelectedFacetValuesByNameState,
} from 'hooks';
import { flatten, partition } from 'lodash';
import React, { useEffect, useState } from 'react';
import { traceLabelNames, traceLabelValues } from 'requests';
import { DateSelection } from 'types';

const getAttributesByName = (colorsByServiceName: {
  [key: string]: string;
}) => ({
  service_name: {
    forceExpanded: true,
    renderValue: (value: string) => (
      <ChipWithLabel color={colorsByServiceName[value]} label={value} />
    ),
  },
  span_type: {
    forceExpanded: true,
    renderValue: (value: string) => (
      <IconWithLabel icon={iconsBySpanType[value]} label={value} />
    ),
  },
});

type Props = {
  colorsByServiceName: ReturnType<typeof useColorsByServiceName>;
  date: DateSelection;
  selectedFacetValuesByNameState: ReturnType<
    typeof useSelectedFacetValuesByNameState
  >;
};

const CicdSideBar = ({
  colorsByServiceName,
  date,
  selectedFacetValuesByNameState,
}: Props) => {
  const [lastRefreshedAt, setLastRefreshedAt] = useState(null);
  const traceLabelNamesRequest = useRequest(traceLabelNames);
  const attributesByName = getAttributesByName(colorsByServiceName);

  const clearFacetHandler = (name: string) => () => {
    selectedFacetValuesByNameState.clearFacet(name);
  };

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

  const requestByLabelName = (labelName: string) => () =>
    traceLabelValues({
      date,
      labelName,
      selectedFacetValuesByName: {
        ...{
          ci_test: {
            true: 1,
          },
        },
        ...selectedFacetValuesByNameState.state,
      },
    });

  useEffect(() => {
    setLastRefreshedAt(new Date());
  }, [date, selectedFacetValuesByNameState.state]);

  useEffect(() => {
    traceLabelNamesRequest.call({
      date,
      selectedFacetValuesByName: {
        ...{
          ci_test: {
            true: 1,
          },
        },
        ...selectedFacetValuesByNameState.state,
      },
    });
  }, [date]);

  const facetNamesByGroup =
    traceLabelNamesRequest.result?.facetNamesByGroup || {};

  const ungrouped = traceLabelNamesRequest.result?.ungrouped || [];
  const sortedUngroupedNames = flatten(
    partition(ungrouped, (group) => attributesByName[group]?.forceExpanded),
  );

  return (
    <div className="cicd__sidebar">
      <div className="left-sidebar__section">
        {sortedUngroupedNames.map((name: string) => {
          const attribute = attributesByName[name];
          return (
            <FacetPicker
              clearFacet={clearFacetHandler(name)}
              forceExpanded={attribute?.forceExpanded}
              key={name}
              lastRefreshedAt={lastRefreshedAt}
              name={name}
              renderName={(s) => s.replace(/_+/g, ' ')}
              renderValue={attribute?.renderValue || null}
              request={requestByLabelName(name)}
              selectedFacetValues={
                selectedFacetValuesByNameState.state[name] || {}
              }
              {...handlersByName(name)}
            />
          );
        })}
      </div>
      <div className="left-sidebar__section">
        {Object.keys(facetNamesByGroup)
          .sort()
          .map((group, index) => (
            <div key={index}>
              <FacetGroup group={group}>
                {facetNamesByGroup[group].map((name) => (
                  <FacetPicker
                    clearFacet={clearFacetHandler(name)}
                    key={name}
                    lastRefreshedAt={lastRefreshedAt}
                    name={name}
                    renderName={(s) => s.replace(/_+/g, ' ')}
                    request={requestByLabelName(name)}
                    selectedFacetValues={
                      selectedFacetValuesByNameState.state[name] || {}
                    }
                    {...handlersByName(name)}
                  />
                ))}
              </FacetGroup>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CicdSideBar;
