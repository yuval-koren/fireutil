import './style.css';

import * as greeter from './content';
import React from 'react';
import ReactDOM from 'react-dom';

document.write("It works -> ");
document.write(greeter.greet("yuval"));

ReactDOM.render(
    <h1>Hello, world!</h1>,
    document.getElementById('root')
)