import React from 'react';
import Loadable from 'react-loadable';

import 'stylesheet/vendor/loading.css';

const Loading = (props) => {
    const size = (props.size) ? props.size : 10;
    if (props.error) {
        // NOTE Handling props.error is required, or error messages will be suppressed by Promise.
        // eslint-disable-next-line no-console
        console.error(props.error);
    } else if (props.pastDelay) {
        return (<div className='loader' style={{fontSize: size + 'px'}} />);
    } else {
        return null;
    }
};

export default function MyLoadable(opts) {
    return Loadable(Object.assign({
        loading: Loading,
    }, opts));
}
