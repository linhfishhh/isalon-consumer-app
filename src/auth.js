import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager
} from 'react-native-fbsdk';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';

export const facebookLogin = (
  success = data => {},
  error = (errorType, errorData) => {},
  cancel = () => {}
) => {
  LoginManager.logOut();
  LoginManager.logInWithPermissions(['public_profile', 'email']).then(
    function(result) {
      if (result.isCancelled) {
        cancel();
      } else {
        AccessToken.getCurrentAccessToken().then(data => {
          const { accessToken } = data;
          const infoRequest = new GraphRequest(
            '/me?fields=name,picture,email',
            null,
            (err, result) => {
              if (err) {
                error('info', err);
              } else {
                success({
                  token: accessToken,
                  name: result.name,
                  email: result.email,
                  provider: 'facebook'
                });
              }
            }
          );
          // Start the graph request.
          new GraphRequestManager().addRequest(infoRequest).start();
        });
      }
    },
    function(err) {
      error('login', err);
    }
  );
};

export const googleLogin = async (
  success = data => {},
  error = (errorType, errorData) => {},
  cancel = () => {}
) => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    success({
      token: userInfo.accessToken,
      name: userInfo.user.name,
      email: userInfo.user.email,
      provider: 'google'
    });
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      cancel();
    } else if (error.code === statusCodes.IN_PROGRESS) {
      error('IN_PROGRESS', error);
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      error('PLAY_SERVICES_NOT_AVAILABLE', error);
    } else {
      error('login', error);
    }
  }
};
