import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

/**
 * HOC that Handles whether or not the user is allowed to see the page.
 * @param {array} allowedPermissions - user permissions that are allowed to see the page.
 * @param {Component} [defaultPage = <div />] - A react component showed if the permission is not enough.
 * @returns {Component}
 */

export default function Authorization(allowedPermissions, defaultPage) {
    return (WrappedComponent) => {
        @connect((store) => {
            return {
                user: store.user,
            };
        })
        class WithAuthorization extends React.Component {
        static propTypes = {
            user: PropTypes.object,
        };

        constructor(props) {
            super(props);
        }

        render() {
            const {user} = this.props;
            const validPermission = allowedPermissions
                .map((permission) => user.permissions.includes(permission))
                .reduce((res, val) => res | val, false);
            if (user.authorized && validPermission) {
                return (<WrappedComponent {...this.props} />);
            } else {
                if (defaultPage) return defaultPage;
                else return (<div />);
            }
        }
        }

        return WithAuthorization;
    };
}
