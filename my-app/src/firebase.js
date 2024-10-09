// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyBUv3nx0rI8UQcX69VXSzEN0_pxsESKwQ8',
    authDomain: 'folder-manager-41155.firebaseapp.com',
    projectId: 'folder-manager-41155',
    storageBucket: 'folder-manager-41155.appspot.com',
    messagingSenderId: '602335357044',
    appId: '1:602335357044:web:241395fc2efecb86cf4921',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
