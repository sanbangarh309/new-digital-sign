import axios from 'src/common/myAxios';

import * as t from './actionTypes';
import {ok, fail} from 'src/common/actionHelpers';

export function fetchMessage() {
    return async (dispatch) => {
        dispatch({type: t.FETCH_MESSAGE});
        try {
            const response = await axios.get('/api/auth/fetchMessage');
            dispatch({
                type: ok(t.FETCH_MESSAGE),
                payload: response.data.message,
            });
        } catch (err) {
            dispatch({
                type: fail(t.FETCH_MESSAGE),
                payload: err.response.data,
            });
        }
    };
}
