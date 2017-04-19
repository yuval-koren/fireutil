import { firebaseConnection } from '../utils/firebaseConnection'

const reducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                current: {
                    ...state.current,
                    signedUser: {
                        email: action.payload.email,
                        uid: action.payload.uid,
                    }
                }
            }

        case 'LOGOUT':
            return {
                ...state,
                current: {
                    ...state.current,
                    signedUser: undefined
                }
            }
            
        case 'PREV_WEEK':
            return {
                ...state,
                current: {
                    ...state.current,
                    week: +state.current.week > 0 ? state.current.week-1 : 0
                }    
            }

        case 'NEXT_WEEK':
            return {
                ...state,
                current: {
                    ...state.current,
                    week: +state.current.week + 1
                }
            }

        case 'SET_WEEK':
            return {
                ...state,
                current: {
                    ...state.current,
                    week: +action.payload
                }
            }
            
        case 'SET_CURRENT_USER':
            return {
                ...state,
                current: {
                    ...state.current,
                    user: action.payload
                }
            }

        case 'ADD_USER':
            return {
                ...state,
                users: {
                    ...state.users,
                    [action.payload.key]: action.payload
                }
            }

        case 'CLEAR_USERS':
            return {
                ...state,
                users: { }
            }

        case 'ADD_WEIGHT':
            return {
                ...state,
                weights: {
                    ...state.weights,
                    [action.payload.key]: action.payload
                }
            }

        case 'CLEAR_WEIGHTS':
            return {
                ...state,
                weights: { }
            }
            
            
        case 'SET_CURRENT_WEIGHT':
            return {
                ...state,
                current: {
                    ...state.current,
                    weight: action.payload,
                }
            }
            
        case 'SET_CURRENT_GROUP':
            return {
                ...state,
                current: {
                    ...state.current,
                    group: action.payload
                },
            }

        case 'ADD_MANAGER':
            return {
                ...state,
                managers: {
                    ...state.managers,
                    [action.payload.key]: {
                        ...state.managers[action.payload.key],
                        ...action.payload.groupKey
                    }
                }
            }

        case 'ADD_GROUP':
            return {
                ...state,
                groups: {
                    ...state.groups,
                    [action.payload.key]: action.payload
                } 
            }
            

        case 'submitCurrentValues':
            break;

        case 'nextWeight':
            break;

        default:
            return state;
    }
    return state;
}

export default reducer;