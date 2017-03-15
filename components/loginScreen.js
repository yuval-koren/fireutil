import '../style.css';
import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import database from 'firebase';
import fb from '../utils/fire';
import css from '../firebaseui.css';
import uiConfig from '../utils/authuiconfig';




export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);

        fb.login('#firebaseui-auth-container', uiConfig);
    }

    render() {
        return (
            <div id='firebaseui-auth-container'></div>
        )
    }
}

