

const reducer = (state, action) => {
    switch (action.type) {
        case 'login':
            return Object.assign({}, state, {
                signedUser: action.signedUser
            })

        case 'logout':
            return Object.assign({}, state, {
                signedUser: undefined
            })

        default:
            return {
                signedUser: undefined
            };
    }
    return state;
}

export default reducer;