import * as constants from './constants';
import * as helper from 'src/common/actionHelpers';

const initialState = {
    message: '',
};

export default function(state = initialState, action) {
    const actionType = helper.parseActionType(action);

    // Skip actions that does not belong to us
    if (actionType.module !== constants.NAME) return state;

    if (actionType.act === 'FETCH' && actionType.sub === 'MESSAGE') {
        return {...state, message: action.payload};
    }

    return state;
}
