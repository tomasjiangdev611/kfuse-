import classNames from 'classnames';
import { FlyoutCaret } from 'components';
import React, { ReactElement } from 'react';

import { DashboardPanelComponentProps } from '../types';
import { getReloadPanelsNested, transformTitle } from '../utils';

const DashboardPanelRow = ({
  dashboardState,
  dashboardTemplateState,
  nestedIndex,
  panel,
  panelIndex,
}: DashboardPanelComponentProps): ReactElement => {
  const { reloadPanels, updatePanel, setReloadPanels } = dashboardState;
  const { templateValues } = dashboardTemplateState;

  return (
    <div
      className={classNames({
        dashboard__panel__row: true,
        'dashboard__panel__row--collapsed': panel.collapsed,
      })}
      onClick={() => {
        updatePanel(
          panelIndex,
          Number(nestedIndex),
          'collapsed',
          !panel.collapsed,
        );
        if (panel.panels && panel.collapsed) {
          setReloadPanels(
            getReloadPanelsNested(
              panel.panels,
              { ...reloadPanels },
              `${panelIndex}`,
            ),
          );
        }
      }}
    >
      <FlyoutCaret isOpen={!panel.collapsed} size={20} />
      {transformTitle(panel.title || '', templateValues)}
      {panel.panels && panel.panels.length > 0 && (
        <div className="dashboard__panel__row__count">
          ({panel.panels.length} Panels)
        </div>
      )}
    </div>
  );
};

export default DashboardPanelRow;
