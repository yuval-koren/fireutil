

const reducer = (state, action) => {
    switch (action.type) {
        case 'login':
            let group = undefined;
            let isAssignToSingleGroup = state.managers && state.managers[action.payload.uid] && state.managers[action.payload.uid].length == 1;
            if (isAssignToSingleGroup) {
                group = state.managers[action.payload.uid][0];
            }

            return Object.assign({}, state, {
                current: Object.assign({}, state.current, {
                    signedUser: {
                        email: action.payload.email,
                        uid: action.payload.uid,
                    },
                    group: group
                })
            })

        case 'logout':
            return Object.assign({}, state, {
                current: Object.assign({}, state.current, {
                    signedUser: undefined,
                    group: undefined
                })
            })

        case 'setCurrentWeek':
            return Object.assign({}, state, {
                current: Object.assign({}, state.current, {
                    week: action.payload
                })
            })

        case 'setCurrentGroup':
            return Object.assign({}, state, {
                current: Object.assign({}, state.current, {
                    group: action.payload
                })
            })

        case 'setCurrentUser':
            return Object.assign({}, state, {
                current: Object.assign({}, state.current, {
                    week: action.payload
                })
            })

        case 'setCurrentWeight':
            return Object.assign({}, state, {
                current: Object.assign({}, state.current, {
                    weight: action.payload
                })
            })

        case 'setCurrentStatus':
            return Object.assign({}, state, {
                current: Object.assign({}, state.current, {
                    status: action.payload
                })
            })

        case 'PREV_WEEK':
            return Object.assign({}, state, {
                current: Object.assign({}, state.current, {
                    week: +state.current.week > 0 ? state.current.week-1 : 0
                })
            })

        case 'NEXT_WEEK':
            return Object.assign({}, state, {
                current: Object.assign({}, state.current, {
                    week: +state.current.week + 1
                })
            })

        case 'SET_WEEK':
            return Object.assign({}, state, {
                current: Object.assign({}, state.current, {
                    week: +action.payload
                })
            })
        
        case 'PREV_CURRENT_USER':
            return Object.assign({}, state, {
                current: Object.assign({}, state.current, {
                    week: {}
                })
            })

        case 'NEXT_CURRENT_USER':
            return Object.assign({}, state, {
                current: Object.assign({}, state.current, {
                    user: {}
                })
            })

        case 'SET_CURRENT_USER':
            return Object.assign({}, state, {
                current: Object.assign({}, state.current, {
                    user: action.payload
                })
            })

        case 'SET_USER':
            return Object.assign({}, state, {
                users: Object.assign({}, state.current, {
                    user: action.payload
                })
            })

        case 'SET_WEIGHT':
            return Object.assign({}, state, {
                current: Object.assign({}, state.current, {
                    user: action.payload
                })
            })
            
        case 'SET_MANAGER':
            let currentManagerGroups = state.managers[action.payload.key] || [];
            let newarr = [...currentManagerGroups, action.payload.groupKey];
            let newobj = {};
            newobj[action.payload.key] = newarr;
            let newState = state;

            let isThisGroupBelongToLoggedinUserWithNoGroup = !state.current.group && state.current.signedUser && action.payload.key === state.current.signedUser.uid;

            if (isThisGroupBelongToLoggedinUserWithNoGroup) {
                newState = Object.assign({}, state, {
                    current: Object.assign({}, state.current, {
                        group: newarr[0]
                    })
                })
            }

            return Object.assign({}, newState, {
                managers: Object.assign({}, newState.managers, newobj)
            })


        case 'SET_GROUP':
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