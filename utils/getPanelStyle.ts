import { PanelPosition, PanelState } from 'types';

const CONTAINER_BUFFER = 0;
const CONTAINER_HEIGHT = 200;
const CONTAINER_WIDTH = 400;

const getPanelStyle = (position: PanelPosition, state: PanelState) => {
  const { left, height, width, top } = state;
  switch (position) {
    case PanelPosition.BOTTOM_LEFT:
      return {
        height: `${CONTAINER_HEIGHT}px`,
        width: `${CONTAINER_WIDTH}px`,
        top: `${top + height + CONTAINER_BUFFER}px`,
        left: `${left}px`,
      };

    case PanelPosition.BOTTOM_RIGHT:
      return {
        height: `${CONTAINER_HEIGHT}px`,
        width: `${CONTAINER_WIDTH}px`,
        top: `${top + height + CONTAINER_BUFFER}px`,
        left: `${left - (CONTAINER_WIDTH - width)}px`,
      };

    case PanelPosition.LEFT:
      return {
        height: `${CONTAINER_HEIGHT}px`,
        width: `${CONTAINER_WIDTH}px`,
        top: `${top + height / 2 - CONTAINER_HEIGHT / 2}px`,
        left: `${left - CONTAINER_WIDTH - CONTAINER_BUFFER}px`,
      };

    case PanelPosition.TOP:
      return {
        height: `${CONTAINER_HEIGHT}px`,
        width: `${CONTAINER_WIDTH}px`,
        top: `${top - CONTAINER_HEIGHT - CONTAINER_BUFFER}px`,
        left: `${left + width / 2 - CONTAINER_WIDTH / 2}px`,
      };

    case PanelPosition.TOP_LEFT:
      return {
        height: `${CONTAINER_HEIGHT}px`,
        width: `${CONTAINER_WIDTH}px`,
        top: `${top - CONTAINER_HEIGHT - CONTAINER_BUFFER}px`,
        left: `${left}px`,
      };

    case PanelPosition.TOP_RIGHT:
      return {
        height: `${CONTAINER_HEIGHT}px`,
        width: `${CONTAINER_WIDTH}px`,
        top: `${top - CONTAINER_HEIGHT - CONTAINER_BUFFER}px`,
        left: `${left - (CONTAINER_WIDTH - width)}px`,
      };

    default:
      return {};
  }
};

export default getPanelStyle;
