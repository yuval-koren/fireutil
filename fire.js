import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import database from 'firebase';
import _ from 'lodash';
import {Map, List} from 'immutable';
import moment from 'moment';


var group_md = {
    name: 'group',
    path: ['groups'],
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

let metadata = [group_md];


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
        this.listRegisters = [];
        this.singleRegisters = [];
        this.metadata = {};
      
        firebase.initializeApp(config);
        this.db = firebase.database();
 
        this.registerSingle = this.registerSingle.bind(this);
        this.registerList = this.registerList.bind(this);
        //this.users = this.registerEntity(this.state, 'users');
        //this.weeks = this.registerEntity(this.state, 'weeks');
        
    }

    updateState(regItem, value) {
        let newObject = {};
        newObject[regItem.entityName] = value;
        regItem.component.setState(newObject);    
    }

    informListRegistersOnAdd(entity) {
        _.forEach(this.listRegisters, (regItem) => {
            //todo: not for all registers, only for same entity name
            //todo: set state is async. change implementation...
            let list = _.clone(regItem.component.state[regItem.entityName]);

            list.push(entity);
            this.updateState(regItem, list);
        });    
    }

    informListRegistersOnChange(entity) {
        _.forEach(this.listRegisters, (regItem) => {
            let changedIndex = this.findIndex(regItem.entityName,entity.key);
            let list = _.clone(regItem.component.state[regItem.entityName]);
            list[changedIndex] = entity;
            this.updateState(regItem, list);
        });    
    }

    informSingleRegistersOnAdd(entity) {
        this.informSingleRegistersOnChange(entity);
    }

    informSingleRegistersOnChange(entity) {
        _.forEach(this.singleRegisters, (regItem) => {
            if (entity.key===regItem.entityKey) {
                this.updateState(regItem, entity);
            }
        })
    }

    findIndex(entityName, key) {
        let changedIndex = this.index[entityName].findIndex((entity)=>entity.key===key);
        return changedIndex;
    }

    findEntity(entityName, key) {
        let index = this.findIndex(entityName, key);
        let entity = this.index[entityName][index];
        return entity;
    }

    getPath(metadata) {
        return 'groups';
    }
    

    initialize(metadatas) {

        let prepareEntity = (data) => {
            let entity = data.val();
            entity.key = data.key;
            return entity;
        }

        _.forEach(metadatas, (metadata)=>{
            this.metadata[metadata.name] = metadata;
            this.index[metadata.name] = [];
            
            this.db.ref(this.getPath(metadata)).on('child_added', (data) => {   
                let entity = prepareEntity(data);
                this.index[metadata.name].push(entity);
                this.informListRegistersOnAdd(entity);
                this.informSingleRegistersOnAdd(entity);
            });

            this.db.ref(this.getPath(metadata)).on('child_changed', (data) => {
                var changedIndex = this.findIndex(metadata.name);
                let entity = prepareEntity(data);
                this.index[metadata.name][changedIndex] = entity;
                this.informListRegistersOnChange(entity);
                this.informSingleRegistersOnChange(entity);
            });
       })
    }

    getMetadata(entityName) {
        return this.metadata[entityName];
    }

    registerList(component, entityName) {

        let regItem = {
            component: component,
            entityName: entityName,
        }

        this.listRegisters.push(regItem);

        component.state[entityName] = _.clone(this.index[entityName]);

        return {
            unregister: () => {
                _.remove(this.listRegisters, (item) => item===regItem);
            },
            save: () => {

            }
        }    
    }

    registerSingle(component, entityName, key) {
        let that = this;

        let regItem = {
            component: component,
            entityName: entityName,
            entityKey: key,
        }

        this.singleRegisters.push(regItem);
        
        // update now the state
        let entity = this.findEntity(entityName, key);
        if (entity) {
            component.state[entityName] = entity;
        }

        return {
            unregister: () => {
                _.remove(this.singleRegisters, (item) => item===regItem);
            },
            save: (entity) => {
                let path = this.getPath(this.metadata[entityName]);
                if (!entity.key) {
                    var newKey = this.db.ref().child(path).push().key;
                    entity.key = newKey;
                }
                this.db.ref(path+'/' + entity.key).set(entity);
                
            }
        }    

    }
}

var firebaseutil = new FireBaseUtils();
firebaseutil.initialize(metadata);


export function fb() {
    return firebaseutil;    
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