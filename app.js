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



class Field extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            edit: this.props.initInEdit,
            value: props.entity.get(props.item)
        }

        this.changeStateToEditMode = this.changeStateToEditMode.bind(this);
        this.changeStateToReadMode = this.changeStateToReadMode.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    changeStateToEditMode() {
        if (!this.props.editable) {return; }
        this.setState({edit: true});
    }

    changeStateToReadMode() {
        
        this.setState({edit: false});
    }

    handleKeyUp(event) {
        if (event.keyCode == 13) {
            if (this.state.edit) {
                this.handleSubmit();
            } else {
                this.changeStateToEditMode();
            }
        }
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit() {
        this.changeStateToReadMode();
        let newValue = this.props.entity.set(this.props.item, this.state.value);
        this.props.saveFunc(newValue);
    }

    render() {
        if (!this.state.edit) {
            return (
                <div tabIndex='0'
                    onClick={this.changeStateToEditMode} 
                    onKeyUp={this.handleKeyUp}
                >
                    {this.props.entity.get(this.props.item)}
                </div>
            )
        } else {
            return (
                <div>
                    <input type="text" value={this.state.value} autoFocus 
                        onChange={this.handleChange} 
                        onBlur={this.handleSubmit}
                        onKeyUp={this.handleKeyUp}
                    />
                </div>
            )
        }
    }
}

Field.defaultProps = {
    initInEdit: false,
    editable: true
}

Field.PropTypes = {
    item: React.PropTypes.string.isRequired,
    entity: React.PropTypes.any.isRequired,
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


    render() {
        return ( 
            <div>
                {this.state.users.map((data) =>
                    <Field entity={data} item='name' saveFunc={this.users.saveEntity}></Field>
                )}
                <button onClick={this.users.saveEntity}>save me2</button>      
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