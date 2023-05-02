export type PopoverCoordinates = {
  left: number;
  top: number;
  width: number;
};

export type PopoverOptions = {
  onClose?: () => void;
  right?: boolean;
  width?: number;
};
