import { useAuth } from 'hooks';
import React from 'react';

type Props = {
  auth: ReturnType<typeof useAuth>;
};

const Login = ({ auth }: Props) => {
  return (
    <div className="login">
      <div className="login__form">
        <button
          className="button button--block"
          onClick={auth.authenticateWithGoogle}
          type="button"
        >
          <div
            className="button__img"
            style={{ backgroundImage: 'url("https://developers.google.com/static/identity/images/g-logo.png")' }}
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
