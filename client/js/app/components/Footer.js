import React from 'react';
var NavLink = require('react-router-dom').NavLink;
import ModalComponent from './ModalComponent';
import axios from 'src/common/myAxios';
import swal from 'sweetalert';
const subscribeNews = (e) => { 
	let email = $('#subscribed_email').val();
	axios.post('/api/add_guest', { name:email,email: email, subscribed:1 }).then((res) => {
		$('#subscribed_email').val('');
		swal("Subscribed!", "You Subscribed Successfully for newsletter", "success");
	}).catch(error => {
		console.log(error.response);
	});
}

const Footer = () => (
  <footer className="footer">
<div className="footer-widgets">
<div className="container">
   <div className="row">
	  <div className="col-md-2 eql-colmn">
		 <aside className="widget widget-recent-entries">
			<div className="widget-title">
			   <h6>Links</h6>
			</div>
			<ul className="footer-links list-inline">
			   <li><NavLink exact to='/'>HOME</NavLink></li>
			   <li><NavLink exact to='/about'>ABOUT</NavLink></li>
			   <li><NavLink exact to='/prices'>PRICES</NavLink></li>
			   <li><NavLink exact to='/feature'>FEATURES</NavLink></li>
			   <li><NavLink exact to='/contact'>CONTACT</NavLink></li>
			</ul>
		 </aside>
	  </div>
	  <div className="col-md-3 eql-colmn">
		 <aside className="widget widget-recent-entries">
			<div className="widget-title">
			   <h6>100% Legal In</h6>
			</div>
			<ul className="footer-links list-inline f-list">
			   <li><a href="#"><img src="/assets/img/us-flag.png"/> USA </a></li>
			   <li><a href="#"><img src="/assets/img/ca-flag.png"/> Canada</a></li>
			   <li><a href="#"><img src="/assets/img/sing-flag.png"/> Singapore</a></li>
			   <li><a href="#"><img src="/assets/img/eu-flag.png"/> European Union</a></li>
			   <li><a href="#"><img src="/assets/img/globe-flag.png"/> Globe Other nations</a></li>
			</ul>
		 </aside>
	  </div>
	  <div className="col-md-3">
		 <aside className="widget widget-text">
			<div className="widget-title">
			   <h6>OUR Address</h6>
			   <address>
				  <p><i className="fa fa-map-marker"></i><span>Lorem Ipsum is simply dummy<br/> text of the printing and typesetting industry</span></p>
				  <p><i className="fa fa-phone"></i><span>(+62) 21-2224 3333</span></p>
			   </address>
			</div>
		 </aside>
	  </div>
	  <div className="col-md-4">
		 <aside className="widget widget-text">
			<div className="widget-title">
			   <h6>STAY IN TOUCH</h6>
			</div>
			<div className="subscription-form-wrapper">
			   <form className="subscription-form d-flex">
				  <input className="input-text subscription-input" id ="subscribed_email" placeholder="Subscribe our newsletter" size="21" type="email"/>
				  <button type="button" className="btn button" onClick={subscribeNews}><i className="fa fa-paper-plane"></i></button>
			   </form>
			</div>
			<div className="textwidget">
			   <ul className="social-icons">
				  <li><a href="#"><i className="fa fa-facebook-f"></i></a></li>
				  <li><a href="#"><i className="fa fa-twitter"></i></a></li>
				  <li><a href="#"><i className="fa fa-instagram"></i></a></li>
			   </ul>
			</div>
		 </aside>
	  </div>
   </div>
</div>
</div>
<div className="footer-bar">
<div className="container">
   <div className="row">
	  <div className="col-md-12 text-center">
		 <div className="copyright">
			<p>©  2018 . All rights reserved.</p>
		 </div>
	  </div>
   </div>
</div>
</div>
<ModalComponent/>
</footer>
);

export default Footer;
