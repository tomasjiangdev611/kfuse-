import React from 'react';
import LoginGoogle from './LoginGoogle';
import LoginPassword from './LoginPassword';

const Login = ({ auth }) => {
  const { authorityType } = auth;
  if (authorityType === 'google') {
    return <LoginGoogle auth={auth} />;
  }

  if (authorityType === 'password') {
    return <LoginPassword auth={auth} />;
  }

  return null;
};

export default Login;
