import fb from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";
import "firebase/compat/analytics";


const firebaseApp = fb.initializeApp({
  apiKey: "AIzaSyBwwlZrIuNVRXc_y-c5DIXyeHpkdt-K6dU",
  authDomain: "instagram-feada.firebaseapp.com",
  projectId: "instagram-feada",
  storageBucket: "instagram-feada.appspot.com",
  messagingSenderId: "511427858998",
  appId: "1:511427858998:web:34bbd6fe1d2434cf05be97"
  // measurementId: "G-WSGFNDVN65"
});

const analytics = fb.analytics();
const db = firebaseApp.firestore();
const auth = fb.auth();
const storage = fb.storage();

export { db, auth, storage, fb , analytics};
