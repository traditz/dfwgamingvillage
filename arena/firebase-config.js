// PATH: arena/firebase-config.js
//
// The arena's OWN Firebase project (dfwgv-arena), separate from the planners' project: its
// Firestore holds only the arena's collections and its Authentication holds only arena
// sign-ins. These values come from the Firebase console (Project settings -> General ->
// Your apps -> the Web app) and are public by design; the security rules and the bot are
// what guard the data.
export const firebaseConfig = {
  apiKey: "AIzaSyAUhnaZD3674qXm4jSeVir2V6o8IjmLJ3I",
  authDomain: "dfwgv-arena.firebaseapp.com",
  projectId: "dfwgv-arena",
  storageBucket: "dfwgv-arena.firebasestorage.app",
  messagingSenderId: "9803611342",
  appId: "1:9803611342:web:14473bec72c5974e89249f"
};
