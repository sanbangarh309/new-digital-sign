import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import auth from 'src/auth';

@connect((store) => {
    return {
        user: store.user,
    };
})
export default class LoginForm extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func,
        user: PropTypes.object,
    };

    constructor() {
        super();

        this.state = {
            email: '',
            password: '',
        };
        // This binding is necessary to make `this` work in the callback
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.dispatch(auth.actions.login(this.state, '/basic-permission'));
    }

    render() {
        const {user} = this.props;
        if (user.authorized) {
            return <p>You are logged in as {user.name} already.</p>;
        }

        return (
            <form>
                <label>Email:</label>
                <input required
                    name='email'
                    type='text'
                    placeholder='email@host'
                    value={this.state.email}
                    onChange={this.handleChange}
                />
                <label>Password:</label>
                <input required
                    name='password'
                    type='password'
                    placeholder='********'
                    value={this.state.password}
                    onChange={this.handleChange}
                />
                <button type='submit' onClick={this.handleSubmit}>Login</button>
                <br/>
                <p>{user.error}</p>
            </form>
        );
    }
}
