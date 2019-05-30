import React, {Component} from 'react';
import './Prices.css';
import axios from 'src/common/myAxios';

class Prices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page:'Prices',
      planlist:[]
    };
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount(){
    axios.get('/api/prices').then((res) => {
      this.setState({
        planlist: res.data
      });
    }).catch(error => {
      console.log("Error!");
    });
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
                  {this.state.planlist.map((plan) => {
                    return (<div className="col-md-12">
                      <div className="price best-value text-center">
                        <h5 className="price-title">{plan.title}</h5>
                        <span className="best-value-label">Free Trial For {plan.trial_dur + ' ' + plan.trial_type+'s'}</span>
                        <div className="price-amount">${plan.price}</div>
                        <ul className="price-feature" dangerouslySetInnerHTML={{ __html: plan.content }}>
                        </ul>
                        <a href="#0" className="price-button text-uppercase">Buy Now</a>
                      </div>
                    </div>)
                  })}
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
