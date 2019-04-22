import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import './Feature.css';
import axios from 'src/common/myAxios';

class Feature extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page:'Feature',
      data:[]
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(e){
    this.setState({[e.target.name]:e.target.value});
   }

  render() {
    var backstyle = {
        backgroundImage: 'url(/assets/img/stock2.jpg)'
    }
    return (
      <div>
        <div className="page-main">
    <div className="banner-page container-fluid">
      <div className="container">
        <div className="col-sm-12 p-0 text-center">
          <h2 className="page-heading">Features</h2>
        </div>
      </div>
    </div>
    <div className="content-inner">
      <div className="container">
        <div className="col-md-8 offset-md-2 p-0 text-center">
          <h3 className="section-heading text-center">See the benefits you can get by working with our experts.</h3>
          <p className="lead">Maecenas sed diam eget risus varius blandit sit amet non magna. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Vestibulum id ligula porta felis euismod semper. Nulla vitae elit libero, a pharetra augue. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Maecenas mollis interdum!</p>
        </div>
        <div className="col-md-12 features-spice">
          <div className="row">
            <div className="the-feature text-center col-md-4">
                <span className="feature-icon"><img src="/assets/img/small-ico1.png" alt=""/></span>
                <h4 className="feature-title">Fully Responsive</h4>
                <p>Etiam porta sem malesuada magna mollis euismod. Donec id elit non mi porta gravida at eget metus. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
            </div>
            <div className="the-feature text-center  col-md-4">
                <span className="feature-icon"><img src="/assets/img/small-ico2.png" alt=""/></span>
                <h4 className="feature-title">Customization</h4>
                <p>Etiam porta sem malesuada magna mollis euismod. Donec id elit non mi porta gravida at eget metus. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
            </div>
            <div className="the-feature text-center  col-md-4">
                <span className="feature-icon"><img src="/assets/img/small-ico3.png" alt=""/></span>
                <h4 className="feature-title">Cross Browser Compatible</h4>
                <p>Etiam porta sem malesuada magna mollis euismod. Donec id elit non mi porta gravida at eget metus. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
            </div>
            <div className="the-feature text-center  col-md-4">
              <span className="feature-icon"><img src="/assets/img/small-ico4.png" alt=""/></span>
              <h4 className="feature-title">Affordable</h4>
              <p>Etiam porta sem malesuada magna mollis euismod. Donec id elit non mi porta gravida at eget metus. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
            </div>
            <div className="the-feature text-center  col-md-4">
                <span className="feature-icon"><img src="/assets/img/small-ico5.png" alt=""/></span>
                <h4 className="feature-title">Professional Design</h4>
                <p>Etiam porta sem malesuada magna mollis euismod. Donec id elit non mi porta gravida at eget metus. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
            </div>
            <div className="the-feature text-center  col-md-4">
                <span className="feature-icon"><img src="/assets/img/small-ico6.png" alt=""/></span>
                <h4 className="feature-title">High Conversion</h4>
                <p>Etiam porta sem malesuada magna mollis euismod. Donec id elit non mi porta gravida at eget metus. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
            </div>
          </div>
          <div className="col-12 text-center mt-30">
            <a href="#0" className="cta cta-default all-caps contact-trigger"> Signup Now</a>
          </div>
        </div>
      </div>
    </div>
    <div className="container-fluid">
      <div className="row">
        <div className="expandable-gallery-wrapper col-md-6 p-0" style={backstyle}>
        </div>
        <div className="expandable-gallery-info col-md-6">
          <h3>We even give you more</h3>
          <p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. </p>

          <ul className="checklist">
            <li>Nullam id dolor id nibh ultricies vehicula ut id elit.</li>
            <li>Aenean lacinia bibendum nulla sed consectetur.</li>
            <li>Nulla vitae elit libero, a pharetra augue.</li>
            <li>Etiam porta sem malesuada magna mollis euismod a pharetra augue.</li>
            <li className="visible-lg">Praesent commodo cursus magna, vel scelerisque nisl consectetur et.</li>
          </ul>
          <a href="#0" className="more">Read More</a>
        </div>
      </div>
    </div>
  </div>
<div className="back-top" title="Top of Page"><i className="fa fa-arrow-up"></i></div>
      </div>
    );
  }
}

export default Feature;
