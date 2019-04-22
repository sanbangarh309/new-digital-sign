import axios from 'src/common/myAxios';
import {push} from 'react-router-redux';

import * as t from 'src/user/actionTypes';
import {ok, fail} from 'src/common/actionHelpers';

export function reAuthorize(token, redirectTo) {
    if (typeof token !== 'string') throw Error('invalid argument: token must be a string');

    return async (dispatch) => {
        try {
            const response = await axios.post('/api/reauth', {token});
            dispatch({type: ok(t.REAUTH_USER), payload: response.data});
            if (redirectTo) dispatch(push(redirectTo));
        } catch (err) {
            dispatch({type: fail(t.REAUTH_USER), payload: err.response.data.error});
        }
    };
}

export function signup(user, redirectTo = '/') {
    return async (dispatch) => {
        try {
            const response = await axios.post('/api/signup', user);
            dispatch({type: ok(t.AUTH_USER), payload: response.data});
            dispatch(push(redirectTo));
        } catch (err) {
            dispatch({type: fail(t.AUTH_USER), payload: err.response.data.error});
        }
    };
}

export function login(user, redirectTo = '/') {
    return async (dispatch) => {
        dispatch({type: t.AUTH_USER});
        try {
            const response = await axios.post('/api/login', user);
            dispatch({type: ok(t.AUTH_USER), payload: response.data});
            dispatch(push(redirectTo));
        } catch (err) {
            dispatch({type: fail(t.AUTH_USER), payload: 'Incorrect username/password'});
        }
    };
}

export function getDocs(token) {
    if (typeof token !== 'string') throw Error('invalid argument: token must be a string');

    return async (dispatch) => {
        dispatch({type: 'DOCS_SAVED'});
        try {
            // axios.post('/api/get_docs/',{token:localStorage.getItem('jwtToken')}).then((res) => {
            //     console.log(res);
            //     this.setState({
            //       docs: res.data
            //     });
            //   });
            const response = await axios.post('/api/get_docs/', {token:token}); 
            // console.log(response);
            dispatch({type: ok('DOCS_SAVED'), payload: response.data});
            // dispatch(push(redirectTo));
        } catch (err) {
            dispatch({type: fail('DOCS_SAVED'), payload: 'not found'});
        }
    };
}

export function logout() {
    return [{type: ok(t.UNAUTH_USER)}, {type: 'CLEAR_STORE'}];
}
