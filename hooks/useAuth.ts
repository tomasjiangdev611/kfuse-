/* global gapi */
import { useRequest } from 'hooks';
import {
  getAuthConfig,
  login,
  logout as logoutRequest,
  verifyAuth,
} from 'requests';

const noneUser = {
  name: 'guest',
  email: 'noreply@kloudfuse.com',
  imageUrl:
    'http://www.gravatar.com/avatar/04d24379cd970b7670ee66fa203d646f?s=128&r=any&default=identicon&forcedefault=1',
};

const useAuth = () => {
  const getAuthConfigRequest = useRequest(getAuthConfig);
  const loginRequest = useRequest(login);
  const verifyAuthRequest = useRequest(verifyAuth);

  const authenticateWithPassword = ({ password, username }) => {
    loginRequest.call({
      password,
      username,
    });
  };

  const authenticateWithGoogle = () => {
    if (getAuthConfigRequest.result) {
      const { clientId } = getAuthConfigRequest.result;
      const onLoad = () => {
        gapi.auth2
          .init({
            client_id: clientId,
            plugin_name: 'chat',
          })
          .then((auth) => {
            auth.signIn().then((googleUser) => {
              loginRequest.call({
                idToken: googleUser.getAuthResponse().id_token,
              });
            });
          });
      };

      gapi.load('auth2', onLoad);
    }
  };

  const clearError = () => {
    loginRequest.clearError();
  };

  const init = () => {
    getAuthConfigRequest.call();
    verifyAuthRequest.call();
  };

  const logout = async () => {
    await logoutRequest();
    window.location?.reload();
  };

  return {
    authorityType: getAuthConfigRequest.result?.authType || null,
    authenticateWithGoogle,
    authenticateWithPassword,
    clearError,
    isAuthenticating: loginRequest.isLoading,
    loginError: loginRequest.error,
    logout,
    shouldShowLogin: verifyAuthRequest.error,
    user:
      getAuthConfigRequest.result?.authType === 'none'
        ? noneUser
        : verifyAuthRequest.result || loginRequest.result,
    init,
  };
};

export default useAuth;
