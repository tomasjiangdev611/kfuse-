import { AutocompleteV2, AutocompleteOption, Input } from 'components';
import React, { ReactElement } from 'react';
import { MdDelete } from 'react-icons/md';

import {
  MetricLabelOperatorOptions,
  parseMetricLabelQuery,
} from 'utils/MetricsQueryBuilder';

const MetricsQueryBuilderSeriesBuilder = ({
  labelIndex,
  labelKey,
  labelList,
  labelValueList,
  onLabelChange,
  onOperatorChange,
  onValueChange,
  removeLabel,
}: {
  labelIndex: number;
  labelKey: string;
  labelList: AutocompleteOption[];
  labelValueList: { [key: string]: AutocompleteOption[] };
  onLabelChange: (labelIndex: number, newLabel: string) => void;
  onOperatorChange: (
    labelIndex: number,
    newOperator: string,
    operator: string,
  ) => void;
  onValueChange: (labelIndex: number, newValue: string) => void;
  removeLabel: (labelIndex: number) => void;
}): ReactElement => {
  const { label, operator, value } = parseMetricLabelQuery(labelKey);

  return (
    <div className="metrics__query-builder__series__builder">
      <AutocompleteV2
        className="autocomplete-container--no-border metrics__query-builder__series__builder--label"
        isClearable={false}
        isSearchable={true}
        onChange={(val) => {
          const trimedVal = val.slice(0, -3);
          onLabelChange(labelIndex, `${trimedVal}${operator}""`);
        }}
        options={labelList}
        value={`${label}=""`}
      />
      <AutocompleteV2
        className="autocomplete-container--no-border metrics__query-builder__series__builder--operator"
        isClearable={false}
        isSearchable={false}
        onChange={(val) => onOperatorChange(labelIndex, val, operator)}
        options={MetricLabelOperatorOptions}
        value={operator}
      />
      {operator === '=~' || operator === '!~' ? (
        <Input
          className="input--no-border metrics__query-builder__series__builder--input"
          onChange={(val) => onValueChange(labelIndex, val)}
          type="text"
          value={value as string}
        />
      ) : (
        <AutocompleteV2
          className="autocomplete-container--no-border"
          isClearable={false}
          onChange={(val) => onValueChange(labelIndex, val)}
          options={labelValueList[label] || []}
          value={value as string}
        />
      )}
      <div
        className="metrics__query-builder__series__builder__delete"
        onClick={() => removeLabel(labelIndex)}
      >
        <MdDelete />
      </div>
    </div>
  );
};

export default MetricsQueryBuilderSeriesBuilder;
