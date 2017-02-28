import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import database from 'firebase';
import _ from 'lodash';
import {Map, List} from 'immutable';
import moment from 'moment';


var group_md = {
    name: 'group',
    path: 'groups',
    type: 'list',
    fields: [
        {
            desc: 'Group Name',
            type: 'string',
            fname: 'name',
        },
        {
            desc: 'Starting Date',
            type: 'date',
            fname: 'date',
            options: {format: 'dd/mm/yyyy'}
        },
        {
            desc: 'Meeting Hour',
            type: 'date',
            fname: 'time',
            options: {format: 'HH:MM'}
        },        
    ]
}


var user_md = {
    name: 'user',
    path: '{0}/users',
    type: 'list',
    fields: [
        {
            desc: 'User Name',
            type: 'string',
            fname: 'name',
        },
        {
            desc: 'Phone',
            type: 'string',
            fname: 'phone',
        }
    ]
}

let entities = {
    group: group_md,
    user: user_md,
};


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
        this.index = [];
        this.listRegisters = {};
        this.singleRegisters = {};
      
        firebase.initializeApp(config);
        this.db = firebase.database();
 
        this.registerSingle = this.registerSingle.bind(this);
        this.registerList = this.registerList.bind(this);
        this.prepareEntity = this.prepareEntity.bind(this);
        //this.users = this.registerEntity(this.state, 'users');
        //this.weeks = this.registerEntity(this.state, 'weeks');
        
    }

    updateState(entityName, component, value) {
        let newObject = {};
        newObject[entityName] = value;
        component.setState(newObject);    
    }

    informListRegistersOnAdd(entity, path) {
        let regInfo = this.listRegisters[path];
        _.forEach(regInfo.components, (component) => {
            //todo: set state is async. change implementation...
            let list = _.clone(component.state[regInfo.entityName]);

            list.push(entity);
            this.updateState(regInfo.entityName, component, list);
        });    
    }

    informListRegistersOnChange(entity, path) {
        let regInfo = this.listRegisters[path];
        _.forEach(regInfo.components, (component) => {
            let changedIndex = this.findIndex(regInfo.path, entity.key);
            let list = _.clone(component.state[regInfo.entityName]);
            list[changedIndex] = entity;
            this.updateState(regInfo.entityName, component, list);
        });    
    }

    informSingleRegistersOnAdd(entity, path) {
        this.informSingleRegistersOnChange(entity, path);
    }

    informSingleRegistersOnChange(entity, path) {
        // no registaration for this path => do nothing
        if (!this.singleRegisters[path]) return;

        let regInfo = this.singleRegisters[path];
        _.forEach(regInfo.components, (component) => {
            if (entity.key===regInfo.entityKey) {
                this.updateState(regInfo.entityName, component, list);
            }
        })
    }

    findIndex(path, key) {
        let changedIndex = this.index[path].findIndex((entity)=>entity.key===key);
        return changedIndex;
    }

    findEntity(path, key) {
        let index = this.findIndex(path, key);
        let entity = this.index[path][index];
        return entity;
    }

    getPath(metadata, keyArray, entityKey) {
        let path = entityKey ? (metadata.path + '/' + entityKey) : metadata.path;
        let compiledPath = _.template(path);
        return compiledPath(keyArray);
    }
    
    prepareEntity(data) {
            let entity = data.val();
            entity.key = data.key;
            return entity;
    }

    registerSingleEntityForFireBaseChanges(path, single) {
        let firebaseReference = this.db.ref(path);

        firebaseReference.on('value', (data) => {   
            let entity = this.prepareEntity(data);
            this.index[path].push(entity);
            this.informSingleRegistersOnAdd(entity, path);
        });
    }


    registerEntityListForFireBaseChanges(path) {
        let firebaseReference = this.db.ref(path);

        firebaseReference.on('child_added', (data) => {   
            let entity = this.prepareEntity(data);
            this.index[path].push(entity);
            this.informListRegistersOnAdd(entity, path);
        });

        firebaseReference.on('child_changed', (data) => {
            var changedIndex = this.findIndex(path, data.key);
            let entity = this.prepareEntity(data);
            this.index[path][changedIndex] = entity;
            this.informListRegistersOnChange(entity, path);
        });
    }



    // register or retrieve from cache if already registered
    registerPath(list, component, metadata, keyArray, single, entityKey) {
        let path = this.getPath(metadata, keyArray, entityKey);

        this.index[path] = [];

        if (list[path]) {
            list[path].components.push(component);
            return list[path];
        }
    
        list[path] = {}
        list[path].path = path;
        list[path].entityName = metadata.name;
        list[path].components = [component];
        list[path].unregister = (component) => {
            _.remove(list[path].components, (item)=>item===component);
        }
        return list[path];
    }

    registerList(component, metadata, keyArray) {

        let regInfo = this.registerPath(this.listRegisters, component, metadata, keyArray, false);
        this.registerEntityListForFireBaseChanges(regInfo.path);

        component.state[regInfo.entityName] = _.clone(this.index[regInfo.path]);

        return {
            unregister: () => {
                regInfo.unregister(component);
            },
            save: () => {

            }
        }    
    }

    registerSingle(component, metadata, key, keyArray) {
        if (!key) {
            let path = this.getPath(metadata, keyArray, key);
            return {
                unregister: () => {},
                save: (entity) => {
                    var newKey = this.db.ref().child(regInfo.path).push().key;
                    entity.key = newKey;
                    this.db.ref(path+'/'+entity.key).set(entity);
                }
            }
        }

        let regInfo = this.registerPath(this.singleRegisters, component, metadata, keyArray, true, key);
        this.registerSingleEntityForFireBaseChanges(regInfo.path);     
        regInfo.entityKey = key;
        
        // update now the state
        let entity = this.findEntity(regInfo.path, regInfo.entityKey);
        if (entity) {
            component.state[regInfo.entityName] = entity;
        }

        return {
            unregister: () => {
                regInfo.unregister(component);
            },
            save: (entity) => {
                if (!entity.key) {
                    var newKey = this.db.ref().child(regInfo.path).push().key;
                    entity.key = newKey;
                }
                this.db.ref(regInfo.path).set(entity);
                
            }
        }    
    }
}

var firebaseutil = new FireBaseUtils();

export function fb() {
    return firebaseutil;    
}

export function metadata() {
    return entities;
}


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js


// WEBPACK FOOTER //
// ./fire.js