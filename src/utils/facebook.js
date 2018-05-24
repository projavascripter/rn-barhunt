// import {FBLoginManager} from 'react-native-facebook-login';

const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} = FBSDK;


export const facebookLogin = function () {
  return new Promise((resolve, reject) => {
    // Attempt a login using the Facebook login dialog,
    // asking for default permissions.
    LoginManager.logInWithReadPermissions(["email", "user_friends"]).then(
      function (result, a) {
        if (result.isCancelled) {
          alert('Login was cancelled');
        } else {
          // alert('Login was successful with permissions: '
          //   + result.grantedPermissions.toString());

          // logged in
          const infoRequest = new GraphRequest(
            '/me',
            {
              parameters: {
                fields: {
                  string: 'email,name,first_name,middle_name,last_name,picture.type(large)' // what you want to get
                },
              }
            },
            (err, result) => {

              // console.log(`here is an log for obj`);
              // console.log(result);
              resolve(result);

            }
          );

          new GraphRequestManager().addRequest(infoRequest).start();

        }
      },
      function (error) {
        alert('Login failed with error: ' + error);
      }
    );
  })
}

export const facebookLogout = () => {
  LoginManager.logOut();
}
