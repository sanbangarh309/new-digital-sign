import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import './Prices.css';
import axios from 'src/common/myAxios';

class Prices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page:'Prices',
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
        <h2 className="page-heading">Prices</h2>
      </div>
    </div>
  </div>
  <div className="content-inner">
    <div className="container">
      <div className="col-md-8 offset-md-2 p-0 text-center">
        <h3 className="section-heading text-center">Secure your seat and get access to all parties and side events..</h3>
      </div>
      <div className="col-md-12 pricing">
        <div className="row">
          <div className="col-md-3">
            <div className="price text-center">
              <h5 className="price-title">One day pass</h5>
              <div className="price-amount">$25</div>
              <ul className="price-feature">
                <li>1 Maecenas sed diam eget risus varius blandit</li>
                <li>200 Cras justo odio dapibus quam</li>
                <li>UNLIMITED facilisis faucibus dolor auctor</li>
                <li>Vivamus sagittis lacus vel augue laoreet rutrum</li>
              </ul>
              <a href="#0" className="price-button text-uppercase">Buy Now</a>
            </div>
          </div>

          <div className="col-md-3">
            <div className="price text-center">
              <h5 className="price-title">Two days pass</h5>
              <div className="price-amount">$35</div>
              <ul className="price-feature">
                <li>2 Maecenas sed diam eget risus varius blandit</li>
                <li>250 Cras justo odio dapibus quam</li>
                <li>UNLIMITED facilisis faucibus dolor auctor</li>
                <li>Vivamus sagittis lacus vel augue laoreet rutrum</li>
              </ul>
              <a href="#0" className="price-button text-uppercase">Buy Now</a>
            </div>
          </div>
          <div className="col-md-3">
            <div className="price best-value text-center">
              <h5 className="price-title">Three days pass</h5>
              <span className="best-value-label">best value</span>
              <div className="price-amount">$50</div>
              <ul className="price-feature">
                <li>3 Maecenas sed diam eget risus varius blandit</li>
                <li>400 Cras justo odio dapibus quam</li>
                <li>UNLIMITED facilisis faucibus dolor auctor</li>
                <li>Vivamus sagittis lacus vel augue laoreet rutrum</li>
                <li>Sed blandit non mi <span className="price-label">Free</span></li>
              </ul>
              <a href="#0" className="price-button text-uppercase">Buy Now</a>

            </div>
          </div>

          <div className="col-md-3">
            <div className="price text-center">
              <h5 className="price-title">Three days VIP</h5>
              <div className="price-amount">$75</div>
              <ul className="price-feature">
                <li>2 Maecenas sed diam eget risus varius blandit</li>
                <li>450 Cras justo odio dapibus quam</li>
                <li>UNLIMITED facilisis faucibus dolor auctor</li>
                <li>Vivamus sagittis lacus vel augue laoreet rutrum <span className="price-label">Free</span></li>
              </ul>
              <a href="#0" className="price-button text-uppercase">Buy Now</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div className="back-top" title="Top of Page"><i className="fa fa-arrow-up"></i></div>
      </div>
    );
  }
}

export default Prices;
