import React from 'react';
import ReactDOM from 'react-dom';
import store from '../reducers/store'
import { connect } from 'react-redux'
import actions from '../reducers/actionCreator'

class Groups extends React.Component {

    constructor(props) {
        super(props);
        this.name = '';
        this.date = '';
        this.hour = '';
        this.currentGroup = '';
    }

    isReady = ({signedUser, groupManagers}) => {
        return signedUser!==undefined && signedUser.uid in groupManagers;
    }

    handleSelectedGroup(group) {
        if (group===undefined) {
            this.ename.value = "";
            this.edate.value = "";
            this.ehour.value = "";
            this.currentGroup = undefined;
            store.dispatch(actions.setCurrentGroup(undefined));

        } else {
            this.ename.value = this.props.groups[group].name;
            this.edate.value = this.props.groups[group].date;
            this.ehour.value = this.props.groups[group].time;
            this.currentGroup = group;
        }
    }

    saveGroup = () => {
        store.dispatch(actions.saveGroupAndAddToManager(this.props.signedUser.uid, this.currentGroup, this.ename.value, this.edate.value, this.ehour.value));
    }

    render() {
        if (!this.isReady(this.props)) {
            return (        
            <div>
                <div className="page-header">
                    <h1>Loading...</h1>
                    <h4>If you are not a manager, you can't access this screen</h4>
                </div>
            </div>)
        }

        return (
        <div>
            <div className="page-header">
                <h1>My Groups</h1>
            </div>
            <div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Groups Name</th>
                        </tr>
                    </thead>    
                    <tbody>
                        {Object.keys(this.props.groupManagers[this.props.signedUser.uid]).map((group)=>(
                            <tr className={group===this.currentGroup ? "active" : ""} key={group} onClick={()=>this.handleSelectedGroup(group)}>
                                <td>{this.props.groups[group].name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h4>Details</h4>
                <button className="btn btn-default" onClick={()=>{this.handleSelectedGroup(undefined)}}>New Group</button>
                <button className="btn btn-default" onClick={()=>{this.saveGroup()}}>Save</button>
                <div>
                    <label>Name</label>
                    <input type="text" ref={(e)=>this.ename = e}/>
                </div>
                <div>
                    <label>Date</label>
                    <input type="date" ref={(e)=>this.edate = e}/>
                </div>
                <div>
                    <label>Hour</label>
                    <input type="time" ref={(e)=>this.ehour = e}/>
                </div>
            </div>
        </div>)
    }
}

const mapStateToProps = (state) => ({
    groups: state.groups,
    groupManagers: state.managers,
    signedUser: state.current.signedUser,
});

export default connect(mapStateToProps)(Groups);

