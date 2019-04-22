import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import './About.css';
import axios from 'src/common/myAxios';

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page:'About',
      data:[]
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(e){
    this.setState({[e.target.name]:e.target.value});
   }

  render() {
    return (
      <div>
      <div className="page-main">
  <div className="banner-page container-fluid">
    <div className="container">
      <div className="col-sm-12 p-0 text-center">
        <h2 className="page-heading">About Our Organization</h2>
      </div>
    </div>
  </div>
  <div className="content-inner">
    <div className="container">
      <div className="col-md-8 offset-md-2 p-0 text-center">
        <h3 className="section-heading text-center">We make your business gain more revenue at a glance.</h3>
        <p className="lead">Maecenas sed diam eget risus varius blandit sit amet non magna. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Vestibulum id ligula porta felis euismod semper. Nulla vitae elit libero, a pharetra augue. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Maecenas mollis interdum!</p>
        <a href="#0" className="cta cta-default all-caps contact-trigger"> Get in Touch</a>
      </div>
    </div>
  </div>
  <section id="how-it-works" className="gray-bg centered how-it-works">
      <div className="container">
        <div className="col-sm-12 p-0 text-center">
          <h2 className="page-heading">How It works</h2>
        </div>
      </div>
      <div className="container-fluid how-it-works-col">
        <div className="row">
            <div className="col-md-4">
              <div className="how-it-works-title">

                <img src="/assets/img/responsive-icon.png" alt="Fully Responsive"/>
                <h4>Fully Responsive</h4>

              </div>

              <div className="how-it-works-info">

                <h4>Fully Responsive</h4>
                <p><strong>Aenean eu leo quam</strong>. Pellentesque ornare sem lacinia quam venenatis vestibulum. Maecenas faucibus mollis interdum. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. <a href="#0">Cras mattis</a> consectetur purus sit amet fermentum. </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="how-it-works-title">

                <img src="/assets/img/pencil-icon.png" alt="Fully Responsive"/>
                <h4>Easy to Customize</h4>
              </div>
              <div className="how-it-works-info">
                <h4>Easy to Customize</h4>
                <p><strong>Aenean eu leo quam</strong>. Pellentesque ornare sem lacinia quam venenatis vestibulum. Maecenas faucibus mollis interdum. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. <a href="#0">Cras mattis</a> consectetur purus sit amet fermentum. </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="how-it-works-title">

                <img src="/assets/img/book-icon.png" alt="Fully Responsive"/>
                <h4>Well Documented</h4>

              </div>

              <div className="how-it-works-info">
                <h4>Well Documented</h4>
                <p><strong>Aenean eu leo quam</strong>. Pellentesque ornare sem lacinia quam venenatis vestibulum. Maecenas faucibus mollis interdum. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. <a href="#0">Cras mattis</a> consectetur purus sit amet fermentum. </p>
                <a href="#0" className="cta cta-default all-caps">Purchase Now</a>
              </div>
            </div>
        </div>
      </div>
    </section>
  </div>
<div className="back-top" title="Top of Page"><i className="fa fa-arrow-up"></i></div>
     </div>
    );
  }
}

export default About;
