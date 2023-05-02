import { Multiselect, SelectV2 } from 'components';
import { useRequest, useSearch } from 'hooks';
import React from 'react';
import { DateSelection, LimitTo, Operation, TracesTab } from 'types';
import { calcAutoRollUpInSeconds, formatDurationNs } from 'utils';
import { SelectOption } from '../Select';

const getNextGroupBys = (nextValue: string[]) => {
  if (nextValue.length > 1) {
    return nextValue.filter((value) => value !== '*');
  }

  if (nextValue.length === 0) {
    return ['*'];
  }

  return nextValue;
};

const limitToOptions = Object.keys(LimitTo).map((limitTo) => ({
  label: limitTo,
  value: limitTo,
}));

const limitToValueOptions = [
  { label: 5, value: 5 },
  { label: 10, value: 10 },
];

const getRollUpInSecondsOptions = (date: DateSelection) => {
  const autoRollUpInSeconds = calcAutoRollUpInSeconds(date);
  return [
    {
      label: `${formatDurationNs(autoRollUpInSeconds * 1000000000)} (auto)`,
      value: null,
    },
    { label: '1s', value: 1 },
    { label: '2s', value: 2 },
    { label: '5s', value: 5 },
    { label: '10s', value: 10 },
    { label: '20s', value: 20 },
    { label: '30s', value: 30 },
    { label: '1m', value: 60 },
    { label: '2m', value: 120 },
  ];
};

const operationOptions: SelectionOption[] = Object.values(Operation)
  .filter((operation) => operation !== Operation.distinctcount)
  .map((operation) => ({
    label: operation,
    value: operation,
  }));

const getShouldShowSaveMetricButton = (
  search: ReturnType<typeof useSearch>,
) => {
  const { groupBys, measure, operation } = search;
  return !(
    groupBys.length === 1 &&
    groupBys[0] === '*' &&
    measure === null &&
    operation === Operation.distinctcount
  );
};

type Props = {
  date: DateSelection;
  groupByOptions: SelectOption[];
  measureOptions: SelectOption[];
  search: ReturnType<typeof useSearch>;
  tracesTab: TracesTab;
};

const SearchGrouper = ({
  date,
  groupByOptions,
  measureOptions,
  search,
  tracesTab,
}: Props) => {
  const {
    changeGroupBys,
    changeLimitTo,
    changeLimitToValue,
    changeMeasure,
    changeOperation,
    changeRollUpInSeconds,
    groupBys,
    limitTo,
    limitToValue,
    measure,
    operation,
    rollUpInSeconds,
  } = search;

  if (tracesTab !== TracesTab.timeseries) {
    return null;
  }

  const operationPlaceholder =
    measure === null ? 'Count of' : 'Count unique of';
  const rollUpInSecondsOptions = getRollUpInSecondsOptions(date);

  const changeGroupBysHandler = (nextValue: string[]) => {
    changeGroupBys(getNextGroupBys(nextValue));
  };

  return (
    <div className="search__grouper">
      <div className="search__button-group">
        <div className="button-group">
          <div className="button-group__item button-group__item--label">
            Group into fields:
          </div>
        </div>
        <div className="search__button-group__divider">
          <div />
        </div>
        <div className="button-group">
          <div className="button-group__item  button-group__item--label">
            Show
          </div>
          <div className="button-group__item button-group__item--value">
            {measure === 'duration' ? (
              <SelectV2.Select
                isAutocompleteEnabled
                onChange={changeOperation}
                options={operationOptions}
                value={operation}
              />
            ) : (
              operationPlaceholder
            )}
          </div>
          <div className="button-group__item">
            <SelectV2.Select
              isAutocompleteEnabled
              onChange={changeMeasure}
              options={measureOptions}
              value={measure}
            />
          </div>
        </div>
        <div className="search__button-group__divider">
          <div />
        </div>
        <div className="button-group">
          <div className="button-group__item  button-group__item--label">
            by
          </div>
          <div className="button-group__item button-group__item--multiselect">
            <Multiselect
              onChange={changeGroupBysHandler}
              options={groupByOptions}
              value={groupBys}
            />
          </div>
          <div className="button-group__item  button-group__item--label">
            limit to
          </div>
          <div className="button-group__item">
            <SelectV2.Select
              onChange={changeLimitTo}
              options={limitToOptions}
              value={limitTo}
            />
          </div>
          <div className="button-group__item">
            <SelectV2.Select
              onChange={changeLimitToValue}
              options={limitToValueOptions}
              value={limitToValue}
            />
          </div>
        </div>
        <div className="search__button-group__divider">
          <div />
        </div>
        <div className="button-group">
          <div className="button-group__item  button-group__item--label">
            roll up every
          </div>
          <div className="button-group__item">
            <SelectV2.Select
              onChange={changeRollUpInSeconds}
              options={rollUpInSecondsOptions}
              value={rollUpInSeconds}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchGrouper;
