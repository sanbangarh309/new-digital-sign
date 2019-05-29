import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import Loadable from './components/LoadableCircle';

import features from './features';
import auth from 'src/auth';

import App from './components/App';
import Logout from './Logout';
import Signature_edit from './Signature/Signature_edit';
import Template from './Dashboard/Template';
// import Admin from './Admin';

const Home = Loadable({
    loader: () => import('./Home/route'),
});

const AdvPerm = auth.permission.verify.custom(['advanced'], <p>Your permission is not enough.</p>);

// Must construct an object out of render() function for
// both performance and the correctness of module states, i.e. this.state.
const TestWithAdvPerm = AdvPerm(Home);

export default () => (
    <App>
        <Switch>
            <Route exact path="/" component={Home} />
            {/* This can only be viewed with advanced permission */}
            <Route path="/advanced-permission" component={TestWithAdvPerm} />
            <Route key="signature_edit" exact path="/signature/:id" component={Signature_edit} />
            <Route path="/logout" component={Logout.route} />
            <Route path="/templates" component={Template} />
            {/* <Route path="/admin" component={Admin} /> */}
            {/* Import all routes, permissions are verified in each route */}
            {features.filter((feature) => feature.route).map((feature) => (
                <Route
                    key={feature.constants.NAME}
                    path={`/${feature.constants.NAME}`}
                    component={feature.route}
                />
            ))}
            {/* <Redirect to="/" /> */}
        </Switch>
    </App>
);
