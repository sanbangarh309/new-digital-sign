import React from 'react';
import {connect} from 'react-redux';
import history from '../history';
import  { Redirect } from 'react-router-dom'
var NavLink = require('react-router-dom').NavLink;
import auth from 'src/auth';
const Header = () => {
	let forgotid = null;
   if(history.location.query.forgot){
      forgotid = history.location.query.id; 
	}
	// console.log(forgotid);debugger;
	if(forgotid){
		localStorage.setItem('jwtToken','');
		auth.actions.logout();
	}
   if (localStorage.getItem('jwtToken')) {
      return <Redirect to={'/dashboard'}  />
   }
  let user_action = <a className="" href="javascript:void(0)" data-toggle="modal" data-target="#auth-modal">
  <span className="fa fa-unlock-alt"></span>
  Login</a>;
  if (localStorage.getItem('jwtToken')) {
    user_action = <a className="" href="./logout">
    <span className="fa fa-unlock-alt"></span>
    Logout</a>;
  }
  return (
   <header className="home-header">
      <nav className="navbar navbar-expand-lg navbar-light custom-navheader" id="sroll-className">
          <a className="navbar-brand d-lg-block d-md-block" href="/"><img src="/assets/img/fina-logo.png" alt=""/></a>
  			<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
  				<span className="navbar-toggler-icon"></span>
  			</button>
        <div className="collapse navbar-collapse navigation-bar" id="navbarCollapse">
  				<ul className="navbar-nav ml-auto custom-nav">
  					<li className="nav-item">
                  <NavLink exact activeClassName='active' to='/'>
  					   <span className="fa fa-home"></span>
  					   Home</NavLink>
  					</li>
  					<li className="nav-item">
              <NavLink exact activeClassName='active' to='/about'><span className="fa fa-user"></span>
              About</NavLink>
  					</li>
  					<li className="nav-item">
  					   <NavLink exact activeClassName='active' to='/prices'>
  					   <span className="fa fa-dollar"></span>
  					   Prices</NavLink>
  					</li>
  					<li className="nav-item">
  					   <NavLink activeClassName='active' to='/feature'>
  					   <span className="fa fa-list-ul"></span>
  					   Features</NavLink>
  					</li>
  					<li className="nav-item">
                  <NavLink activeClassName='active' to='/contact'>
  					   <span className="fa fa-file"></span>
  					   Contact</NavLink>
  					</li>
  					<li className="nav-item">
  					   {user_action}
  					</li>
  				</ul>
         </div>
      </nav>
   </header>
  );
}

export default Header;
