// PATH: site/firebase-config.js
//
// The SAME Firebase project as the board-game planner (dfwgv-planner).
// This is what makes one sign-in cover both planners.
//
// Firebase Auth persists the signed-in user in IndexedDB under the key
// `firebase:authUser:<apiKey>:[DEFAULT]`, and IndexedDB is scoped to the
// browser origin. So the session is shared only when all three match:
//
//   1. same origin      -> both sites served from https://www.dfwgamingvillage.com
//   2. same apiKey      -> the config below is byte-for-byte the planner's
//   3. same app name    -> both call initializeApp() with no name ([DEFAULT])
//
// Change any one of those and users have to sign in twice. In particular,
// putting this planner on its own subdomain would break the shared session.
//
// These values are public by design (they identify the project, they don't
// grant access — Firestore rules and callables do that).

export const firebaseConfig = {
  apiKey: "AIzaSyDJYFPuNFgrhGCQQR6_X1IE4QqYDwZ6Vfk",
  authDomain: "dfwgv-planner.firebaseapp.com",
  projectId: "dfwgv-planner",
  appId: "1:699390463926:web:b47c0402e1b170c2233b17"
};

// Must match the SDK the board-game planner loads, so both sites share one
// cached copy and one auth implementation.
export const FIREBASE_SDK = "https://www.gstatic.com/firebasejs/10.14.1";
