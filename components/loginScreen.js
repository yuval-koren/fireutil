import '../style.css';
import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import firebaseui from 'firebaseui';
import database from 'firebase';
//import update from 'immutability-helper';
import * as fb from '../utils/fire';
import css from '../firebaseui.css';




export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);

        var uiConfig = {
        signInSuccessUrl: '/',
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          //firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
          //firebase.auth.GithubAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        // Terms of service url.
        tosUrl: '/#/users'
      };

      // Initialize the FirebaseUI Widget using Firebase.
      var ui = new firebaseui.auth.AuthUI(firebase.auth());
      // The start method will wait until the DOM is loaded.
      ui.start('#firebaseui-auth-container', uiConfig);
    }

    render() {
        return (
            <div id='firebaseui-auth-container'></div>
        )
    }
}

