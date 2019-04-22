import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import * as helper from 'src/common/actionHelpers';

import features from './features';

const reducers = {};
// Setup all reducers which are used in this module
features.filter((feature) => feature.reducer).forEach((feature) => {
    reducers[feature.constants.NAME] = feature.reducer;
});
// reducers['docs'] = function(state = initialState, action) {
//     helper.updateObjectState(action, obj);
//     return state;
// };
// Setup other routerReducer for history accessesss
reducers.router = routerReducer;
const appReducer = combineReducers(reducers);

// Flush out the (sensitive) data when logged out to prevent
// data leak when switching between users with different permissions.
const rootReducer = (state, action) => {
    // console.log(action)
    // console.log(state)
    // if(action.type && action.type =='DOCS_SAVED_FULFILLED'){
    //      const docs = action.payload; 
    //      let obj = {...obj, ...docs, authorized: true};
    //      console.log(obj)
    //      helper.updateObjectState(action, obj);
    // }
   
    if (action.type === 'CLEAR_STORE') {
        /* Code for handling Redux persist
        Object.keys(state).forEach((key) => {
            storage.removeItem(`persist:${key}`);
        });
        */
        state = undefined;
    }

    return appReducer(state, action);
};

export default rootReducer;
