// PATH: arena/firebase-config.js
//
// The arena's OWN Firebase project (dfwgv-arena), separate from the planners' project: its
// Firestore holds only the arena's collections and its Authentication holds only arena
// sign-ins. Fill these from the Firebase console: Project settings -> General -> Your apps
// -> the Web app -> SDK setup and configuration ("npm" tab shows the object). These values
// are public by design; the security rules and the bot are what guard the data.
//
// Until projectId is filled in, the page shows the stream and the bestiary and reports that
// sign-in is not set up yet.
export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  appId: ""
};
