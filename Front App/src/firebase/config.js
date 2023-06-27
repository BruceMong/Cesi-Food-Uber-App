import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyASyYNB1aOAUkpzlTjpKneKmmYDUQT84GU",
    authDomain: "test-5b8e2.firebaseapp.com",
    projectId: "test-5b8e2",
    storageBucket: "test-5b8e2.appspot.com",
    messagingSenderId: "574897607326",
    appId: "1:574897607326:web:f3eaa4f454e2614524218f"
  };

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;