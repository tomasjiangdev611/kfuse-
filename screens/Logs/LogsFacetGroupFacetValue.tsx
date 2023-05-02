import { Checkbox, PopoverTrigger } from 'components';
import React, { ReactElement, ReactNode } from 'react';
import { FacetValue } from 'types';
import { convertNumberToReadableUnit } from 'utils';
import LogsSelectedLogAttributePanel from './LogsSelectedLogAttributePanel';

type Props = {
  count: number;
  enabled: boolean;
  facetKey: string;
  facetValue: FacetValue;
  facetValues: string[];
  facetValueCompositeKey: string;
  logsState: any;
  name: string;
  renderValue?: (value: string) => ReactNode;
  selectionByFacetKey: { [key: string]: number };
  source: string;
};

const LogsFacetGroupFacetValue = ({
  count,
  facetKey,
  facetValue,
  facetValues,
  facetValueCompositeKey,
  logsState,
  name,
  renderValue,
  selectionByFacetKey,
  source,
}: Props): ReactElement => {
  const { toggleFacetValue } = logsState;

  const selectionByFacetKeyCompositeKeys = Object.keys(selectionByFacetKey);
  const hasNoSelection = selectionByFacetKeyCompositeKeys.length === 0;
  const isDeselecting =
    hasNoSelection ||
    selectionByFacetKey[selectionByFacetKeyCompositeKeys[0]] === 0;

  const onChange = () => {
    const nextSelectionByFacetKeys = { ...selectionByFacetKey };
    if (hasNoSelection) {
      nextSelectionByFacetKeys[facetValueCompositeKey] = 0;
    } else {
      if (isDeselecting) {
        if (nextSelectionByFacetKeys[facetValueCompositeKey] === 0) {
          delete nextSelectionByFacetKeys[facetValueCompositeKey];
        } else {
          nextSelectionByFacetKeys[facetValueCompositeKey] = 0;
        }
      } else {
        if (nextSelectionByFacetKeys[facetValueCompositeKey]) {
          delete nextSelectionByFacetKeys[facetValueCompositeKey];
        } else {
          nextSelectionByFacetKeys[facetValueCompositeKey] = 1;
        }
      }
    }

    toggleFacetValue({
      facetKey,
      nextSelectionByFacetKeys:
        !isDeselecting &&
        Object.keys(nextSelectionByFacetKeys).length === facetValues.length
          ? {}
          : nextSelectionByFacetKeys,
    });
  };

  return (
    <div className="logs__facet-group__facet__facet-value">
      <Checkbox
        onChange={onChange}
        value={
          isDeselecting
            ? !(facetValueCompositeKey in selectionByFacetKey)
            : Boolean(selectionByFacetKey[facetValueCompositeKey])
        }
      />
      <PopoverTrigger
        className="logs__facet-group__facet__facet-value__label"
        component={LogsSelectedLogAttributePanel}
        props={{
          logFacet: { name, value: facetValue.facetValue },
          logsState,
          source,
        }}
        width={240}
      >
        {renderValue
          ? renderValue(facetValue.facetValue)
          : facetValue.facetValue}
      </PopoverTrigger>
      <div className="logs__facet-group__facet__facet-value__count">
        {count ? convertNumberToReadableUnit(count) : '-'}
      </div>
    </div>
  );
};

export default LogsFacetGroupFacetValue;
