import * as firebase from "firebase";
import * as firebaseui from "firebaseui";

// Get the Firebase config from the auto generated file.
import firebaseConfig from "./keys/config";

// Instantiate a Firebase app.
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.firestore();
database.settings({
  timestampsInSnapshots: true
});

// FirebaseUI config
export const uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: () => false
  },
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  signInFlow: "popup",
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
    }
  ]
};

export function auth() {
  return app.auth();
}

export function db() {
  return database;
}
