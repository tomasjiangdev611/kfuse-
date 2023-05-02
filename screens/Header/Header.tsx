import classnames from 'classnames';
import { PopoverTriggerV2, PopoverPosition } from 'components';
import { useAuth, useUrlSearchParams } from 'hooks';
import React, { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import { pickUrlSearchParamsByKeys } from 'utils';

import HeaderPanel from './HeaderPanel';
import HeaderUserPanel from './HeaderUserPanel';
import {
  alertsSubmenu,
  apmSubmenu,
  eventsSubmenu,
  grafanaSubmenu,
  infrastructureSubmenu,
  kfuseSubmenu,
  kubernetesSubmenu,
  logsSubmenu,
  metricsSubmenu,
} from './utils';

const getLinks = (urlSearchParams: URLSearchParams) => [
  {
    key: 'apm',
    label: 'APM',
    panel: <HeaderPanel items={apmSubmenu} urlSearchParams={urlSearchParams} />,
    route: `/apm/services${pickUrlSearchParamsByKeys(urlSearchParams, [
      'date',
    ])}`,
  },
  {
    key: 'metrics',
    label: 'Metrics',
    panel: <HeaderPanel items={metricsSubmenu} />,
    route: '/metrics',
  },
  {
    key: 'logs',
    label: 'Logs',
    panel: <HeaderPanel items={logsSubmenu} />,
    route: '/logs',
  },
  {
    key: 'Events',
    label: 'Events',
    panel: <HeaderPanel items={eventsSubmenu} />,
    route: '/events',
  },
  {
    key: 'Alerts',
    label: 'Alerts',
    panel: <HeaderPanel items={alertsSubmenu} />,
    route: '/alerts',
  },
  {
    key: 'grafana-metrics',
    label: 'Grafana',
    panel: <HeaderPanel items={grafanaSubmenu} />,
    route: '/grafana-metrics',
  },
  // {
  //   key: 'CI-CD',
  //   label: 'CI-CD',
  //   panel: <HeaderPanel items={cicdSubmenu} />,
  //   route: '/cicd',
  // },
  {
    key: 'infrastructure',
    label: 'Infrastructure',
    panel: <HeaderPanel items={infrastructureSubmenu} />,
    route: '/kubernetes',
  },
  {
    key: 'analytics',
    label: 'Analytics',
    panel: <HeaderPanel items={kubernetesSubmenu} />,
    route: '/analytics/services',
  },
];

const getLinksRight = (urlSearchParams: URLSearchParams) => [
  {
    key: 'control-plane',
    label: 'Control Plane',
    panel: <HeaderPanel items={kfuseSubmenu} />,
    route: '/kfuse/overview',
  },
];

type Props = {
  auth: ReturnType<typeof useAuth>;
};

const Header = ({ auth }: Props): ReactElement => {
  const urlSearchParams = useUrlSearchParams();
  const { user } = auth;
  return (
    <div className="header">
      <NavLink className="header__home" to="/">
        K
      </NavLink>
      <div className="header__nav">
        {getLinks(urlSearchParams).map((link) => (
          <div
            className={classnames({
              header__nav__item: true,
            })}
            key={link.key}
          >
            <NavLink
              className={({ isActive }) =>
                classnames({
                  header__nav__item__link: true,
                  'header__nav__item__link--active': isActive,
                })
              }
              to={link.route}
            >
              {link.label}
            </NavLink>
            {link.panel ? link.panel : null}
          </div>
        ))}
      </div>
      <div>
        {getLinksRight(urlSearchParams).map((link) => (
          <div
            className={classnames({ header__nav__item: true })}
            key={link.key}
          >
            <NavLink
              className={({ isActive }) =>
                classnames({
                  header__nav__item__link: true,
                  'header__nav__item__link--active': isActive,
                })
              }
              to={link.route}
            >
              {link.label}
            </NavLink>
            {link.panel ? link.panel : null}
          </div>
        ))}
      </div>
      <PopoverTriggerV2
        className="header__user"
        popover={(props) => <HeaderUserPanel {...props} auth={auth} />}
        position={PopoverPosition.BOTTOM_RIGHT}
      >
        <img
          className="header__user__avatar"
          referrerPolicy="no-referrer"
          src={user.imageUrl}
        />
      </PopoverTriggerV2>
    </div>
  );
};

export default Header;
