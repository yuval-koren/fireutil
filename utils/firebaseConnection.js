import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import database from 'firebase';
import _ from 'lodash';
import {Map, List} from 'immutable';
import moment from 'moment';
import metadata from './metadata';
import dbconfig from './dbconfig';
import firebaseui from 'firebaseui';
import store from '../reducers/store'
import firebase_db from './firebaseApp'

class FirebaseConnection {
    constructor() {
        
        this.db = firebase_db;
        
        this.db.ref('managers').on('child_added', (data) => {   
            store.dispatch({type: 'SET_MANAGER', payload: Object.assign(data.val(), {key:data.key})});
        });

        this.db.ref('groups').on('child_added', (data) => {   
            store.dispatch({type: 'SET_GROUP', payload: Object.assign(data.val(), {key:data.key})});
        });

    }

    registerToGroup = (group)=> {

        if (this.usersEventOff) {
            this.db.ref('users').off('child_added', this.usersEventOff);
        }

        if (this.weightsEventOff) {
            this.db.ref('weights').off('child_added', this.weightsEventOff);
        }

        this.usersEventOff = this.db.ref('users').on('child_added', (data) => {   
            store.dispatch({type: 'SET_USER', payload: Object.assign(data.val(), {key:data.key})})
        });

        this.weightsEventOff = this.db.ref('weights').on('child_added', (data) => {   
            store.dispatch({type: 'SET_WEIGHT', payload: Object.assign(data.val(), {key:data.key})})
        });
        
    }
}

const firebaseConnection = new FirebaseConnection();

export default firebaseConnection;
