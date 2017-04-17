import { createStore, applyMiddleware } from 'redux';
import reducer from './reducer';
import thunk from 'redux-thunk';

const state = {
    current: {
        signedUser: undefined,
        week: 0,
        weight: 0,
    },
    users: [],
    weights: [],
    managers: {},
    groups: {},
}

const logger = store => next => action => {
  console.group(action.type)
  console.info('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  console.groupEnd(action.type)
  return result
}

const store = createStore(reducer, state, applyMiddleware(thunk, logger));

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