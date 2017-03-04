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



class EntityForm2 extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateValue = this.updateValue.bind(this);
        this.entityName = this.props.metadata.name;
        this.state = {
            entity: this.props.entity
        } 
    }

    componentWillReceiveProps(nextProps) {
        this.setState({entity: nextProps.entity});
    }

    updateValue(value, field) {
        let stateUpdate = this.state.entity;
        stateUpdate[field]=value;
        this.setState({entity: stateUpdate});
    }

    handleSubmit(event) {
        this.props.save(this.state.entity);
    }


    render() {
        let fields = this.props.metadata.fields.map((field) => {
            let input = <div>unknown type</div>

            if (field.type==='string') {
                input = <TextField update={this.updateValue} field={field.fname} initValue={this.state.entity[field.fname]} />
            } else if (field.type==='number') {
                input = <NumberField update={this.updateValue} field={field.fname} initValue={this.state.entity[field.fname]} />
            } else if (field.type==='date') {
                input = <DateField update={this.updateValue} field={field.fname} format={field.options.format} initValue={this.state.entity[field.fname]} />
            } else if (field.type==='list') {
                input = <ListField update={this.updateValue} field={field.fname} initValue={this.state.entity[field.fname]} list={field.options.items} />
            } else if (field.type==='ref') {
                input = <DBM metadata={field.options.ref} keyArray={{group: 'k123'}}>
                            <RefField2 update={this.updateValue} field={field.fname} initValue={this.state.entity[field.fname]}/>
                        </DBM>
            };

            return (
                    <NamedField key={field.fname} name={field.desc}> 
                        {input}
                    </NamedField>                
            )
        });
        return (
            <div>
                <Mock name="Title: NewGroup" />

                {fields}

                <button onClick={this.handleSubmit}>Submit</button>                

            </div>
        );
    }
}



/****************************
input prop:
- metadata (of list)
- keyArray
- entityKey (optional - for single entity)
output prop(to children)
- metadata
- keyArray
- list/entity
*****************************/
class DBM extends React.Component {
    constructor(props) {
        super(props);
    }

    // takes parameter from props or props.params
    takeParams(param) {
        // first try to take from props
        let parameterValue = this.props[param];

        // try to take from url
        if (!parameterValue && this.props.params) {
            parameterValue = this.props.params[param];
        } 

        // try to take from router props
        if (!parameterValue && this.props.route) {
            parameterValue = this.props.route[param];
        } 

        return parameterValue;
    }

    componentWillMount() {
        this.metadata = this.takeParams('metadata');
        this.keyArray = this.takeParams('keyArray');
        //only if single entity
        this.entityKey = this.takeParams('entityKey'); 
        this.isSingle = this.takeParams('isSingle');

        let stateObj = {}
        stateObj[this.metadata.name] = [];
        this.state = stateObj;

        if (this.isSingle) {
            this.entityApi = fb.fb().registerSingle(this, this.metadata, this.entityKey, this.keyArray);
        } else {
            this.entityApi = fb.fb().registerList(this, this.metadata, this.keyArray);
        }
        
    }
    

    componentWillUnmount() {
        this.entityApi.unregister();
    }

    render() {
        let extraData = this.isSingle ? {
            // extra data for single entity
            metadata: this.metadata,
            keyArray: this.keyArray,
            entity: this.state[this.metadata.name],
            save: this.entityApi.save,
        } : {
            // extra data for list
            metadata: this.metadata,
            keyArray: this.keyArray,
            list: this.state[this.metadata.name],
        }

        return React.cloneElement(React.Children.only(this.props.children), extraData);
    }    
}


class EntityManagementScreen2 extends React.Component {
    constructor(props) {
        super(props);

        this.onSelect = this.onSelect.bind(this);
        this.newEntity = this.newEntity.bind(this);
        this.state = {};
    }

    onSelect(key) {
        this.setState({selected: key});
    }

    newEntity() {
        this.setState({selected: ''});
    }

    render() {
        return (
            <div>
                <Mock name="Title: Groups" />
                <button onClick={this.newEntity}>New</button>

                <TTable onSelect={this.onSelect} metadata={this.props.metadata} list={this.props.list} />  
                <DBM metadata={this.props.metadata} key={this.state.selected} entityKey={this.state.selected} keyArray={this.props.keyArray} isSingle={true}>
                    <EntityForm2/>
                </DBM>
 
                <Mock name="button: Select Active group" />                
                <div>Selected key is: {this.state.selected}</div>
            </div>
        );
    }
}



class TTable extends React.Component {
    constructor(props) {
        super(props);

        this.metadata = props.metadata;
        this.list = props.list;


    }

    getAllReferences(metadata, keyArray) {
        metadata.fields.forEach((field)=> {
            if (field.type==='ref') {
                this.registerList(this, field.options.ref, keyArray);
            }
        })
    }

