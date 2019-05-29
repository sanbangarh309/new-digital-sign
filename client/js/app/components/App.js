import React from 'react';
import PropTypes from 'prop-types';
import history from '../history';
import Header from './Header';
import Comment from './Comment';
import Footer from './Footer';
import ModalComponent from './ModalComponent';
import './loader.css';
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
