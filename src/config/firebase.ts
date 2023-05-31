// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCxkYo9JYf6iHthT3S5zzpS5lfKfxL2h-0',
  authDomain: 'react-mp3.firebaseapp.com',
  projectId: 'react-mp3',
  storageBucket: 'react-mp3.appspot.com',
  messagingSenderId: '619289518571',
  appId: '1:619289518571:web:8189513c51bb9ef61339ae',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
export const db = getFirestore(app);
