import React from 'react';
import PropTypes from 'prop-types';
import history from '../history';
import Header from './Header';
import Comment from './Comment';
import  { Redirect } from 'react-router-dom'
import Footer from './Footer';
import ModalComponent from './ModalComponent';
import './loader.css';
import 'font-awesome/css/font-awesome.min.css';
import './css/docs.theme.min.css';
import './css/owl.carousel.min.css';
// import './css/owl.theme.default.min.css';
import './css/bootstrap.min.css';
import './css/animate.min.css';
import './css/style.css';
import './css/responsive.css';
// Js Files
import 'jquery';
import $ from 'jquery';
import 'popper.js/dist/popper.js';
import 'bootstrap/dist/js/bootstrap';
import WOW from 'wow.js'
import './scripts/custom.js';
const wow = new WOW({
  boxClass: 'wow',
  animateClass: 'animated',
  offset: 0,
  live: true
});
let laoder = <div id="outer-barG" style={{display:'none'}}>
                <div id="front-barG" className="bar-animationG">
                    <div id="barG_1" className="bar-lineG"></div>
                    <div id="barG_2" className="bar-lineG"></div>
                    <div id="barG_3" className="bar-lineG"></div>
                </div>
            </div>
const propTypes = {
    children: PropTypes.node.isRequired,
};
const defaultProps = {};

const App = ({children}) => {
    let url_params = history.location.pathname.split('/');
    let prms = url_params[url_params.length-1];
    console.log(prms)
    // debugger;
    // if (localStorage.getItem('jwtToken') && !prms) {
    //     return <Redirect to={'/dashboard'}  />
    // }
    if(prms == 'signature' || prms == 'dashboard' || url_params.includes('signature') || prms =='templates'){
        return (
            <div>
                {laoder}
                {children}
                <ModalComponent/>
            </div>
        );
    }
    return (
        <div>
            <Header />
            {children}
            <Comment />
            <Footer />
        </div>
    );
};

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default App;
