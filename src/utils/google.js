import {GoogleSignin} from 'react-native-google-signin';

let alreadyInit = false;

const initGoogleSignin = async () => {
  await GoogleSignin.hasPlayServices({autoResolve: true});
  await GoogleSignin.configure({
    forceConsentPrompt: true, hostedDomain: '',
    iosClientId: "472107255951-72uu587vuquodhkuhdoocnob81cmj4ju.apps.googleusercontent.com",
  })
};

const getGoogleSignin = async () => {
  if (!alreadyInit) {
    await initGoogleSignin();
    alreadyInit = true;
  }

  return GoogleSignin;
};

const isGoogleSessionExists = async() => {

  // if there is google session, log google log out
  let google = await getGoogleSignin();
  const user = google.currentUser(); // if able to get the user, means this is google login

  // if there is no session, user is {}
  if (Object.keys(user).length !== 0) {
    // await google.signOut();
    return true;
  }

  return false;

}

export default {getGoogleSignin, isGoogleSessionExists};