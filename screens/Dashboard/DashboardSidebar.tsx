import RightSidebar from 'components/RightSidebar';
import React, { ReactElement, useRef } from 'react';

import { useDashboardState } from './hooks';
import { getPanelWidgetSize, widgetList } from './utils';

const DashboardSidebar = ({
  dashboardState,
}: {
  dashboardState: ReturnType<typeof useDashboardState>;
}): ReactElement => {
  const {
    addPlaceholder,
    isRightSidebarOpenToggle,
    removePlaceholder,
    setDragItemSize,
  } = dashboardState;

  return (
    <div>
      {isRightSidebarOpenToggle.value && (
        <RightSidebar
          className="dashboard__right-sidebar"
          close={isRightSidebarOpenToggle.off}
          closeOnOutsideClick={() => {}}
          title="Add Widget"
        >
          <div className="dashboard__right-sidebar__box">
            {widgetList.map((widget) => {
              return (
                <div
                  key={widget.name}
                  className="dashboard__right-sidebar__widget"
                >
                  <div className="dashboard__right-sidebar__widget__title">
                    {widget.label}
                  </div>
                  <div>
                    {widget.list.map((item) => {
                      const ref = useRef<HTMLDivElement>(null);
                      return (
                        <div
                          className="dashboard__right-sidebar__widget__item"
                          key={item.name}
                          draggable={true}
                          ref={ref}
                          unselectable="on"
                          onDragStart={(e) => {
                            e.dataTransfer.setData('widgetType', item.name);
                            const panelSize = getPanelWidgetSize(item.name);
                            setDragItemSize(panelSize);
                            removePlaceholder();
                          }}
                          onDragEnd={() => {
                            addPlaceholder();
                          }}
                        >
                          {item.icon && item.icon}
                          <div>{item.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </RightSidebar>
      )}
    </div>
  );
};

export default DashboardSidebar;
