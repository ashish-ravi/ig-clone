// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyC1cwy226zs_cl-R__xnCCdfy50-hD2nNY",
    authDomain: "ig-clone-23804.firebaseapp.com",
    projectId: "ig-clone-23804",
    storageBucket: "ig-clone-23804.appspot.com",
    messagingSenderId: "1010938041681",
    appId: "1:1010938041681:web:e516640ca11e0b442e2f70",
    measurementId: "G-VG9QFCHN0D"
};


const firebaseApp = firebase.initializeApp(firebaseConfig)

const db = firebaseApp.firestore(); 
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};