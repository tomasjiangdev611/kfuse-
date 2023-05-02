import { Input } from 'components';
import { useAuth, useForm } from 'hooks';
import React from 'react';

type Props = {
  auth: ReturnType<typeof useAuth>;
};

const LoginPassword = ({ auth }: Props) => {
  const { authenticateWithPassword, clearError, loginError } = auth;
  const form = useForm({ password: '', username: '' });
  const { propsByKey, values } = form;

  const onChangeWrapper =
    (onChange: (nextValue: any) => void) => (nextValue: any) => {
      clearError();
      onChange(nextValue);
    };

  const usernameProps = propsByKey('username');
  const passwordProps = propsByKey('password');

  const submit = () => {
    authenticateWithPassword(values);
  };

  return (
    <div className="login">
      <div className="login__logo">Kloudfuse</div>
      <div className="login__form">
        <div className="login__form__field">
          <div className="login__form__field__label">Username</div>
          <div className="login__form__field__input">
            <Input
              autoFocus
              className="input"
              name="username"
              onChange={onChangeWrapper(usernameProps.onChange)}
              onEnter={submit}
              type="text"
              value={usernameProps.value}
            />
          </div>
        </div>
        <div className="login__form__field">
          <div className="login__form__field__label">Password</div>
          <div className="login__form__field__input">
            <Input
              className="input"
              name="password"
              onChange={onChangeWrapper(passwordProps.onChange)}
              onEnter={submit}
              type="password"
              value={passwordProps.value}
            />
          </div>
        </div>
        <div className="login__form__footer">
          <button
            className="button button--primary button--block"
            name="loginButton"
            type="button"
            onClick={submit}
          >
            Login
          </button>
        </div>
        {loginError ? (
          <div className="login__form__error">Login Failed</div>
        ) : null}
      </div>
    </div>
  );
};

export default LoginPassword;
