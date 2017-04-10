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


export class FireBaseUtils {
    constructor(config) {

        this.state = { };
        this.index = [];
        this.listRegisters = {};
        this.singleRegisters = {};
      
        firebase.initializeApp(config);
        this.db = firebase.database();

        this.initAndRegisterAuthenticationChanges();

        this.registerSingle = this.registerSingle.bind(this);
        this.registerList = this.registerList.bind(this);
        this.prepareEntity = this.prepareEntity.bind(this);        
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
                this.updateState(regInfo.entityName, component, entity);
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

    registerSingleEntityForFireBaseChanges(path) {
        // firebase already keeps track on this path.
        if (this.singleRegisters[path]) {
            return;
        }

        this.index[path] = [];
        let firebaseReference = this.db.ref(path);

        firebaseReference.on('value', (data) => {   
            let entity = this.prepareEntity(data);
            this.index[path].push(entity);
            this.informSingleRegistersOnAdd(entity, path);
        });
    }


    registerEntityListForFireBaseChanges(path) {
        // firebase already keeps track on this path.
        if (this.listRegisters[path]) {
            return;
        }

        this.index[path] = [];
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
    registerPath(list, component, metadata, path) {

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

        //order of two next statements is important. (fb doesn't add listener if path is already registered)
        let path = this.getPath(metadata, keyArray);
        this.registerEntityListForFireBaseChanges(path);
        let regInfo = this.registerPath(this.listRegisters, component, metadata, path);

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
        let path = this.getPath(metadata, keyArray, key);
        if (!key) {    
            return {
                unregister: () => {},
                save: (entity) => {
                    var newKey = this.db.ref().child(path).push().key;
                    entity.key = newKey;
                    this.db.ref(path+'/'+entity.key).set(entity);
                }
            }
        }

        this.registerSingleEntityForFireBaseChanges(path);     
        var regInfo = this.registerPath(this.singleRegisters, component, metadata, path);
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

    getIndex(metadata, keyArray) {
        let path = this.getPath(metadata, keyArray);

        return this.index[path];
    }

    /*************************************/
    // Authntication Part
    /*************************************/


    initAndRegisterAuthenticationChanges() {
        this.ui = new firebaseui.auth.AuthUI(firebase.auth());
        this.userState = undefined;
        firebase.auth().onAuthStateChanged((user)=>{
            if (user) {
                
                this.userState = user;
                _.forEach(this.componentsToRefresh, (comp)=>{
                    comp.setState({signedUser: user});
                })
            } else {
                this.userState = undefined;
                _.forEach(this.componentsToRefresh, (comp)=>{
                    comp.setState({signedUser: undefined});
                })
            }
        })

    }

    getUser = () => {
        return this.userState;
    }

    login = (elementId, uiConfig, compArr) => {
        this.ui.start(elementId, uiConfig);
        this.componentsToRefresh = compArr;
    }

    logout = () => {
        firebase.auth().signOut();
    }
}

const firebaseutil = new FireBaseUtils(dbconfig);

export default firebaseutil;

