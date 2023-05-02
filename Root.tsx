import { version } from 'constants';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import utc from 'dayjs/plugin/utc';
import { useAuth } from 'hooks';
import { hot } from 'react-hot-loader/root';
import React, { useEffect } from 'react';
import App from './screens/App';
import Login from './screens/Login';

dayjs.extend(relativeTime);
dayjs.extend(utc);

const Root = () => {
  const auth = useAuth();

  useEffect(() => {
    auth.init();
    console.log('version', version);
  }, []);

  if (auth.user) {
    return <App auth={auth} />;
  }

  if (auth.shouldShowLogin) {
    return <Login auth={auth} />;
  }

  return null;
};

export default hot(Root);
