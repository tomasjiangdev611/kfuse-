import React, { ReactElement } from 'react';
import { NavigateFunction, NavLink, useNavigate } from 'react-router-dom';

import { SubMenuProps } from './types';

type Props = {
  items: (
    nav: NavigateFunction,
    urlSearchParams?: URLSearchParams,
  ) => SubMenuProps[];
  urlSearchParams?: URLSearchParams;
};

const HeaderPanel = ({ items, urlSearchParams }: Props): ReactElement => {
  const navigate = useNavigate();

  return (
    <div className="header__nav__item__panel">
      {items(navigate, urlSearchParams).map((item, i) => (
        <NavLink
          className="header__nav__item__panel__item"
          key={i}
          to={item.route}
        >
          <div className="header__nav__item__panel__item__icon">
            {item.icon}
          </div>
          <div className="header__nav__item__panel__item__label">
            {item.label}
          </div>
        </NavLink>
      ))}
    </div>
  );
};

export default HeaderPanel;
