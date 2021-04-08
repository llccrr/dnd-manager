import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/app'

// Use your config values here.

const firebaseConfig = {
    apiKey: "AIzaSyAI2qIwed3ztKvT18iBVErGjIkRmG-2dGo",
    authDomain: "dnd-manager-52649.firebaseapp.com",
    databaseURL: "https://dnd-manager-52649-default-rtdb.firebaseio.com",
    projectId: "dnd-manager-52649",
    storageBucket: "dnd-manager-52649.appspot.com",
    messagingSenderId: "982451408711",
    appId: "1:982451408711:web:2c230e686f1a5c89e28662"
}
firebase.initializeApp(firebaseConfig);
firebase.analytics();
firebase.auth()

export default {
    firebaseConfig,
}
