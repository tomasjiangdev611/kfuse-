import classnames from 'classnames';
import {
  Resizer,
  ResizerOrientation,
  TooltipTrigger,
  useLeftSidebarState,
} from 'components';
import React, { ReactElement, ReactNode } from 'react';
import { Filter, Minimize2 } from 'react-feather';

type Props = {
  children: ReactNode;
  className?: string;
  leftSidebarState: ReturnType<typeof useLeftSidebarState>;
};

const LeftSidebar = ({
  children,
  className = '',
  leftSidebarState,
}: Props): ReactElement => {
  const { hide, onResize, width } = leftSidebarState;
  if (width === 0) {
    return null;
  }

  return (
    <div
      className={classnames({
        'left-sidebar': true,
        [className]: className,
      })}
      style={{ width: `${width}px` }}
    >
      <div className="left-sidebar__inner">
        <div className="left-sidebar__header">
          <div className="left-sidebar__title">
            <div className="left-sidebar__title__icon">
              <Filter size={18} />
            </div>
            <div className="left-sidebar__title__text">Filters</div>
            <TooltipTrigger
              className="left-sidebar__title__button"
              tooltip="Hide Filters"
            >
              <button className="button button--icon" onClick={hide}>
                <Minimize2 size={12} />
              </button>
            </TooltipTrigger>
          </div>
        </div>
        <div className="left-sidebar__body">{children}</div>
      </div>
      <Resizer
        onMouseMove={onResize}
        orientation={ResizerOrientation.vertical}
      />
    </div>
  );
};

export default LeftSidebar;
