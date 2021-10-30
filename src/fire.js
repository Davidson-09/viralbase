// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyAOtSJ3RmUvEumSghv2EgHfxeTKIb2R0MU",
	authDomain: "viralbase-41649.firebaseapp.com",
	projectId: "viralbase-41649",
	storageBucket: "viralbase-41649.appspot.com",
	messagingSenderId: "573280798560",
	appId: "1:573280798560:web:3b94034b8d2653308e0005",
	measurementId: "G-FVE0BX5T51"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export {app, analytics, db, auth, storage};