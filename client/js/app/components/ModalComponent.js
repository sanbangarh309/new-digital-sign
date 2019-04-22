import React from 'react';
import  { Redirect } from 'react-router-dom'
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';
import auth from 'src/auth';
import axios from 'src/common/myAxios';
import {connect} from 'react-redux';
import history from '../history';

@connect((store) => {
  return {
      user: store.user,
  };
})

export default class ModalComponent extends React.Component {
  static propTypes = {
      dispatch: PropTypes.func,
      user: PropTypes.object,
  };
  constructor(props) {
      super(props);
      let forgotid = null;
      if(history.location.query.forgot){
        forgotid = history.location.query.id; 
      }
      // const params = this.props.location.pathname.split('/');
      // if(params[params.length-1] != 'signature'){
      //   forgot = params[params.length-1];
      // }
      this.state = {
          added: false,
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
          email_to:'',
          subject:'',
          message:'',
          tags: [],
          tag: '',
          forgotid: forgotid,
          signer:null
      };
      // This binding is necessary to make `this` work in the callback
      this.Register = this.Register.bind(this);
      this.Login = this.Login.bind(this);
      this.closePopUp = this.closePopUp.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.sendEmail = this.sendEmail.bind(this);
      this.handleChangeEmail = this.handleChangeEmail.bind(this);
      this.forgotpwd = this.forgotpwd.bind(this);
      this.submitForgot = this.submitForgot.bind(this);
  }

  componentDidMount() {
    if(this.state.forgotid){
      $('#reset_pwd_save').modal('show');
    }
  }

  handleDelete (i) {
    const tags = this.state.tags.slice(0)
    tags.splice(i, 1)
    this.setState({ tags })
  }
 
