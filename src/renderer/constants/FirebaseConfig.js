// Import the functions you need from the SDKs you need

import { getMessaging } from 'firebase/messaging';

import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"
import { initializeApp } from "firebase/app";


const firebaseConfig = {
    apiKey: "AIzaSyDjI8PxaMXBHjJq-fI5l7nddlLLVgGjlCo",
    authDomain: "clinic-m-system.firebaseapp.com",
    projectId: "clinic-m-system",
    storageBucket: "clinic-m-system.firebasestorage.app",
    messagingSenderId: "656780150624",
    appId: "1:656780150624:web:f59de24a072ecf132f0005",
    measurementId: "G-YW0VEGSM77"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app)
export const messaging = getMessaging(app);

