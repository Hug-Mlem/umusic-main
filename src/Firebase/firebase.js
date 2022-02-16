import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import firebase from 'firebase'

// const config = {
//     apiKey: "AIzaSyAdzbLzyb7x0mJyyUXeieHgYcLAEBVv0PQ",
//     authDomain: "core-autofarmer-net-e1bc5.firebaseapp.com",
//     databaseURL: "https://core-autofarmer-net-e1bc5.firebaseio.com",
//     projectId: "core-autofarmer-net-e1bc5",
//     storageBucket: "core-autofarmer-net-e1bc5.appspot.com",
//     messagingSenderId: "918268946192",
//     appId: "1:918268946192:web:232838f774d0ef3c6ae795",
//     measurementId: "G-Q3RMLQRC5V"
// };


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const config = {
  apiKey: "AIzaSyDu5zmvBkNFYOUHJOfI9F9vxvxedrIV0FM",
  authDomain: "umute-b2c78.firebaseapp.com",
  projectId: "umute-b2c78",
  storageBucket: "umute-b2c78.appspot.com",
  messagingSenderId: "990631714733",
  appId: "1:990631714733:web:f51464e7c73326bb034b24",
  measurementId: "G-NZCT6WZZ65"
};

// Initialize Firebase

class Firebase {
  constructor() {
    app.initializeApp(config); 
    this.auth = app.auth();
    this.db = app.database();
    this.firestore = app.firestore();
    this.storage = app.storage();
    console.log('firebase--->', this.auth.GoogleAuthProvider, this)
  }
  


  // *** Auth API ***
  
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);
  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);
  doSignOut = () => this.auth.signOut();
  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  // *** User API ***
  user = uid => this.db.ref(`users/${uid}`);
  users = () => this.db.ref("users");
}

export default Firebase;
