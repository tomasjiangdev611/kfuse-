import { AutocompleteOption, PopoverPosition } from 'components';

export const anomalyAlgorithmType = [
  { label: 'RRCF', value: 'rrcf' },
  { label: 'basic', value: 'basic' },
];

export const globalHistoryType: AutocompleteOption[] = [
  { label: '2 hours', value: 'now-2h' },
  { label: '4 hours', value: 'now-4h' },
];

export const localHistoryType: AutocompleteOption[] = [
  { label: '1 minute', value: 'now-1m' },
  { label: '5 minutes', value: 'now-5m' },
  { label: '10 minutes', value: 'now-10m' },
  { label: '15 minutes', value: 'now-15m' },
];

export const secondaryLocalHistoryType: AutocompleteOption[] = [
  { label: '1 minute', value: 'now-1m' },
  { label: '5 minutes', value: 'now-5m' },
  { label: '10 minutes', value: 'now-10m' },
];

export const basicWindowType: AutocompleteOption[] = [
  { label: '1 minute', value: '1m' },
  { label: '2 minutes', value: '2m' },
  { label: '5 minutes', value: '5m' },
  { label: '10 minutes', value: '10m' },
  { label: '15 minutes', value: '15m' },
  { label: '30 minutes', value: '30m' },
  { label: '1 hour', value: '1h' },
  { label: '2 hours', value: '2h' },
  { label: '3 hours', value: '3h' },
  { label: '6 hours', value: '6h' },
  { label: '12 hours', value: '12h' },
  { label: '1 day', value: '1d' },
];

export const basicBoundType: AutocompleteOption[] = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
];

export const basicBandType: AutocompleteOption[] = [
  { label: 'upper', value: 'upper' },
  { label: 'lower', value: 'lower' },
  { label: 'both', value: 'both' },
];

export const getPopoverOffset = (rect: DOMRect): PopoverPosition => {
  if (rect && rect.left > document.body.clientWidth / 2) {
    return PopoverPosition.BOTTOM_LEFT;
  }
  return PopoverPosition.BOTTOM_LEFT;
};
