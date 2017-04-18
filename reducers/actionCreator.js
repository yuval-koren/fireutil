import { firebaseConnection } from '../utils/firebaseConnection'

let actions = {}

actions.login = (user) => (dispatch, getState) => {
    let state = getState();
    let isAssignToSingleGroup = state.managers && state.managers[user.uid] && state.managers[user.uid].length > 0;
    
    if (isAssignToSingleGroup) {
        let group = state.managers[user.uid][0];
        dispatch(actions.setCurrentGroup(group));
    }

    dispatch({
        type: 'LOGIN',
        payload: user,
    });
}


actions.addManager = (groupData) => (dispatch, getState) => {
    let state = getState();
    let isThisGroupBelongToLoggedinUserWithNoGroup = !state.current.group && state.current.signedUser && groupData.key === state.current.signedUser.uid;

    if (isThisGroupBelongToLoggedinUserWithNoGroup) {
        dispatch(actions.setCurrentGroup(groupData.groupKey[0]))
    }

    dispatch({
        type: 'ADD_MANAGER',
        payload: groupData,
    });
}


actions.setCurrentGroup = (group) => (dispatch, getState) => {
    dispatch(actions.clearUsers());
    dispatch(actions.clearWeights());

    if (group) {
        firebaseConnection.registerToGroup(group);
    }
    
    dispatch({
        type: 'SET_CURRENT_GROUP',
        payload: group,
    });
}


actions.clearWeights = () => (dispatch) => {
    dispatch({
        type: 'CLEAR_WEIGHTS'
    })
}


actions.clearUsers = () => (dispatch) => {
    dispatch({
        type: 'CLEAR_USERS'
    })
}

actions.logout = () => (dispatch, getState) => {
    dispatch(actions.setCurrentGroup(undefined));
    dispatch({
        type: 'LOGOUT',
    })
}


actions.setCurrentWeekPrev = () => (dispatch, getState) => {
    dispatch(actions.setCurrentWeight(0));
    dispatch({
        type: 'PREV_WEEK',
    })
}


actions.setCurrentWeekNext = () => (dispatch, getState) => {
    dispatch(actions.setCurrentWeight(0));
    dispatch({
        type: 'NEXT_WEEK',
    })
}


actions.setCurrentWeek = (week) => (dispatch, getState) => {
    dispatch(actions.setCurrentWeight(0));
    dispatch({
        type: 'SET_WEEK',
        payload: +week,
    })
}


actions.setCurrentUser = (user) => (dispatch, getState) => {
    dispatch(actions.setCurrentWeight(0));
    dispatch({
        type: 'SET_CURRENT_USER',
        payload: user,
    })
}

actions.addUser = (user) => (dispatch, getState) => {
    dispatch({
        type: 'ADD_USER',
        payload: user,
    })
    if (!getState().current.user) {
        dispatch(actions.setCurrentUser(user.key));
    }
}

actions.setCurrentWeight = (weight) => (dispatch, getState) => {
    dispatch({
        type: 'SET_CURRENT_WEIGHT',
        payload: weight,
    })
}


actions.addWeight = (weight) => (dispatch, getState) => {
    dispatch({
        type: 'ADD_WEIGHT',
        payload: weight,
    })
}

actions.addGroup = (group) => (dispatch, getState) => {
    dispatch({
        type: 'ADD_GROUP',
        payload: group,
    })
}

actions.submitWeight = (status) => (dispatch, getState) => {
    let {current} = getState();
    firebaseConnection.saveWeight(current.group, current.week, current.user, current.weight, status);
}

actions.saveUser = (group, key, name, phone) => (dispatch, getState) => {
    firebaseConnection.saveUser(group, key, name, phone);
}


export default actions;