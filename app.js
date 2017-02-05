import './style.css';

import * as greeter from './content';
import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import database from 'firebase';
//import update from 'immutability-helper';
import _ from 'lodash';
import {Map, List} from 'immutable';
import {Router, Route, hashHistory } from 'react-router';
import moment from 'moment';
import * as fb from './fire';

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


class SelectField extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            edit: this.props.initInEdit,
            value: props.entity.get(props.item)
        }

        if (!this.state.value) {
            this.state.value = this.props.tempValue;
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
        let isValueSameAsTempInitialValue = this.state.value == this.props.tempValue;
        if (isValueSameAsTempInitialValue) {
            return;
        }
        let newValue = this.props.entity.set(this.props.item, this.state.value);
        this.props.saveFunc(newValue);
    }

    render() {
        return (
            <div tabIndex='0' onKeyUp={this.handleKeyUp}>
                {this.state.edit ? (
                    <select value={this.state.value} onChange={this.handleChange} onBlur={this.handleSubmit}>
                        {this.props.list.map((item)=>
                            <option value={item.get('key')}>{item.get(this.props.label)}</option>
                        )}
                    </select>
                ) : (
                    <div onClick={this.changeStateToEditMode}>
                        {this.state.value}
                    </div>
                )}
            </div>
        );
    }
}

SelectField.defaultProps = {
    initInEdit: false,
    editable: true,
    tempValue: '[empty]'
}

SelectField.PropTypes = {
    item: React.PropTypes.string.isRequired,
    entity: React.PropTypes.any.isRequired,
}



class Field extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            edit: this.props.initInEdit,
            value: props.entity.get(props.item)
        }

        if (!this.state.value) {
            this.state.value = this.props.tempValue;
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
        let isValueSameAsTempInitialValue = this.state.value == this.props.tempValue;
        if (isValueSameAsTempInitialValue) {
            return;
        }
        let newValue = this.props.entity.set(this.props.item, this.state.value);
        this.props.saveFunc(newValue);
    }

    render() {
        return (
            <div tabIndex='0' onKeyUp={this.handleKeyUp}>
                {this.state.edit ? (
                    <input type="text" value={this.state.value} autoFocus 
                        onChange={this.handleChange} 
                        onBlur={this.handleSubmit}
                    />
                ) : (
                    <div onClick={this.changeStateToEditMode}>
                        {this.state.value}
                    </div>
                )}
            </div>
        );
    }
}

Field.defaultProps = {
    initInEdit: false,
    editable: true,
    tempValue: '[empty]'
}

Field.PropTypes = {
    item: React.PropTypes.string.isRequired,
    entity: React.PropTypes.any.isRequired,
}





class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Mock name="<===== FOOTER =====>" />
            </div>
        );
    }
}


class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Mock name="<===== RZ icon and title ======>" />
                <Mock name="login component" />
                <Mock name="Links" />
                <Mock name="================================" />
            </div>
        );
    }
}


class MainScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Mock name="explanation about the program" />
            </div>
        );
    }
}


class WeightPresentationScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Mock name="table: user list with avatars" />
                <Mock name="Title: Selected user with avatar" />
                <Mock name="Graph" />
                <Mock name="Weightloss icon" />
                <Mock name="Money icon" />
                <Mock name="Week icon" />
            </div>
        );
    }
}



class WeeklyWeightScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Mock name="Title: Weekly Weight" />
                <Mock name="Select Group" />
                <Mock name="select week" />
                <Mock name="select user" />
                <Mock name="enter weight" />
                <Mock name="button: submit" />
                <Mock name="button: missing" />
                <Mock name="button: holiday" />
            </div>
        );
    }
}


class GroupActionsScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Mock name="Title: Group Actions" />
                <Mock name="Select Group" />
                <Mock name="sub title: group weeks" />
                <Mock name="table: week | status | postpone | change details" />
                <Mock name="sub title group users" />
                <Mock name="table: name | -3.6 | 350/500 | remove | program | money" />
                <Mock name="sub title: add new user to group" />
                <Mock name="select user" />
                <Mock name="button: add" />                
            </div>
        );
    }
}



class NewUserScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Mock name="Title: New User" />
                <Mock name="Select Group" />
                <Mock name="First" />
                <Mock name="Last" />
                <Mock name="phone" />
                <Mock name="avatar" />

                <Mock name="button: submit" />                
            </div>
        );
    }
}



class NewGroupScreen extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateValue = this.updateValue.bind(this);

    }

    componentWillMount() {
        this.state = {group: {}};

        let fire = fb.fb();
        let key = this.props.params['key'];
        this.group_api = fire.registerSingle(this, 'group', key);
    }

    componentWillUnmount() {
        this.group_api.unregister();
    }

    updateValue(value, field) {
        let stateUpdate = this.state.group;
        stateUpdate[field]=value;
        this.setState({
            group: stateUpdate
        });
    }

    handleSubmit(event) {
        this.group_api.save(this.state.group);
    }

    render() {
        return (
            <div>
                <Mock name="Title: NewGroup" />

                <NamedField name='Group Name'>
                    <TextField update={this.updateValue} field='name' initValue={this.state.group['name']}/>
                </NamedField>

                <NamedField name='Starting Date'>
                    <DateField update={this.updateValue} field='date' format='DD/MM/YY' initValue={this.state.group['date']}/>
                </NamedField>

                <NamedField name='Time'>
                    <DateField update={this.updateValue} field='time' format='HH:mm' initValue={this.state.group['time']}/>
                </NamedField>

                <button onClick={this.handleSubmit}>Submit</button>                
            </div>
        );
    }
}


