import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyCVgrK7MGp-pKWxIoZKRgqCF59tKJHJRvo",
  authDomain: "map-test-92275.firebaseapp.com",
  projectId: "map-test-92275",
  storageBucket: "map-test-92275.appspot.com",
  messagingSenderId: "357185544252",
  appId: "1:357185544252:web:84526ec125c16eb2c02339",
  measurementId: "G-MV62T8JFS7"
};

initializeApp(firebaseConfig);

const firestore = getFirestore();

export {firestore};
