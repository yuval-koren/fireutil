import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Route, BrowserRouter as Router } from 'react-router-dom';
import { Provider, connect } from 'react-redux';


export default class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-bottom">
                <div className="container">
                    <div className="navbar-header">
                        <p className="navbar-text" href="#">Site made by Yuval Koren</p>
                    </div>
                </div>
            </nav>
        );
    }
}
