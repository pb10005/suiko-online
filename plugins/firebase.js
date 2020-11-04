import firebase from "firebase/app";

if (!firebase.apps.length) {
  const firebaseConfig = {
    apiKey: "AIzaSyDBpdQfvfha2gQ_RePkRVJeWXIKbXwHAzQ",
    authDomain: "draft-f2088.firebaseapp.com",
    databaseURL: "https://draft-f2088.firebaseio.com",
    projectId: "draft-f2088",
    storageBucket: "draft-f2088.appspot.com",
    messagingSenderId: "693455967070",
    appId: "1:693455967070:web:5b96e2ed7fd085e71c75cf",
    measurementId: "G-1M1L4VGXBD"
  };
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
