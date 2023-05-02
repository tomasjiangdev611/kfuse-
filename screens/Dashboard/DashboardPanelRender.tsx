import { useToastmasterContext } from 'components/Toasts';
import React, { ReactElement, useMemo } from 'react';
import ReactGridLayout, { Responsive, WidthProvider } from 'react-grid-layout';

import { GRID_CELL_HEIGHT, GRID_CELL_VMARGIN } from './constants';
import DashboardPanelModal from './DashboardPanelModal';
import DashboardPanelWrapper from './DashboardPanelWrapper';
import { useDashboardState, useDashboardTemplateState } from './hooks';
import { DashboardPanelRow } from './Panels';
import { DashboardPanelProps, DashboardPanelType } from './types';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const DashboardPanelRender = ({
  baseHeight,
  baseWidth,
  dashboardState,
  dashboardTemplateState,
  disableEditPanel,
  nestedIndex,
  panels,
}: {
  baseHeight: number;
  baseWidth: number;
  dashboardState: ReturnType<typeof useDashboardState>;
  dashboardTemplateState: ReturnType<typeof useDashboardTemplateState>;
  disableEditPanel?: boolean;
  nestedIndex?: string;
  panels: DashboardPanelProps[];
}): ReactElement => {
  const { addPlaceholder, dragItemSize, panelSetupModal, updateLayoutChanges } =
    dashboardState;
  const { addToast } = useToastmasterContext();

  const onDrop = (
    layout: ReactGridLayout.Layout[],
    item: ReactGridLayout.Layout,
    e: Event,
  ) => {
    const widgetType = e.dataTransfer.getData('widgetType');

    if (widgetType === 'group' && nestedIndex) {
      addToast({ text: 'You cannot nest groups', status: 'error' });
      return;
    }

    panelSetupModal.push(
      <DashboardPanelModal
        baseWidth={baseWidth}
        close={() => {
          panelSetupModal.pop();
          addPlaceholder();
        }}
        dashboardState={dashboardState}
        dashboardTemplateState={dashboardTemplateState}
        layout={item}
        nestedIndex={nestedIndex}
        panelType={widgetType}
      />,
    );
  };

  const layouts = useMemo(() => {
    return panels.map((panel) => {
      return { ...panel.gridPos, i: `${panel.id}-${Date.now()}` };
    });
  }, [panels]);

  let isCollapsed = false;
  return (
    <ResponsiveReactGridLayout
      className={`dashboard__react-grid-layout ${
        nestedIndex ? `nested-${nestedIndex}` : ''
      }`}
      cols={{ lg: 24, md: 10, sm: 6, xs: 4, xxs: 2 }}
      droppingItem={{
        i: 'placeholder',
        w: dragItemSize.w,
        h: dragItemSize.h,
      }}
      isDroppable={true}
      isDraggable={!disableEditPanel}
      layouts={{ lg: layouts }}
      margin={[GRID_CELL_VMARGIN, GRID_CELL_VMARGIN]}
      onDrop={onDrop}
      onDragStart={(a, b, c, d, e) => e.stopPropagation()}
      onLayoutChange={(layout) => {
        if (disableEditPanel) return;
        updateLayoutChanges(layout, nestedIndex);
      }}
      rowHeight={GRID_CELL_HEIGHT}
      style={{ minHeight: 30 }}
      width={baseWidth - 64}
    >
      {panels.map((panel, idx) => {
        const prop = {
          baseHeight,
          baseWidth,
          dashboardState,
          dashboardTemplateState,
          disableEditPanel,
          panel,
          panelIndex: idx,
          nestedIndex,
        };

        if (panel.type === DashboardPanelType.ROW) {
          isCollapsed = panel.collapsed;
          return (
            <div
              key={`${idx}`}
              data-grid={panel.gridPos}
              style={{ zIndex: panels.length - idx }}
            >
              <DashboardPanelRow {...prop} />
            </div>
          );
        }

        if (isCollapsed) {
          return null;
        }

        if (panel.type === DashboardPanelType.GROUP && !panel.title) {
          return (
            <div
              key={`${idx}`}
              data-grid={panel.gridPos}
              style={{ zIndex: panels.length - idx }}
              draggable={false}
            >
              <DashboardPanelRender
                baseHeight={baseHeight}
                baseWidth={baseWidth}
                dashboardState={dashboardState}
                dashboardTemplateState={dashboardTemplateState}
                nestedIndex={`${idx}`}
                panels={panel.panels}
              />
            </div>
          );
        }

        return (
          <div
            key={`${idx}`}
            data-grid={panel.gridPos}
            style={{ zIndex: panels.length - idx }}
            draggable={false}
          >
            <DashboardPanelWrapper {...prop} />
          </div>
        );
      })}
    </ResponsiveReactGridLayout>
  );
};

export default DashboardPanelRender;
