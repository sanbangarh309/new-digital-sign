import * as constants from './constants';
import * as helper from 'src/common/actionHelpers';
import userModel from './model';

const initialState = {
    ...userModel,
    authorized: false,
    fetching: false,
    fetched: false,
    error: null,
};

function userReducerHelper(action, obj) {
    const {stat, act} = helper.parseActionType(action);

    if (stat === helper.failState && act === 'REAUTH') {
        // Remove out-dated login token and unauthorize the user
        obj.authorized = false;
        obj.permissions = [];
        localStorage.removeItem('jwtToken');
    }
    // If the state code is ok (fulfilled)
    if (stat === helper.okState) {
        if (act === 'AUTH' || act === 'REAUTH') {
            // Update user info.
            const user = action.payload.user;
            // Update fields and authorized
            obj = {...obj, ...user, authorized: true};
            if (action.payload.token) {
                localStorage.setItem('jwtToken', action.payload.token);
            }
        }
    }
    // Unauthorize never fails, enter for all state codes
    if (act === 'UNAUTH') {
        obj.authorized = false;
        obj.permissions = [];
        localStorage.removeItem('jwtToken');
    }

    // Do this at the end to prevent overwriting the contents by programmers
    helper.updateObjectState(action, obj);

    return obj;
}

export default function(state = initialState, action) {
    const actionType = helper.parseActionType(action);

    // Clear error state information when the URL changes
    if (action.type === '@@router/LOCATION_CHANGE') {
        return {...state, error: null};
    }
    // Skip actions that does not belong to us
    if (actionType.module !== constants.NAME) return state;
    if (actionType.sub === 'USER') {
        // The returned object must be a new one for react to work
        return {...state, ...userReducerHelper(action, state)};
    }

    return state;
}
