import { Checkbox, useThemeContext } from 'components';
import { useAuth } from 'hooks';
import React, { FC, ReactElement } from 'react';

type Props = {
  auth: ReturnType<typeof useAuth>;
};

const HeaderUserPanel: FC<Props> = ({ auth }: Props): ReactElement => {
  const { darkModeEnabled, toggleDarkMode, utcTimeEnabled, toggleUtcTime } =
    useThemeContext();

  const onClickLogout = async () => {
    auth.logout();
  };

  return (
    <div className="header__user__panel">
      <div className="header__user__panel__item">
        <div className="header__user__panel__item__label">Dark Mode</div>
        <div className="header__user__panel__item__value">
          <Checkbox onChange={toggleDarkMode} value={darkModeEnabled} />
        </div>
      </div>
      <div className="header__user__panel__item">
        <div className="header__user__panel__item__label">UTC Timezone</div>
        <div className="header__user__panel__item__value">
          <Checkbox onChange={toggleUtcTime} value={utcTimeEnabled} />
        </div>
      </div>
      {auth.authorityType === 'none' ? null : (
        <div className="header__user__panel__item">
          <div className="header__user__panel__item__label">
            <button className="link" onClick={onClickLogout}>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderUserPanel;
