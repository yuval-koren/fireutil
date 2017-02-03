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
            desc: 'Name',
            type: 'string'
        },
        {
            desc: 'Date',
            type: 'date',
            options: {format: 'dd/mm/yyyy'}
        },
        {
            desc: 'Hour',
            type: 'date',
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

    informListRegistersOnAdd(entity) {
    }

    informListRegistersOnChange(entity) {
            
    }

    informSingleRegistersOnAdd(entity) {
        _.forEach(this.singleRegisters, (regItem) => {
            if (entity.key===regItem.entityKey) {
                regItem.component.setState({group: entity});    
            }

        })
    }

    informSingleRegistersOnChange(entity) {
        _.forEach(this.singleRegisters, (regItem) => {
            if (entity.key===regItem.entityKey) {
                regItem.component.setState({group: entity});    
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

        let generateKey = () => {
            return 'yuval';
        }

        let regItem = {
            component: component,
            entityName: entityName,
            key: generateKey()
        }

        this.listRegisters.push(regItem);

        
        return {
            unregister: () => {

            },
            save: () => {

            }
        }    
    }

    

    registerSingle(component, entityName, key) {
        let that = this;
        let generateKey = () => {
            return 'yuval';
        }

        let regItem = {
            component: component,
            entityName: entityName,
            entityKey: key,
            key: generateKey()
        }

        this.singleRegisters.push(regItem);
        let entity = this.findEntity(entityName, key);
        if (entity) {
            component.state[entityName] = entity;
        }

        return {
            unregister: () => {
                _.remove(this.singleRegisters, (item) => item===regItem);
                //let indexToRemove = _.findIndex(this.singleRegisters, (item) => regItem.key === item.key );
                //this.singleRegisters.splice(indexToRemove, 1);
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

    saveGroup(group) {
        if (!group.key) {
            var newKey = this.db.ref().child('group').push().key;
            group.key = newKey;
        }
        this.db.ref('group'+'/' + group.key).set(group);
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