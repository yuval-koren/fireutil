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
import actions from '../reducers/actionCreator'

class FirebaseConnection {
    constructor() {
        
        this.db = firebase_db;

        this.dispatchOnChildCreated('groups', actions.addGroup);
        this.dispatchOnChildCreated('managers', actions.addManager);

        this.regs = [];
    }

    registerToGroup = (group)=> {

        this.regs.forEach((item)=> {
            item.ref.off('child_added', item.off);
        })

        this.regs = [];

        this.regs.push(
            this.dispatchOnChildCreated(group+'/users', actions.addUser),
            this.dispatchOnChildChange(group+'/users', actions.addUser),
            this.dispatchOnChildCreated(group+'/weights', actions.addWeight),
            this.dispatchOnChildChange(group+'/weights', actions.addWeight)
        );
    }
        
    saveWeight = (group, week, userId, weight, status) => {
        var newKey = "week:"+week+",user:"+userId;
        this.db.ref(group+'/weights/'+newKey).set({
            key: newKey,
            nameKey: userId,
            week: week,
            weight: weight,
            status: status,
        });

    }
    
    saveUser = (group, key, name, phone) => {
        let newKey = key;
        if (newKey===undefined || newKey==='') {
            newKey = this.db.ref().child(group+'/users').push().key;
        }
        this.db.ref(group+'/users/'+newKey).set({
            key: newKey,
            name: name,
            phone: phone,
        });

    }

    dispatchOnChildCreated = (path, action)=> {
        let storage = {};
        storage.ref = this.db.ref(path);
        storage.off = storage.ref.on('child_added', (data) => {   
            let payload = {...data.val(), key:data.key}
            store.dispatch(action(payload));
        });

        return storage;
    }

    dispatchOnChildChange = (path, action)=> {
        let storage = {};
        storage.ref = this.db.ref(path);
        storage.off = storage.ref.on('child_changed', (data) => {   
            let payload = {...data.val(), key:data.key}
            store.dispatch(action(payload));
        });

        return storage;
    }
}

export let firebaseConnection = new FirebaseConnection();
