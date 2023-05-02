import { useSelectedFacetValuesByNameState } from 'hooks';
import useEventsState from './hooks/useEventsState';
import { AutocompleteOption } from 'components';

export type EventPageProps = {
  selectedFacetValuesByNameState?: ReturnType<
    typeof useSelectedFacetValuesByNameState
  >;
  eventsState?: ReturnType<typeof useEventsState>;
};

type OptionType = Pick<AutocompleteOption, 'optionType'>;
type SearchItemProps = {
  facet: string;
  value: string;
  operator: string;
};

export type EventSearchItemProps = SearchItemProps & OptionType;
