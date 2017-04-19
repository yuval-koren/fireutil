import '../style.css';
import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import database from 'firebase';
import fb from '../utils/fire';
import css from '../firebaseui.css';
import uiConfig from '../utils/authuiconfig';
import { connect } from 'react-redux';
import Mock from './mock' 
import { Link, Route, withRouter } from 'react-router-dom'
import store from '../reducers/store'
import actions from '../reducers/actionCreator'

class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick = () => {
        if (!this.props.signedUser) {
            fb.login('.loginButton', uiConfig, [this]);
        } else {
            fb.logout();
        }
    }


    render() {
        return (
            <div>
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="#">RZ</a>
                    </div>

                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav">
                            <Route path='/users' children={({ match }) => (<li className={match ? 'active' : ''}><Link to="/users">Users</Link></li>)} />
                            <Route path='/weight' children={({ match }) => (<li className={match ? 'active' : ''}><Link to="/weight">Weights</Link></li>)} />
                            <Route path='/groups' children={({ match }) => (<li className={match ? 'active' : ''}><Link to="/groups">Groups</Link></li>)} />
                            <Route path='/meetings' children={({ match }) => (<li className={match ? 'active' : ''}><Link to="/meetings">Meetings</Link></li>)} />
                            <Route path='/management' children={({ match }) => (<li className={match ? 'active' : ''}><Link to="/management">Management</Link></li>)} />
                        </ul>
                        <ul className="nav navbar-right navbar-nav">
                            <li className="active">
                                <p className="navbar-text">
                                    {this.props.signedUser ? (this.props.signedUser.email) : 'unknown user'}
                                </p>
                            </li>
                            <li className="active">
                                <button type="button" className="btn btn-default navbar-btn" onClick={this.handleClick}>
                                    {this.props.signedUser ? 'logout' : 'login'}
                                </button>
                            </li>
                            {this.props.signedUser && this.props.managers[this.props.signedUser.uid] && (
                                <li className="active">
                                    <select value={this.props.group} onChange={(event)=>store.dispatch(actions.setCurrentGroup(event.target.value))} className="navbar-text">
                                        {Object.keys(this.props.managers[this.props.signedUser.uid]).map((item)=>(
                                            <option key={item} value={item}>{this.props.groups[item].name}</option>
                                        ))}
                                    </select>
                                </li>                            
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="loginButton"></div>
            </div>            
        );
    }
}

const mapStateToProps = ({current, groups, managers}) => {
    return {
        signedUser: current.signedUser,
        group: current.group,
        groups: groups,
        managers: managers, 
    }
};

export default withRouter(connect(mapStateToProps)(Header));

