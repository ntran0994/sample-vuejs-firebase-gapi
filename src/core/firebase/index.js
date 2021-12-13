import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { getAuth, signInWithCredential, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";

let firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

console.log(firebaseConfig);

if(process.env.FIREBASE_MEASUREMENT_ID){
    firebaseConfig.measurementId = process.env.FIREBASE_MEASUREMENT_ID
}

const firebaseApp = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth();
export const firebaseSignInWithCredential = signInWithCredential;
export const firebaseGoogleAuthProvider = GoogleAuthProvider;
export const firebaseSignOut = signOut;
export const firebaseDB = getFirestore(firebaseApp);
export const firebaseCollection = collection;
export const firebaseGetDocs = getDocs;
export const firebaseAddDoc = addDoc;
export const firebaseUpdateDoc = updateDoc;
export const firebaseDoc = doc;
export const firebaseGetDoc = getDoc;
export const firebaseOnAuthStateChanged = onAuthStateChanged;