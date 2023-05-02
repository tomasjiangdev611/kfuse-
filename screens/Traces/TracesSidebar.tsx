import {
  ChipWithLabel,
  FacetGroup,
  FacetPicker,
  IconWithLabel,
} from 'components';
import { iconsBySpanType } from 'constants';
import {
  useRequest,
  useSelectedFacetRangeByNameState,
  useSelectedFacetValuesByNameState,
} from 'hooks';
import { flatten, partition } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { aggregateTable, traceLabelValues } from 'requests';
import { DateSelection, SpanFilter } from 'types';
import { getIsRangeFacet, groupTraceLabels } from 'utils';

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
  colorsByServiceName: { [key: string]: string };
  date: DateSelection;
  selectedFacetRangeByNameState: ReturnType<
    typeof useSelectedFacetRangeByNameState
  >;
  selectedFacetValuesByNameState: ReturnType<
    typeof useSelectedFacetValuesByNameState
  >;
  spanFilter: SpanFilter;
  traceLabelNamesRequest: ReturnType<typeof useRequest>;
};

const TracesSidebar = ({
  colorsByServiceName,
  date,
  selectedFacetRangeByNameState,
  selectedFacetValuesByNameState,
  spanFilter,
  traceLabelNamesRequest,
}: Props) => {
  const attributesByName = getAttributesByName(colorsByServiceName);

  const clearFacetHandler = (name: string) => () => {
    selectedFacetValuesByNameState.clearFacet(name);
  };

  const clearFacetRangeHandler = (name: string) => () => {
    selectedFacetRangeByNameState.clearFacet(name);
  };

  const handlersByName = (name: string) => ({
    changeFacetRange: selectedFacetRangeByNameState.changeFacetRange({ name }),
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

  const [lastRefreshedAt, setLastRefreshedAt] = useState(null);

  const requestByLabelName = (labelName: string) => () =>
    traceLabelValues({
      date,
      labelName,
      selectedFacetRangeByName: selectedFacetRangeByNameState.state,
      selectedFacetValuesByName: selectedFacetValuesByNameState.state,
      spanFilter,
    });

  const maxByLabelName = (labelName: string) => () =>
    aggregateTable({
      date,
      selectedFacetValuesByName: selectedFacetValuesByNameState.state,
      spanFilter,
    });

  useEffect(() => {
    setLastRefreshedAt(new Date().valueOf());
  }, [
    date,
    selectedFacetValuesByNameState.state,
    selectedFacetRangeByNameState.state,
    spanFilter,
  ]);

  const { facetNamesByGroup, ungrouped: ungroupedWithoutDuration } =
    useMemo(() => {
      if (traceLabelNamesRequest.result) {
        return groupTraceLabels(traceLabelNamesRequest.result);
      }

      return {
        facetNamesByGroup: {},
        ungrouped: [],
      };
    }, [traceLabelNamesRequest.result]);

  const ungrouped = [...ungroupedWithoutDuration, 'duration'];

  const renderName = (s) => {
    if (s === 'duration') {
      return 'duration (ms)';
    }

    if (s === 'span_name') {
      return 'resource';
    }
    return s.replace(/_+/g, ' ');
  };

  const sortedUngroupedNames = flatten(
    partition(
      ungrouped.sort((a, b) => renderName(a).localeCompare(renderName(b))),
      (group) => attributesByName[group]?.forceExpanded,
    ),
  );

  const renderPlaceholderText = (name: string) => `No attributes for ${name}`;

  return (
    <div className="traces__sidebar">
      <div className="left-sidebar__section">
        {sortedUngroupedNames.map((name: string) => {
          const attribute = attributesByName[name];
          const isRangeFacet = getIsRangeFacet(name);
          return (
            <FacetPicker
              clearFacet={
                isRangeFacet
                  ? clearFacetRangeHandler(name)
                  : clearFacetHandler(name)
              }
              forceExpanded={attribute?.forceExpanded}
              key={name}
              lastRefreshedAt={lastRefreshedAt}
              name={name}
              renderName={renderName}
              renderPlaceholderText={renderPlaceholderText}
              renderValue={attribute?.renderValue || null}
              request={
                isRangeFacet ? maxByLabelName(name) : requestByLabelName(name)
              }
              selectedFacetRange={
                selectedFacetRangeByNameState.state[name] || null
              }
              selectedFacetValues={
                selectedFacetValuesByNameState.state[name] || {}
              }
              {...handlersByName(name)}
            />
          );
        })}
      </div>
      <div className="left-sidebar__section">
        {[
          'cloud',
          'kubernetes',
          ...Object.keys(facetNamesByGroup)
            .filter((group) => group !== 'kubernetes' && group !== 'cloud')
            .sort(),
        ]
          .filter(
            (group) =>
              facetNamesByGroup[group] && facetNamesByGroup[group].length,
          )
          .map((group) => (
            <FacetGroup group={group} key={group}>
              {facetNamesByGroup[group].map((name) => (
                <FacetPicker
                  clearFacet={clearFacetHandler(name)}
                  key={name}
                  lastRefreshedAt={lastRefreshedAt}
                  name={name}
                  renderName={(s) => s.replace(/_+/g, ' ')}
                  renderPlaceholderText={renderPlaceholderText}
                  request={requestByLabelName(name)}
                  selectedFacetValues={
                    selectedFacetValuesByNameState.state[name] || {}
                  }
                  selectedFacetRange={
                    selectedFacetRangeByNameState.state[name] || null
                  }
                  {...handlersByName(name)}
                />
              ))}
            </FacetGroup>
          ))}
      </div>
    </div>
  );
};

export default TracesSidebar;
