import { ReactNode } from 'react';

export type AutocompleteOption = {
  disabled?: boolean;
  label: ReactNode;
  value: string;
  optionType?: 'label' | 'facet' | 'value' | 'search';
};

export type AutocompleteListProps = {
  close: () => void;
  options: AutocompleteOption[];
  searchOption: AutocompleteOption;
  onClickHandler: (
    close: () => void,
    value: any,
    type: 'mouse' | 'key',
  ) => void;
  typed: string;
  optionType?: 'facet' | 'label' | 'value' | 'search';
};
