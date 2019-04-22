import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import auth from 'src/auth';

@connect((store) => {
    return {
        user: store.user,
    };
})
export default class signUpForm extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func,
        user: PropTypes.object,
    };

    constructor() {
        super();

        this.state = {
            email: '',
            password: '',
            confirmedPassword: '',
            name: '',
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
        this.props.dispatch(auth.actions.signup(this.state));
    }

    render() {
        const {user} = this.props;

        return (
            <form>
                <label>Email:</label>
                <input required
                    name='email'
                    type='email'
                    placeholder='email@host'
                    value={this.state.email}
                    onChange={this.handleChange}
                />
                <label>Username:</label>
                <input required
                    name='name'
                    type='text'
                    placeholder='User name'
                    value={this.state.name}
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
                <label>Confirmed Password:</label>
                <input required
                    name='confirmedPassword'
                    type='password'
                    placeholder='********'
                    value={this.state.confirmedPassword}
                    onChange={this.handleChange}
                />
                <button type='submit' onClick={this.handleSubmit}>Signup</button>
                <br/>
                <p>{user.error}</p>
            </form>
        );
    }
}
