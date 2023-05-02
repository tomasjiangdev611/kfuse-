import { AutocompleteOption } from 'components';

export type AutocompleteOptionStateProps = {
  facetNames: AutocompleteOption[];
  facetValues: { [key: string]: AutocompleteOption[] };
};

export type Operator = '=' | '!=' | '>' | '<' | '>=' | '<=' | '=~' | '!~';
export type OptionType = 'facet' | 'label' | 'value' | 'search';

export type SearchItemProps = {
  facetName: string;
  operator: string;
  value: string;
  optionType?: OptionType;
};

export type SearchBarTagsProps = {
  label: string;
  onClick: () => void;
  onEdit?: () => void;
};

export type RenderPanelProps = {
  nextTyped: string;
  options: AutocompleteOption[];
  optionType?: OptionType;
  operatorSign: string;
  searchInputValue: string;
};
