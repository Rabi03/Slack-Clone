import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

 var firebaseConfig = {
    apiKey: "AIzaSyC3uoqzJVYrlnnfwHj0fRGhJPfLm2S67Go",
    authDomain: "slack-clone-e2f8d.firebaseapp.com",
    projectId: "slack-clone-e2f8d",
    storageBucket: "slack-clone-e2f8d.appspot.com",
    messagingSenderId: "796872264156",
    appId: "1:796872264156:web:102a945f8dbdef382a2719",
    measurementId: "G-HFCCB2FMZP"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
  
export default firebase;
  