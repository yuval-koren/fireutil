import { createStore } from 'redux';
import reducer from './reducer'
import FirebaseConnection from '../utils/FirebaseConnection'

const store = createStore(reducer, {
    current: {
        signedUser: undefined,
        week: 0,
    },
    users: [],
    weights: [],
    managers: {},
    groups: {}
});

export default store;

/*
    store
    - current
        - signedUser
        - week
        - group
        - user
        - weight
        - status
*/