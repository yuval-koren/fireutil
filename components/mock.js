import React from 'react';
import ReactDOM from 'react-dom';



export default class Mock extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='mock'>{this.props.name}</div>
        )
    }
}
