import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import database from 'firebase';
import _ from 'lodash';
import {Map, List} from 'immutable';
import moment from 'moment';


export class FireBaseUtils {
    constructor() {
            
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
        //this.weeks = this.registerEntity(this.state, 'weeks');
        
    }

    saveGroup(group) {
        if (!group.key) {
            var newKey = db.ref().child('group').push().key;
            group.key = newKey;
        }
        db.ref('group'+'/' + group.key).set(group);
    }

    //listenToGroup()

    registerEntity(state, entityName) {
        let db = firebase.database();

        state[entityName] = List([]);

        let keyIndex = [];
        let result = {
            saveEntity: function(entity) {
                if (!entity) {
                    throw "tried to save an undefined entity";
                }
                if (entity && entity.toJSON) {
                    entity = entity.toJSON();
                }
                if (!entity.key) {
                    var newKey = db.ref().child(entityName).push().key;
                    entity.key = newKey;
                }
                db.ref(entityName+'/' + entity.key).set(entity);
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
}

export var fb = new FireBaseUtils();