    render() {
        return (
            <div>
                <table>
                    <THeaderRow metadata={this.props.metadata} />
                    {this.props.list.map((row) => (
                        <TRow onSelect={this.props.onSelect} key={row.key} entity={row} metadata={this.props.metadata} ref={this.state}/>
                    ))}
                </table>
            </div>
        )
    }
}


class THeaderRow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <thead>
                <tr>
                    {this.props.metadata.fields.map((column) => (
                        <td key={column.fname}>{column.desc}</td>
                    ))}
                </tr>
            </thead>
        )        
    }
}

class TRow extends React.Component {
    constructor(props) {
        super(props);
    }

    //todo: see why below does not work
    findRefName(key, entityName, displayField) {
        return _.find(this.state[entityName], (item) => item.key === key)[displayField];
    }

    render() {
        return (
            <tbody>
                <tr onClick={()=>this.props.onSelect(this.props.entity.key)}>
                    {this.props.metadata.fields.map((field) => {
                        //if (field.type === 'ref') {
                        //    return (   //todo: name is hardcoded
                        //        <td key={field.fname}>{this.findRefName(this.props.entity[field.fname], field.options.ref.fname, 'name')}</td>
                        //    )
                        //} else {
                            return (
                                <td key={field.fname}>{this.props.entity[field.fname]}</td>
                            )
                        //}
                    })}
                </tr>
            </tbody>
        )                
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


class ListField extends React.Component {
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
            <select value={this.state.value} onChange={this.updateValue}>
                {this.props.list.map((item)=>(
                    <option key={item}>{item}</option>
                ))}
            </select>
        )
    }
}



class RefField2 extends React.Component {
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
            <select value={this.state.value} onChange={this.updateValue}>
                {this.props.list.map((item)=>(
                    <option key={item.key} value={item.key}>{item.name}</option>
                ))}
            </select>
        )
    }
}



class RefField extends React.Component {
    constructor(props) {
        super(props);

        this.state = {value: this.props.initValue};
        this.updateValue = this.updateValue.bind(this);

        this.fillEntityList(this.props.refMetadata, this.props.refKeyArray);
        
    }

    updateValue(event) {
        this.setState({value: event.target.value});
        if (this.props.update) {
            this.props.update(event.target.value, this.props.field);
        }
    }


    componentWillMount() {
        this.entityApi = fb.fb().registerList(this, this.props.refMetadata, this.props.refKeyArray);
    }

    componentWillUnmount() {
        this.entityApi.unregister();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({value: nextProps.initValue});
        this.fillEntityList(nextProps.refMetadata, nextProps.refKeyArray);
    }

    fillEntityList(metadata, keyArray) {
        this.list = fb.fb().getIndex(metadata, keyArray);
    }

    render() {
        
        return (
            <select value={this.state.value} onChange={this.updateValue}>
                {this.state[this.props.refMetadata.name].map((item)=>(
                    <option key={item.key} value={item.key}>{item.name}</option>
                ))}
            </select>
        )
    }
}



class NumberField extends React.Component {
    constructor(props) {
        super(props);

        this.state = {value: Number(this.props.initValue)};
        this.updateValue = this.updateValue.bind(this);
    }

    updateValue(event) {
        this.setState({value: Number(event.target.value)});
        if (this.props.update) {
            this.props.update(Number(event.target.value), this.props.field);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({value: Number(nextProps.initValue)});
    }

    render() {
        return (
            <input type='number' value={Number(this.state.value)} onChange={this.updateValue} placeholder={this.props.placeholder} />
        )
    }
}

NumberField.defaultProps = {
    placeholder: '',
    initValue: ''
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
};

DateField.defaultProps = {
    initValue: ''
};


class WeightScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <DBM metadata={fb.metadata()['weight']} keyArray={{group: 'k123'}}>
                <EntityManagementScreen2/>
            </DBM>
        )
    }
}



class UsersScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <DBM metadata={fb.metadata()['user']} keyArray={{group: 'k123'}}>
                <EntityManagementScreen2/>
            </DBM>
        )
    }
}



class GroupsScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let html = 
        (
            <DBM metadata={fb.metadata()['group']}>
                <EntityManagementScreen2/>
            </DBM>
        );

        return html;
    }
}




(function() {
    let fire = fb.fb();
    let group = fb.metadata()['group'];
    let user = fb.metadata()['user'];
    let weight = fb.metadata()['weight'];

    ReactDOM.render(
        <div>
            <Header />
            <Router history={hashHistory}>
                <Route path="/" component={MainScreen} />
                <Route path="/weight" component={WeightScreen} />
                <Route path="/meeting" component={WeightPresentationScreen} />
                <Route path="/management" component={ManagementScreen} />
                <Route path="/users" component={UsersScreen} />
                <Route path="/groups" component={GroupsScreen} />
            </Router>
            <Footer />
        </div>,
    document.getElementById('root')
    )

})();


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