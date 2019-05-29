import React from 'react';
import ReactDOM from 'react-dom';

import Loadable from './app/components/LoadableCircle';
import * as serviceWorker from './serviceWorker';
// Asynchronous load main web page
const App = Loadable({
    loader: () => import('./app'),
});

import 'font-awesome/css/font-awesome.min.css';
import '../public/assets/css/docs.theme.min.css';
import '../public/assets/css/owl.carousel.min.css';
// import '../css/owl.theme.default.min.css';
import '../public/assets/css/bootstrap.min.css';
import '../public/assets/css/animate.min.css';
import '../public/assets/css/style.css';
import '../public/assets/css/responsive.css';
// Js Files
import 'jquery';
// import $ from 'jquery';
import 'popper.js/dist/popper.js';
import 'bootstrap/dist/js/bootstrap';
import WOW from 'wow.js'
import '../public/assets/scripts/custom.js';
const wow = new WOW({
    boxClass: 'wow',
    animateClass: 'animated',
    offset: 0,
    live: true
});

// Reset all CSS settings in browsers
import 'stylesheet/normalize.css';

ReactDOM.render(<App />, document.getElementById('app'));
serviceWorker.unregister();