import classNames from 'classnames';
import { TooltipTrigger } from 'components/TooltipTrigger';
import React, { ReactElement } from 'react';
import { AiOutlineFullscreen, AiOutlineInfo } from 'react-icons/ai';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { PanelPosition } from 'types';

import DashboardPanelModal from '../DashboardPanelModal';
import { DashboardFullscreenPanel } from '../Fullscreen';
import { useDashboardState, useDashboardTemplateState } from '../hooks';
import { DashboardPanelProps, DashboardPanelType } from '../types';
import { transformTitle } from '../utils';

const DashboardPanelHeader = ({
  baseHeight,
  baseWidth,
  className,
  dashboardState,
  dashboardTemplateState,
  disableEditPanel,
  nestedIndex,
  onClickHeader,
  onDelete,
  panel,
}: {
  baseHeight?: number;
  baseWidth?: number;
  className?: string;
  dashboardState?: ReturnType<typeof useDashboardState>;
  dashboardTemplateState?: ReturnType<typeof useDashboardTemplateState>;
  disableEditPanel?: boolean;
  nestedIndex?: string;
  onClickHeader: () => void;
  onDelete: () => void;
  onEdit: () => void;
  panel: DashboardPanelProps;
}): ReactElement => {
  const { date, panelSetupModal } = dashboardState;
  const { templateValues } = dashboardTemplateState;

  const onEdit = () => {
    const { gridPos } = panel;
    panelSetupModal.push(
      <DashboardPanelModal
        baseWidth={baseWidth}
        close={() => panelSetupModal.pop()}
        dashboardState={dashboardState}
        dashboardTemplateState={dashboardTemplateState}
        layout={gridPos}
        nestedIndex={nestedIndex}
        panel={panel}
        panelType={panel.type}
      />,
    );
  };

  const onViewFullscreen = () => {
    panelSetupModal.push(
      <DashboardFullscreenPanel
        baseHeight={baseHeight}
        baseWidth={baseWidth}
        close={() => panelSetupModal.pop()}
        date={date}
        panel={panel}
        templating={templating}
      />,
    );
  };

  return (
    <div
      className={classNames({
        'dashboard-panel__header': true,
        'dashboard-panel__header--group':
          panel.type === DashboardPanelType.GROUP,
        [className]: className,
      })}
      onClick={onClickHeader}
    >
      <div>
        {panel.description && (
          <TooltipTrigger
            tooltip={
              <div className="dashboard-panel__header__panel-info">
                <div className="dashboard-panel__header__panel-info__description">
                  {panel.description}
                </div>
                {panel.links && panel.links.length > 0 && (
                  <div>
                    {panel.links.map((link) => (
                      <a
                        className="link"
                        href={link.url}
                        key={link.url}
                        target={link.targetBlank ? '_blank' : '_self'}
                        rel="noreferrer"
                      >
                        {link.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            }
            position={PanelPosition.RIGHT}
          >
            <div className="dashboard-panel__header__info">
              <span className="dashboard-panel__header__info--inner">
                <AiOutlineInfo />
              </span>
            </div>
          </TooltipTrigger>
        )}
        <div
          className={classNames({
            'dashboard-panel__header__title': true,
            'dashboard-panel__header__info--active': panel.description,
          })}
        >
          {transformTitle(panel.title || '', templateValues)}
        </div>
      </div>
      <div className="dashboard-panel__header__actions">
        {!disableEditPanel && (
          <>
            <div className="dashboard-panel__header__actions__icon--edit">
              <MdModeEdit onClick={onEdit} />
            </div>
            <div className="dashboard-panel__header__actions__icon--delete">
              <MdDelete onClick={onDelete} />
            </div>
          </>
        )}
        {panel.type === DashboardPanelType.TIMESERIES && (
          <div className="dashboard-panel__header__actions__icon--edit">
            <AiOutlineFullscreen onClick={onViewFullscreen} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPanelHeader;
