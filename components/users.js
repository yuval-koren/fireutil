import React from 'react';
import ReactDOM from 'react-dom';
import store from '../reducers/store'
import { connect } from 'react-redux'
import actions from '../reducers/actionCreator'

class Users extends React.Component {

    constructor(props) {
        super(props);
        this.name = '';
        this.phone = '';
    }

    isReady = ({group, groups, users, user}) => {
        return group in groups;// && user in users;
    }

    handleSelectedUser(user) {
        if (user===undefined) {
            this.ename.value = "";
            this.ephone.value = "";
            store.dispatch(actions.setCurrentUser(undefined));

        } else {
            this.ename.value = this.props.users[user].name;
            this.ephone.value = this.props.users[user].phone;
            store.dispatch(actions.setCurrentUser(user));
        }
    }

    saveUser = () => {
        store.dispatch(actions.saveUser(this.props.group, this.props.user, this.ename.value, this.ephone.value));
    }

    render() {
        if (!this.isReady(this.props)) {
            return (        
            <div>
                <div className="page-header">
                    <h1>Loading...</h1>
                </div>
            </div>)
        }

        return (
        <div>
            <div className="page-header">
                <h1>{this.props.groups[this.props.group].name} group</h1>
            </div>
            <div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Users</th>
                        </tr>
                    </thead>    
                    <tbody>
                        {Object.keys(this.props.users).map((user)=>(
                            <tr className={user===this.props.user ? "active" : ""} key={user} onClick={()=>this.handleSelectedUser(user)}>
                                <td>{this.props.users[user].name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h4>Details</h4>
                <button className="btn btn-default" onClick={()=>{this.handleSelectedUser(undefined)}}>New User</button>
                <button className="btn btn-default" onClick={()=>{this.saveUser()}}>Save</button>
                <div>
                    <label>Name</label>
                    <input type="text" ref={(e)=>this.ename = e}/>
                </div>
                <div>
                    <label>Phone</label>
                    <input type="tel" ref={(e)=>this.ephone = e}/>
                </div>
            </div>
        </div>)
    }
}

//               <input type="number" className="form-control" id="week" placeholder="Week"/>

const mapStateToProps = (state) => ({
    group: state.current.group,
    groups: state.groups,
    users: state.users,
    user: state.current.user,
});

export default connect(mapStateToProps)(Users);

