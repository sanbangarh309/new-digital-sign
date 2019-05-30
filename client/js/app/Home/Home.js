import React from 'react';
import axios from 'src/common/myAxios';
import './Home.css';
import OwlCarousel from 'react-owl-carousel';
import PropTypes from 'prop-types';
import auth from 'src/auth';
import {connect} from 'react-redux';

const getBase64 = (file) => {
  return new Promise((resolve,reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}
@connect((store) => {
    return {
        user: store.user,
    };
})
class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page:'home',
      added:false,
      msg: '',
      alert: '',
      email: '',
      reg_email: '',
      password: '',
      firstname: '',
      lastname: '',
      mobilecountrycode: '',
      mobile: '',
      confirmedPassword: '',
      terms: '',
      redirectToReferrer: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.convertTime = this.convertTime.bind(this);
    this.Register = this.Register.bind(this);
  }

  static propTypes = {
      dispatch: PropTypes.func,
      user: PropTypes.object,
  };

  Register(event){
    event.preventDefault();
   //  this.props.dispatch(auth.actions.signup(this.state, '/'));
   //    this.setState({
   //      added: true,
   //      msg: 'Registerted Successfully',
   //    });
   axios.post('/api/signup',this.state).then((res) => {
      this.setState({
        added: true,
        alert: 'alert alert-success form-group',
        msg: 'Registerted Successfully',
      });
    }).catch(error => {
      this.setState({
        added: true,
        alert: 'alert alert-danger form-group',
        msg: error.response.data.error,
      });
    });
  }

  componentDidMount() {
    // axios.get('/api/counters').then((res) => {
    //     this.setState({
    //         counters: res.data,
    //     });
    // });
  }

  imageUpload = (e) => {
    const file = e.target.files[0];
    getBase64(file).then(base64 => {
      this.setState({images:base64});
    });
  }

  convertTime(created) {
    let date = new Date(created * 1000);
    return date;
  }

  handleChange(e){
    this.setState({[e.target.name]:e.target.value});
  }

  render() {
    const {user} = this.props;
    let addedAlert;
    if (this.state.added) {
      addedAlert = <div className={this.state.alert} style={{textAlign:'center'}}>
      <strong>{this.state.msg}</strong>   
      </div>;
    }

    return (
      <div>
      <section className="Banner_View">
     <div className="container">
  <div className="col-12 p-0">
    <div className="row">
       <div className="col-md-8">
        <div className="banner-captions-left wow zoomIn"  data-wow-duration="800ms" data-wow-delay="500ms">
         <h1 className="">
          The greenest  & easiest way to<br/>
          get documents completed in<br/>
          your backyard or across the world
         </h1>
        </div>
       </div>
       <div className="col-md-4 p-xs-0">
        <div className="banner-captions-right">
         <h3>SIMPLE AFFORDABLE ANNUAL PLAN
          <span className="regularsize">SIGN UP FOR FREE</span> 30 DAY TRIAL
         </h3>
         <form className="row">
          <h4>SIGN UP FOR <span className="change-color">FREE</span> NOW!</h4>
          {addedAlert}
          <div className="form-group">
             <div className="input-group">
              <span className="input-group-addon"><span className="fa fa-user"></span></span>
              <input type="text" className="form-control" name="firstname" onChange={this.handleChange} required="required" placeholder="First name" />
             </div>
          </div>
          <div className="form-group">
             <div className="input-group">
              <span className="input-group-addon"><span className="fa fa-user"></span>
              </span>
              <input type="text" className="form-control" name="lastname" onChange={this.handleChange} required="required" placeholder="Last name" />
             </div>
          </div>
          <div className="form-group">
             <div className="input-group">
              <span className="input-group-addon"><span className="fa fa-envelope"></span></span>
              <input type="email" className="form-control" name="reg_email" onChange={this.handleChange} required="required"  placeholder="Email" />
             </div>
          </div>
          <div className="form-group">
             <div className="input-group">
              <span className="input-group-addon"><span className="fa fa-phone"></span></span>
              <input type="text" className="form-control" placeholder="Phone number" name="mobile" onChange={this.handleChange} required="required" />
             </div>
          </div>
          <div className="form-group">
             <div className="input-group">
              <span className="input-group-addon"><span className="fa fa-th-large"></span></span>
              <input type="text" className="form-control" name="mobilecountrycode" onChange={this.handleChange} required="required" placeholder="Country Mobile Code" />
             </div>
          </div>
          <div className="form-group">
            <div className="input-group">
            <label style={{padding: '14px',fontSize:'medium'}}>Note:- Password Strength with in 6 to 100 letters ,Must have letters , digits , not spaces and not one of these [Passw0rd, Password123]</label>
            </div>
          </div>
          <div className="form-group">
             <div className="input-group">
              <span className="input-group-addon"><span className="fa fa-building"></span></span>
              <input type="password" className="form-control" name="password" onChange={this.handleChange} required="required" placeholder="Password Must Have one upper case letter with symbols" />
             </div>
          </div>
          <div className="form-group">
             <div className="input-group">
              <span className="input-group-addon"><span className="fa fa-key"></span></span>
              <input type="password" className="form-control" name="confirmedPassword" onChange={this.handleChange} required="required" placeholder="Confirm Password" />
             </div>
          </div>
          <div className="form-group">
             <button className="signupfree" onClick={this.Register}>SIGNUP FREE</button>
          </div>
        </form>
       </div>
    </div>
  </div>
     </div>
     </div>
  </section>
  <section id="demos" className="Paretner_logos_slide">
     <div className="container">
        <div className="row">
           <div className="large-12 columns">
           <OwlCarousel
                  className="owl-theme" 
                  loop
                  margin={10}
                  items={5}
                  nav
              >
                 <div className="item">
                    <img src="/assets/img/1.jpg"/>
                 </div>
                 <div className="item">
                    <img src="/assets/img/2.jpg"/>
                 </div>
                 <div className="item">
                    <img src="/assets/img/3.jpg"/>
                 </div>
                 <div className="item">
                    <img src="/assets/img/4.jpg"/>
                 </div>
                 <div className="item">
                    <img src="/assets/img/5.jpg"/>
                 </div>
                 <div className="item">
                    <img src="/assets/img/2.jpg"/>
                 </div>
                 <div className="item">
                    <img src="/assets/img/3.jpg"/>
                 </div>
                 <div className="item">
                    <img src="/assets/img/4.jpg"/>
                 </div>
                 <div className="item">
                    <img src="/assets/img/5.jpg"/>
                 </div>
                 <div className="item">
                    <img src="/assets/img/3.jpg"/>
                 </div>
                 <div className="item">
                    <img src="/assets/img/4.jpg"/>
                 </div>
                 <div className="item">
                    <img src="/assets/img/2.jpg"/>
                 </div>
              </OwlCarousel>
           </div>
        </div>
     </div>
  </section>
  <section className="some_Bevnefits">
     <div className="container">
        <div className="row">
           <div className="col-md-12 text-center">
              <div className="ourBenfits">
                 <h1>Some Benefits</h1>
              </div>
           </div>
           <div className="col-md-5 col-sm-12 col-12 col-lg-5">
              <div className="Benifit_thumb">
                 <img src="/assets/img/benefit.png" alt=""/>
              </div>
           </div>
           <div className="col-md-7 col-sm-12 col-12 col-lg-7">
              <div className="row">
                 <div className="col-md-6">
                    <div className="first-boxsmphone">
                       <figure><img src="/assets/img/icon-1.png" alt=""/></figure>
                       <div className="box_content">
                          <p>Smartphone,tablet &<br/> computer friendly</p>
                       </div>
                    </div>
                 </div>
                 <div className="col-md-6">
                    <div className="first-boxsmphone-01">
                       <figure><img src="/assets/img/icon-2.png" alt=""/></figure>
                       <div className="box_content">
                          <p>No paper or ink</p>
                       </div>
                    </div>
                 </div>
                 <div className="col-md-6">
                    <div className="first-boxsmphone-0">
                       <figure><img src="/assets/img/icon-3.png" alt=""/></figure>
                       <div className="box_content">
                          <p>256-Bit Encryption</p>
                       </div>
                    </div>
                 </div>
                 <div className="col-md-6">
                    <div className="first-boxsmphone-02">
                       <figure><img src="/assets/img/icon-4.png" alt=""/></figure>
                       <div className="box_content">
                          <p>Legally binding e-signatures</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
     </div>
  </section>
  <section className="why-choose-us">
     <div className="container">
        <div className="row">
           <div className="col-md-12 col-sm-12 col-lg-12 text-center">
              <div className="ourBenfits">
                 <h1>WHY CHOOSE US</h1>
              </div>
           </div>
           <div className="col-md-7 col-sm-12 col-lg-7">
              <div id="accordion" className="home-accordian">
                 <div className="card">
                    <div className="card-header" id="headingOne">
                       <h5 className="mb-0">
                          <button className="custom_btn" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
            <span className="hand-icon"><i className="fa fa-handshake-o"></i></span><span className="btn-hdng">Invite Signers</span>
                          </button>
                       </h5>
                    </div>
                    <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
                       <div className="card-body">
                          Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.
                          3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt
                          laborum eiusmod.
                       </div>
                    </div>
                 </div>
                 <div className="card">
                    <div className="card-header" id="headingTwo">
                       <h5 className="mb-0">
                          <button className="custom_btn collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                          <span className="hand-icon"><i className="fa fa-clock-o"></i></span><span className="btn-hdng">Quick & Easy</span>
                          </button>
                       </h5>
                    </div>
                    <div id="collapseTwo" className="custom_btn collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                       <div className="card-body">
                          Anim pariatur cliche reprehenderit, enim eiusmod high
                          life accusamus terry richardson ad squid. 3 wolf moon officia
                          aute, non cupidatat skateboard dolor brunch. Food truck quinoa
                       </div>
                    </div>
                 </div>
                 <div className="card">
                    <div className="card-header" id="headingThree">
                       <h5 className="mb-0">
                          <button className="custom_btn collapsed" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                          <span className="hand-icon"><i className="fa fa-user-o"></i></span><span className="btn-hdng">Professional</span>
                          </button>
                       </h5>
                    </div>
                    <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordion">
                       <div className="card-body">
                          Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                          richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard
                       </div>
                    </div>
                 </div>
                 <div className="card">
                    <div className="card-header" id="headingFour">
                       <h5 className="mb-0">
                          <button className="custom_btn collapsed" data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                          <span className="hand-icon"><i className="fa fa-pencil-square-o"></i></span><span className="btn-hdng">Sign as You Want</span>
                          </button>
                       </h5>
                    </div>
                    <div id="collapseFour" className="collapse" aria-labelledby="headingFour" data-parent="#accordion">
                       <div className="card-body">
                          Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.
                          3 wolf moon officia aute, non cupidatat skateboard dolor brunch.
                       </div>
                    </div>
                 </div>
              </div>

           </div>
           <div className="col-md-5 col-sm-12 col-lg-5">
              <div className="men-img-aption">
                 <figure><img src="/assets/img/men3.png" alt="men"/></figure>
              </div>
           </div>
        </div>
     </div>
  </section>
  <section className="feedabck-section2">
     <div className="container">
        <div className="col-md-12 text-center">
           <h3 className="text-uppercase">pick your color</h3>
           <ul className="list-inline cell-list">
              <li>
                 <label className="checkcontainer">
                 <input type="radio" name="radio"/>
                 <span className="radiobtn"></span>
                 </label>
              </li>
              <li>
                 <label className="checkcontainer">
                 <input type="radio" name="radio"/>
                 <span className="radiobtn"></span>
                 </label>
              </li>
              <li>
                 <label className="checkcontainer">
                 <input type="radio" name="radio"/>
                 <span className="radiobtn"></span>
                 </label>
              </li>
           </ul>
        </div>
     </div>
  </section>
      </div>
    );
  }
}

export default Home;
