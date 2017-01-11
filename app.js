import './style.css';

import * as greeter from './content';
import React from 'react';
import ReactDOM from 'react-dom';

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

ReactDOM.render(
    <MyComponent name='uv' />,
    document.getElementById('root')
)