export enum PanelPosition {
  BOTTOM = 'bottom',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right',
  LEFT = 'left',
  RIGHT = 'right',
  TOP = 'top',
  TOP_LEFT = 'top-left',
  TOP_RIGHT = 'top-right',
}

export type PanelState = {
  height: number;
  width: number;
  top: number;
  left: number;
};

export enum PanelType {
  popover = 'popover',
  tooltip = 'tooltip',
}
