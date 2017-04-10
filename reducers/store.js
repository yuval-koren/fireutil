import { createStore } from 'redux';
import reducer from './authenticationReducer'

const store = createStore(reducer, {});

export default store;
