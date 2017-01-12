import './style.css';

import * as greeter from './content';
import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import database from 'firebase';
import update from 'immutability-helper'

document.write("It works -> ");
document.write(greeter.greet("yuval"));

class MyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.incStatus = this.incStatus.bind(this);
        this.state = {
            count: 0
        }    
    }

    incStatus() {
        this.setState({
            count: this.state.count + 1
        });
    }

    render() {
        return (
            <div>
                <h1>Hello, world!!</h1>
                <p>using some prop named: {this.props.name}</p>
                <p>count= {this.state.count}</p>
                <button type="button" onClick={this.incStatus}>increment</button>
            </div>
        );
    }
}


class FireBaseAware extends React.Component {
    constructor(props) {
        super(props);
            
        var config = {
            apiKey: "AIzaSyDZGp5jLl_E6xYdDROfqfXqH6fBx70ZqVs",
            authDomain: "looseandwin.firebaseapp.com",
            databaseURL: "https://looseandwin.firebaseio.com",
            storageBucket: "project-6410405059481098151.appspot.com",
            messagingSenderId: "512733212020"
        };

        this.state = {
            users: []
        }

        firebase.initializeApp(config);
        var db = firebase.database();
        db.ref('users').on('child_added', (data) => {   
            let user = {};
            user = data.val();
            user.key = data.key;         
            this.setState(update(this.state, {users: {$push: [user]}}));
        })
    }

    render() {
        return ( 
            <div>
                {this.state.users.map((data) =>
                    <div>{data.name}</div>
                )}
                {this.props.children}
            </div>
        );
    }
}


ReactDOM.render(
    <FireBaseAware> 
        <MyComponent name='uv' />
    </FireBaseAware>,
    document.getElementById('root')
)