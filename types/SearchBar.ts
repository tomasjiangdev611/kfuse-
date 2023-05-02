import { AutocompleteOption } from 'components';
import { FacetBase } from './facet';

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

export type LabelsProps = {
  additional: FacetBase[];
  cloud: FacetBase[];
  core: FacetBase[];
  kubernetes: FacetBase[];
};

export type SearchBarState = {
  filterByFacets: string[];
  removeFilterByFacetByIndex: (index: number) => void;
  removeSearchTermByIndex: (index: number) => void;
  searchTerms: string[];
};

export type AddSearchFilterProps = {
  addSearchTerm: (term: string) => void;
  addFilterByFacet: (val: SearchItemProps) => void;
};

export type RenderAutocompletePanelProps = {
  nextTyped: string;
  options: AutocompleteOption[];
  optionType?: OptionType;
  operatorSign: string;
  searchInputValue: string;
};

export type AutocompleteOptionStateProps = {
  facetNames: AutocompleteOption[];
  facetValues: { [key: string]: AutocompleteOption[] };
};
