import './style.css';

import * as greeter from './content';
import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import database from 'firebase';
//import update from 'immutability-helper';
import _ from 'lodash';
import {Map, List} from 'immutable';

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

        this.state = { };
      
        firebase.initializeApp(config);

        this.users = this.registerEntity(this.state, 'users');

    }


    registerEntity(state, entityName) {
        let db = firebase.database();

        state[entityName] = List([]);

        let keyIndex = [];
        let result = {
            saveEntity: function(entity) {
                if (!entity.key) {
                    var newKey = db.ref().child(entityName).push().key;
                    entity = entity.setIn('key', newKey);
                }
                db.ref(entityName+'/' + entity.get('key')).set(entity.toJSON());
            },
            keyIndex: function(index) {
                return keyIndex[index];
            }
        }

        db.ref(entityName).on('child_added', (data) => {   
            let entity = data.val();
            entity.key = data.key;      

            let newValue = this.state.users.push(Map(entity));
            let newObject = {};
            newObject[entityName] = newValue;
            this.setState(newObject);

            keyIndex[entity.key] = newValue;
        });

        db.ref(entityName).on('child_changed', (data) => {
            var changedIndex = this.state[entityName].findIndex((entity)=>entity.get('key')===data.key);
            let entity = data.val();
            entity.key = data.key;

            let newValue = this.state[entityName].setIn([changedIndex], Map(entity));         
            let newObject = {};
            newObject[entityName] = newValue;
            this.setState(newObject);
            
            keyIndex[entity.key] = newValue;

        });

        return result;
    }



    render() {
        return ( 
            <div>
                {this.state.users.map((data) =>
                    <div>{data.get('name')}</div>
                )}
                <button onClick={this.users.saveEntity}>save me</button>      
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