  handleAddition (tag) {
    const tags = [].concat(this.state.tags, tag)
    this.setState({ tags })
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleChange(e) {
      this.setState({[e.target.name]: e.target.value});
  }

  handleChangeEmail(e){
    e.preventDefault();
    console.log(e.target.name);
    console.log(e.target.value);
    this.setState({[e.target.name]: e.target.value});
  }

  forgotpwd(e){
    e.preventDefault();
    this.closePopUp();
    $('#forgot_pwd').modal('show');
  }

  sendEmail(e){
    e.preventDefault();
    let id = $('#emailModal form').find('#doc_id').val();
    if(this.state.email_to !='' && id){
      axios.post('/api/sendemail',{'email_to':this.state.email_to,'subject':this.state.subject,'body':this.state.message,'id':id}).then((res) => {
        this.setState({
          added: true,
          alert: 'alert alert-success',
          msg: 'Document Shared Successfully',
        });
      }).catch(error => {
        this.setState({
          added: true,
          alert: 'alert alert-danger',
          msg: error.response.data.error,
        });
      });
    }
  }

  Register(event){
    event.preventDefault();
    // this.props.dispatch(auth.actions.signup(this.state, '/'));
    //   this.setState({
    //     added: true,
    //     msg: 'Registerted Successfully',
    //   });
    axios.post('/api/signup',this.state).then((res) => {
      this.setState({
        added: true,
        alert: 'alert alert-success',
        msg: 'Registerted Successfully',
      });
    }).catch(error => {
      this.setState({
        added: true,
        alert: 'alert alert-danger',
        msg: error.response.data.error,
      });
      // $('.login-tabs__login').click();
    });
  }

  submitForgot(e){
    // console.log(this.state.email);
    // if(this.state.email){
      axios.post('/api/forgot',this.state).then((res) => {
        this.setState({
          added: true,
          alert: 'alert alert-success',
          msg: this.state.email ? 'Please Check Your Email' : 'Password Changed Successfully.',
        });
      }).catch(error => {
        this.setState({
          added: true,
          alert: 'alert alert-danger',
          msg: error.response.data.error,
        });
      });
    // }
  }

  Login(event){
    event.preventDefault();
    this.props.dispatch(auth.actions.login(this.state, '/dashboard'));
    setTimeout(
      function() {
        // console.log(this.props)
        const {user} = this.props;
        if(user && user.email !=''){
            // console.log(this.props.action)
            this.setState({
              added: true,
              alert: 'alert alert-success',
              msg: 'Logged In Successfully! Redirecting..',
            });
            // document.getElementById("hidePopUpBtn").click();
            setTimeout(function(){ $('#auth-modal').modal('hide');$('.modal-backdrop').remove();$('body').removeClass('modal-open') }, 1000);
        }else{
          this.setState({
            added: true,
            alert: 'alert alert-danger',
            msg: user.error,
          });
        }
      }
      .bind(this),
      1000
  );
    // if(user && user.user.email !=''){
      // console.log(this.props.action)
      // this.setState({
      //   added: true,
      //   alert: 'alert alert-success',
      //   msg: 'Logged In Successfully! Redirecting..',
      // });
      // document.getElementById("hidePopUpBtn").click();
    // }
  }
  closePopUp(){
    this.setState({
      added: false,
      alert: '',
      msg: '',
    });
  }
  render() {
    let cusClass = ['modal','fade','auth-modal','no-guest-checkout'];
    let addedAlert;
    let added = this.state.added;
    let alert = this.state.msg;
    if (this.state.added) {
      addedAlert = <div className={this.state.alert} style={{textAlign:'center'}}>
      <strong>{this.state.msg}</strong>   
      </div>;
      // this.closePopUp()
    }
    
    setTimeout(function() { 
      // $(".alert").fadeTo(500, 0).slideUp(500, function(){
      //     $(this).remove(); 
      // });
      if(added && alert == 'Registerted Successfully'){
        $("form.sign-up input").each(function( index ) {
          $(this).val('');
        });
      }
     }, 4000);
     this.state.added = false;
     console.log(addedAlert)
    return (
      <div>
        <div className={cusClass.join(' ')} id="auth-modal" tabIndex="-1" role="dialog">
           <div className="modal-dialog">
              <div className="modal-content">
                 <button type="button" className="close" id = "hidePopUpBtn" data-dismiss="modal" aria-hidden="true">×</button>
                 <div className="modal-body">
                    <div className="content-block auth login js-login-register-flow">
                <ul className="nav nav-pills nav-justified login-tabs no-guest-checkout">
                  <li className="login-tabs__sign-up"><a data-toggle="tab" href="#register" onClick={this.closePopUp}>Sign up</a></li>
                  <li className="login-tabs__login active"><a data-toggle="tab" onClick={this.closePopUp} href="#login">Log in</a></li>
                </ul>
                  <div className="login-register-content-block tab-content">
                  <div id="login" className="tab-pane active show">
                  {addedAlert}
                    <div className="facebook-login-container">
                       <a href="https://www.facebook.com/v2.8/dialog/oauth?client_id=1441869016037016&amp;state=afe9c619d8712b868b886f6354651c21&amp;response_type=code&amp;sdk=php-sdk-5.4.4&amp;redirect_uri=https%3A%2F%2Fwww.foodpanda.in%2Ffacebook-login-callback%3FfacebookRedirectUrl%3DL2NvbnRlbnRzL2Fib3V0Lmh0bQ%253D%253D&amp;scope=email%2Cpublic_profile" className="init-facebook-login btn btn-lg btn-block js-modal-ignore">
                       Continue with Facebook
                       </a>
                       <div className="or-separator">
                        <span>OR</span>
                       </div>
                    </div>
                    <form className="login">
                       <div className="form-group login__email">
                        <label className="control-label sr-only required" for="customer_login_email"> Email
                        </label>
                        <input id="customer_login_email" name="email" onChange={this.handleChange} required="required" className="form-control input-lg" placeholder="Email" type="email"/>
                        <span className="input-helper">
                            <svg className="next-icon next-icon--color-slate-lighter next-icon--size-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M460.6 147.3L353 256.9c-.8.8-.8 2 0 2.8l75.3 80.2c5.1 5.1 5.1 13.3 0 18.4-2.5 2.5-5.9 3.8-9.2 3.8s-6.7-1.3-9.2-3.8l-75-79.9c-.8-.8-2.1-.8-2.9 0L313.7 297c-15.3 15.5-35.6 24.1-57.4 24.2-22.1.1-43.1-9.2-58.6-24.9l-17.6-17.9c-.8-.8-2.1-.8-2.9 0l-75 79.9c-2.5 2.5-5.9 3.8-9.2 3.8s-6.7-1.3-9.2-3.8c-5.1-5.1-5.1-13.3 0-18.4l75.3-80.2c.7-.8.7-2 0-2.8L51.4 147.3c-1.3-1.3-3.4-.4-3.4 1.4V368c0 17.6 14.4 32 32 32h352c17.6 0 32-14.4 32-32V148.7c0-1.8-2.2-2.6-3.4-1.4z"/><path d="M256 295.1c14.8 0 28.7-5.8 39.1-16.4L452 119c-5.5-4.4-12.3-7-19.8-7H79.9c-7.5 0-14.4 2.6-19.8 7L217 278.7c10.3 10.5 24.2 16.4 39 16.4z"/></svg>
                            </span>
                       </div>
                       <div className="form-group login__password">
                        <label className="control-label sr-only required" for="customer_login_password">Password
                        </label>
                        <input id="customer_login_password" name="password" onChange={this.handleChange} required="required" className="form-control input-lg" placeholder="Password" type="password"/>
                        <span className="input-helper">
                          <svg className="next-icon next-icon--color-slate-lighter next-icon--size-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M376 192h-24v-46.7c0-52.7-42-96.5-94.7-97.3-53.4-.7-97.3 42.8-97.3 96v48h-24c-22 0-40 18-40 40v192c0 22 18 40 40 40h240c22 0 40-18 40-40V232c0-22-18-40-40-40zM270 316.8v68.8c0 7.5-5.8 14-13.3 14.4-8 .4-14.7-6-14.7-14v-69.2c-11.5-5.6-19.1-17.8-17.9-31.7 1.4-15.5 14.1-27.9 29.6-29 18.7-1.3 34.3 13.5 34.3 31.9 0 12.7-7.3 23.6-18 28.8zM324 192H188v-48c0-18.1 7.1-35.1 20-48s29.9-20 48-20 35.1 7.1 48 20 20 29.9 20 48v48z"/></svg>
                        </span>
                       </div>
                       <div className="form-group">
                        <div className="col-sm-12 auth-submit">
                           <div className="login__remember-me">
                            <input id="customer_login_rememberCustomerLogin" name="remember" onChange={this.handleChange} value="1" type="checkbox"/>
                            <label className="control-label" for="customer_login_rememberCustomerLogin"> Remember me
                            </label>
                          </div>
                           <div className="login__forgot-password">
                            <a href="javascript:void(0)" onClick={this.forgotpwd}>
                            Forgot your password?
                            </a>
                           </div>
                        </div>
                       </div>
                       <div className="form-group login__submit">
                        <button type="submit" id="customer_login_login" className="btn btn-primary btn-lg btn-block" onClick={this.Login}>Log in</button>
                       </div>
                    </form>
                  </div>
                  <div id="register" className="tab-pane fade">
                    <div className="login-register-content-block">
                    {addedAlert}
                      <div className="facebook-login-container">
                        <a href="https://www.facebook.com/v2.8/dialog/oauth?client_id=1441869016037016&amp;state=afe9c619d8712b868b886f6354651c21&amp;response_type=code&amp;sdk=php-sdk-5.4.4&amp;redirect_uri=https%3A%2F%2Fwww.foodpanda.in%2Ffacebook-login-callback%3FfacebookRedirectUrl%3DL2NvbnRlbnRzL2Fib3V0Lmh0bQ%253D%253D&amp;scope=email%2Cpublic_profile" className="init-facebook-login btn btn-lg btn-block js-modal-ignore">
                        Continue with Facebook
                        </a>
                        <div className="or-separator">
                          <span>OR</span>
                        </div>
                      </div>
                      <form role="form" noValidate="novalidate" className="sign-up">
                          <div className="form-group">
                           <div className="col-12 p-0 raw">
                            <div className="col-md-6">
                               <label className="control-label sr-only required" for="customer_registration_firstName"> First name</label>
                               <input id="customer_registration_firstName" name="firstname"  onChange={this.handleChange} required="required" className="form-control input-lg" placeholder="First name" type="text"/>
                            </div>
                            <div className="col-md-6">
                               <label className="control-label sr-only required" for="customer_registration_lastName">Last name</label>
                               <input id="customer_registration_lastName" name="lastname" onChange={this.handleChange} required="required" className="form-control input-lg" placeholder="Last name" type="text"/>
                            </div>
                           </div>
                          </div>
                          <div className="form-group">
                           <label className="control-label sr-only required" for="customer_registration_mobileNumber"> Mobile</label>
                           <div className="col-12 p-0 raw">
                            {/* <div className="col-3">
                               <input id="customer_registration_mobileCountryCode" name="mobilecountrycode" value={this.state.mobilecountrycode} onChange={this.handleChange} required="required" readonly="readonly" className="form-control input-lg" value="91" type="text"/>
                            </div> */}
                            <div className="col-12">
                               <input id="customer_registration_mobileNumber" name="mobile" onChange={this.handleChange} required="required" className="form-control input-lg" placeholder="Mobile" type="text"/>
                            </div>
                           </div>
                          </div>
                          <div className="form-group">
                           <div className="col-12">
                             <label className="control-label sr-only required" for="customer_registration_email">Email</label>
                             <input id="customer_registration_email" name="reg_email" onChange={this.handleChange} required="required" className="form-control input-lg" placeholder="Email" type="email"/>
                          </div>
                          </div>
                          <div className="form-group cst-group">
                          <label style={{padding: '14px',fontSize:'medium'}}>Note:- Password Strength with in 6 to 100 letters ,Must have letters , digits , not spaces and not one of these [Passw0rd, Password123]</label>
                           <div className="col-12 p-0 raw">
                            <div className="col-md-6">
                               <label className="control-label sr-only required" for="customer_registration_password_first">Password</label>
                               <input id="customer_registration_password_first" name="password" onChange={this.handleChange} required="required" className="form-control input-lg" placeholder="Password Must Have one upper case letter with symbols" autoComplete="off" type="password"/>
                            </div>
                            <div className="col-md-6">
                               <label className="control-label sr-only required" for="customer_registration_password_second"> Repeat password</label>
                               <input id="customer_registration_password_second" name="confirmedPassword" onChange={this.handleChange} required="required" className="form-control input-lg" placeholder="Repeat password" autoComplete="off" type="password"/>
                            </div>
                           </div>
                          </div>
                          <div className="form-group">
                          <div className="col-sm-12 auth-submit login_privacy">
                             <input id="customer_registration_termsAndConditionsAccepted" name="terms" onChange={this.handleChange} required="required" value="1" type="checkbox"/>
                             <label className="control-label required" for="customer_registration_termsAndConditionsAccepted">I have read and accepted the <a target="_blank" href="/contents/terms-and-conditions.htm">Terms and conditions</a> and <a target="_blank" href="/contents/privacy.htm">Privacy policy</a>
                             </label>
                          </div>
                          </div>
                          <div className="form-group">
                           <button type="submit" id="customer_registration_registration" name="customer_registration" onClick={this.Register} className="btn btn-primary btn-lg btn-block">Sign up</button>
                          </div>
                         </form>
                    </div>
                  </div>
                </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div id="emailModal" className="modal fade" tabindex="-1" role="dialog" aria-labelledby="contactModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 className="modal-title"><legend>Email Form</legend></h4>
                    </div>
                    <div className="modal-body">
                        <div className="containter">
                             <div className="row">
                             
							    <div className="col-md-12 col-md-offset-4">
                  {addedAlert}
							      <form className="form-horizontal" role="form" onSubmit={this.sendEmail} id="email_modal_form">
							        <fieldset>
							          <div className="form-group">
							            <label className="col-sm-4 control-label" for="textinput">Email to Employee</label>
							            <div className="col-sm-12">
							              <input type="text" placeholder="Recipient Email" value={this.state.eamils} onChange={this.handleChangeEmail} name="email_to" className="form-control" />
							            </div>
							          </div>
							          <div className="form-group">
							            <label className="col-sm-4 control-label" for="textinput">Subject</label>
							            <div className="col-sm-12">
							              <input type="text" placeholder="Subject" value={this.state.subject} onChange={this.handleChangeEmail} name="subject" className="form-control" />
							            </div>
							          </div>
							          <div className="form-group">
							            <label className="col-sm-4 control-label" for="textinput">Message</label>
							            <div className="col-sm-12">
							              <textarea type="text" placeholder="Enter Email Body" value={this.state.message} onChange={this.handleChangeEmail} name="message" className="form-control"></textarea>
							            </div>
							          </div>
							          <div className="form-group">
							            <div className="col-sm-offset-2 col-sm-10">
							              <div className="col-sm-12 pull-right">
							                <button type="submit" className="btn btn-default">Cancel</button>
							                <button type="submit" className="btn btn-primary">Send Email</button>
							              </div>
							            </div>
							          </div>
							        </fieldset>
							      </form>
							    </div>
							</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="modal fade" id="forgot_pwd" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                  <div className="col-md-12 col-md-offset-4">
                  {addedAlert}
                        <div className="panel panel-default">
                          <div className="panel-body">
                            <div className="text-center">
                                <h3><i className="fa fa-lock fa-4x"></i></h3>
                                <h2 className="text-center">Forgot Password?</h2>
                                <p>You can reset your password here.</p>
                                <div className="panel-body">
                                    <div className="form-group">
                                      <div className="input-group">
                                        <span className="input-group-addon"><i className="glyphicon glyphicon-envelope color-blue"></i></span>
                                        <input id="email" name="email" placeholder="email address" onChange={this.handleChange} className="form-control"  type="email" />
                                      </div>
                                    </div>
                                    <div className="form-group">
                                      <input name="recover-submit" className="btn btn-lg btn-primary btn-block" value="Reset Password" onClick={this.submitForgot} type="button" />
                                    </div>
                                </div>
                            </div>
                          </div>
                        </div>
                  </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
       </div>

       <div className="modal fade" id="reset_pwd_save" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                  <div className="col-md-12 col-md-offset-4">
                  {addedAlert}
                        <div className="panel panel-default">
                          <div className="panel-body">
                            <div className="text-center">
                                <h3><i className="fa fa-lock fa-4x"></i></h3>
                                <h2 className="text-center">Reset Password?</h2>
                                <p>You can reset your password here.</p>
                                <div className="panel-body">
                                    <div className="form-group">
                                      <div className="input-group">
                                        <span className="input-group-addon"><i className="glyphicon glyphicon-envelope color-blue"></i></span>
                                        <input id="email" name="password" placeholder="Enter Password" onChange={this.handleChange} className="form-control"  type="password" />
                                      </div>
                                    </div>
                                    <div className="form-group">
                                      <div className="input-group">
                                        <span className="input-group-addon"><i className="glyphicon glyphicon-envelope color-blue"></i></span>
                                        <input id="email" name="confirmedPassword" placeholder="Enter Confirm Password" onChange={this.handleChange} className="form-control"  type="password" />
                                      </div>
                                    </div>
                                    <div className="form-group">
                                      <input name="recover-submit" className="btn btn-lg btn-primary btn-block" value="Save" onClick={this.submitForgot} type="button" />
                                    </div>
                                </div>
                            </div>
                          </div>
                        </div>
                  </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
       </div>
        </div>
    );
  }
}
