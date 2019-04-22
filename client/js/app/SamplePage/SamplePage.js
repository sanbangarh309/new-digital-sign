import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import misc from 'src/misc';

@connect((store) => {
    return {
        message: store.misc.message,
    };
})
export default class SamplePage extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func,
        message: PropTypes.string,
    };

    componentDidMount() {
        this.props.dispatch(misc.actions.fetchMessage());
    }

    render() {
        return (
            <div>{this.props.message}</div>
        );
    }
}
