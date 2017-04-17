import React from 'react';
import ReactDOM from 'react-dom';
import store from '../reducers/store'
import { connect } from 'react-redux'
import actions from '../reducers/actionCreator'

class WeightForm extends React.Component {

    constructor(props) {
        super(props);
    }

    handleSubmitWeight = () => {
        ;
    }

    render() {
        return (
        <div>
            <label>Week</label>
            <div className="input-group input-group-lg">   
                <span className="input-group-btn">
                    <button onClick={()=>store.dispatch(actions.setCurrentWeekPrev())} className="btn btn-default" type="button">&lt;&lt;</button>
                </span>
                <input value={this.props.week} onChange={(event)=>store.dispatch(actions.setCurrentWeek(event.target.value))} type="number" className="form-control" id="week" placeholder="Enter Week"/>
                <span className="input-group-btn">
                    <button onClick={()=>store.dispatch(actions.setCurrentWeekNext())} className="btn btn-default" type="button">&gt;&gt;</button>
                </span>
            </div>
            <label>User</label>
            <div className="input-group input-group-lg">   
                <span className="input-group-btn">
                    <button onClick={()=>store.dispatch({type:"PREV_USER"})} className="btn btn-default" type="button">&lt;&lt;</button>
                </span>
                <select value={this.props.user} className="form-control" onChange={(event)=>store.dispatch(actions.setCurrentUser(event.target.value))}>
                    {Object.keys(this.props.users).map((item)=>(
                        <option key={item} value={item}>{this.props.users[item].name}</option>
                    ))}
                </select>
                <span className="input-group-btn">
                    <button onClick={()=>store.dispatch({type:"NEXT_USER"})} className="btn btn-default" type="button">&gt;&gt;</button>
                </span>
            </div>
            <label>Weight</label>
            <div className="input-group input-group-lg">   
                <input type="number" className="form-control" id="weight" placeholder="Enter Weight" value={this.props.weight} onChange={(event)=>store.dispatch(actions.setCurrentWeight(event.target.value))}/>
            </div>
            <label> </label>
            <div className="btn-group btn-group-justified btn-group-lg" role="group" aria-label="...">
                <div className="btn-group btn-group-lg" role="group">
                    <button onClick={()=>store.dispatch(actions.submitWeight('vacation'))} type="button" className="btn btn-default">Vacation</button>
                </div>
                <div className="btn-group btn-group-lg" role="group">
                    <button onClick={()=>store.dispatch(actions.submitWeight('absent'))} type="button" className="btn btn-default">Absent</button>
                </div>
                <div className="btn-group btn-group-lg" role="group">
                    <button onClick={()=>store.dispatch(actions.submitWeight('win'))} type="button" className="btn btn-default">Submit Weight</button>
                </div>
            </div>
        </div>)
    }
}

//               <input type="number" className="form-control" id="week" placeholder="Week"/>

const mapStateToProps = (state) => ({
    week: state.current.week,
    user: state.current.user,
    weight: state.current.weight,
    users: state.users
});

export default connect(mapStateToProps)(WeightForm);