class GroupsScreen extends React.Component {
    constructor(props) {
        super(props);
    }


    componentWillMount() {
        this.state = {group: {}};

        let fire = fb.fb();
        this.group_api = fire.registerList(this, 'group');
    }

    componentWillUnmount() {
        this.group_api.unregister();
    }

    render() {
        return (
            <div>
                <Mock name="Title: Groups" />

                {this.state['group'].map((entity) =>
                    <div>name: {entity.name}, date: {entity.date}, time: {entity.time}</div>
                )}
                <Mock name="Table: group name|start date" />
                <Mock name="button: Select Active group" />                

            </div>
        );
    }
}




class ManagementScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Mock name="Title: Management" />
                <Mock name="Add User" />
                <Mock name="Add Group" />
                <Mock name="Add Group Actions" />

                <Mock name="Table: user|group| set group" />                
            </div>
        );
    }
}


class Mock extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='mock'>{this.props.name}</div>
        )
    }
}


class NamedField extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className='fieldContainer'>
                <label>
                    {this.props.name}:  
                </label>
                {this.props.children}    
            </div>
        )
    }
    
}

class TextField extends React.Component {
    constructor(props) {
        super(props);

        this.state = {value: this.props.initValue};
        this.updateValue = this.updateValue.bind(this);
    }

    updateValue(event) {
        this.setState({value: event.target.value});
        if (this.props.update) {
            this.props.update(event.target.value, this.props.field);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({value: nextProps.initValue});
    }

    render() {
        return (
            <input type='text' value={this.state.value} onChange={this.updateValue} placeholder={this.props.placeholder} />
        )
    }
}

TextField.defaultProps = {
    placeholder: '',
    initValue: ''
}

class DateField extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            value: this.props.initValue,
            valid: true,
        };
        this.updateDate = this.updateDate.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({value: nextProps.initValue});
    }

    updateDate(val, field) {
        let valid = moment(val, this.props.format, true).isValid();
        this.setState({value: val});
        this.setState({valid: valid});

        if (this.props.update) {
            this.props.update(val, field);
        }
    }

    render() {
        return (
            <span>
                <TextField update={this.updateDate} field={this.props.field} placeholder={this.props.format} initValue={this.props.initValue}/>
                {!this.state.valid && 
                    <span className='error'>*</span>
                }
            </span>
        )
    }
}

DateField.defaultProps = {
    initValue: ''
}



ReactDOM.render(
    <div>
        <Header />
        <Router history={hashHistory}>
            <Route path="/" component={MainScreen} />
            <Route path="/weight" component={WeeklyWeightScreen} />
            <Route path="/meeting" component={WeightPresentationScreen} />
            <Route path="/management" component={ManagementScreen} />
            <Route path="/newuser" component={NewUserScreen} />
            <Route path="/groups" component={GroupsScreen} />
            <Route path="/newgroup" component={NewGroupScreen} firebase='ggg'>
                <Route path="/newgroup/:key" component={NewGroupScreen} firebase='fff'/>
            </Route>
        </Router>
        <Footer />
    </div>,
    document.getElementById('root')
)


// WEBPACK FOOTER //
// ./app.js


// WEBPACK FOOTER //
// ./app.js


// WEBPACK FOOTER //
// ./app.js


// WEBPACK FOOTER //
// ./app.js


// WEBPACK FOOTER //
// ./app.js


// WEBPACK FOOTER //
// ./app.js


// WEBPACK FOOTER //
// ./app.js


// WEBPACK FOOTER //
// ./app.js


// WEBPACK FOOTER //
// ./app.js


// WEBPACK FOOTER //
// ./app.js


// WEBPACK FOOTER //
// ./app.js


// WEBPACK FOOTER //
// ./app.js


// WEBPACK FOOTER //
// ./app.js


// WEBPACK FOOTER //
// ./app.js


// WEBPACK FOOTER //
// ./app.js


// WEBPACK FOOTER //
// ./app.js


// WEBPACK FOOTER //
// ./app.js


// WEBPACK FOOTER //
// ./app.js


// WEBPACK FOOTER //
// ./app.js


// WEBPACK FOOTER //
// ./app.js


// WEBPACK FOOTER //
// ./app.js


// WEBPACK FOOTER //
// ./app.js


// WEBPACK FOOTER //
// ./app.js


// WEBPACK FOOTER //
// ./app.js


// WEBPACK FOOTER //
// ./app.js


// WEBPACK FOOTER //
// ./app.js


// WEBPACK FOOTER //
// ./app.js