import React from 'react';
import ReactDOM from 'react-dom';
import store from '../reducers/store'
import { connect } from 'react-redux'

class WeightForm extends React.Component {

    constructor(props) {
        super(props);
    }

    handleSubmitWeight = () => {
        store.dispatch({
            type: "SUBMIT_WEIGHT",
            payload: this.weight
        })
    }



    render() {
        return (
        <div>
            <label>Week</label>
            <div className="input-group input-group-lg">   
                <span className="input-group-btn">
                    <button onClick={()=>store.dispatch({type:"PREV_WEEK"})} className="btn btn-default" type="button">&lt;&lt;</button>
                </span>
                <input value={this.props.week} onChange={(event)=>store.dispatch({type:"SET_WEEK", payload:event.target.value})} type="number" className="form-control" id="week" placeholder="Enter Week"/>
                <span className="input-group-btn">
                    <button onClick={()=>store.dispatch({type:"NEXT_WEEK"})} className="btn btn-default" type="button">&gt;&gt;</button>
                </span>
            </div>
            <label>User</label>
            <div className="input-group input-group-lg">   
                <span className="input-group-btn">
                    <button onClick={()=>store.dispatch({type:"PREV_USER"})} className="btn btn-default" type="button">&lt;&lt;</button>
                </span>
                <select value={this.props.user} className="form-control" ref={(elem)=>{this.userElem = elem}} onChange={(event)=>this.dispatch({type:"SET_USER", payload:event.target.value})}>
                    {this.props.users.map((item)=>(
                        <option key={item.key} value={item.key}>{item.name}</option>
                    ))}
                </select>
                <span className="input-group-btn">
                    <button onClick={()=>store.dispatch({type:"NEXT_USER"})} className="btn btn-default" type="button">&gt;&gt;</button>
                </span>
            </div>
            <label>Weight</label>
            <div className="input-group input-group-lg">   
                <input ref={(elem)=>{this.weightElem = elem}} type="number" className="form-control" id="weight" placeholder="Enter Weight"/>
            </div>
            <label> </label>
            <div className="btn-group btn-group-justified btn-group-lg" role="group" aria-label="...">
                <div className="btn-group btn-group-lg" role="group">
                    <button onClick={()=>store.dispatch({type:"SUBMIT_VACATION"})} type="button" className="btn btn-default">Vacation</button>
                </div>
                <div className="btn-group btn-group-lg" role="group">
                    <button onClick={()=>store.dispatch({type:"SUBMIT_ABSENT"})} type="button" className="btn btn-default">Absent</button>
                </div>
                <div className="btn-group btn-group-lg" role="group">
                    <button onClick={this.handleSubmitWeight} type="button" className="btn btn-default">Submit Weight</button>
                </div>
            </div>
        </div>)
    }
}

//               <input type="number" className="form-control" id="week" placeholder="Week"/>

const mapStateToProps = (state) => ({
    week: state.current.week,
    user: state.current.user,
    users: state.users
});

export default connect(mapStateToProps)(WeightForm);

