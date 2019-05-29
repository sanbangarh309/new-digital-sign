import React, {Component} from 'react';
import './Contact.css';
import axios from 'src/common/myAxios';

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page:'Contact',
      data:[]
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(e){
    this.setState({[e.target.name]:e.target.value});
  }

removeByKey = (myObj, deleteKey) => {
  return Object.keys(myObj)
    .filter(key => key !== deleteKey)
    .reduce((result, current) => {
      result[current] = myObj[current];
      return result;
    }, {});
}

  saveContact = (e) => {
    e.preventDefault();
    $('#outer-barG').show();
    axios.post('/api/add_guest', this.state).then((res) => {
      $('#outer-barG').hide();
      ['name','email','phone','message'].map((val)=>{
        $('form input[name="'+val+'"]').val('');
        this.setState({ [val]:null});
      });
      $('form textarea[name="message"]').val('');
      swal("Mail Sent", "We Will Contact You Soon.", "success");
    }).catch(error => {
      swal("Error!", error.response.data.error, "error");
    });
    
  }

  render() {
    var backstyle = {
        backgroundImage: 'url(/assets/img/contact-bg.png)'
    }
    return (
      <div>
      <div className="page-main">
<div className="content-inner contact-page myParallax" data-speed="0.5" style={backstyle}>
  <div className="overlay-img"></div>
  <div className="container">
    <div className="col-md-10 offset-md-1">
      <h2 className="section-title-head text-center text-uppercase"><strong>Don't hesitate to contact us</strong></h2>
      <h3 className="section-subtitle text-center">Drop a Line and contact forms without any server-side integration.</h3>
    </div>
  </div>
  <div className="container contact--form">
    <form className="mbr-form" action="#" method="post">
      <div className="row row-sm-offset">
        <div className="col-md-4" data-for="name">
          <div className="form-group">
            <label className="control-label" for="name-form1-2w">Name</label>
              <input type="text" className="form-control" name="name" onChange={this.onChange} required="" id="name-form"/>
          </div>
        </div>
        <div className="col-md-4" data-for="email">
          <div className="form-group">
            <label className="control-label" for="email-form1-2w">Email</label>
                      <input type="email" className="form-control" name="email" onChange={this.onChange} required="required" id="email-form"/>
          </div>
        </div>
        <div className="col-md-4" data-for="phone">
          <div className="form-group">
            <label className="control-label" for="phone-form1-2w">Phone</label>
              <input type="tel" className="form-control" name="phone" onChange={this.onChange}  id="phone-form"/>
          </div>
        </div>
      </div>
      <div className="form-group" data-for="message">
        <label className="control-label" for="message-form1-2w">Message</label>
          <textarea type="text" className="form-control" name="message" onChange={this.onChange} rows="7" id=""></textarea>
      </div>
      <div className="form-group text-center">
        <button type="button" onClick={this.saveContact.bind(this)} className="btn btn-primary btn-form display-4 text-uppercase">Send Message</button>
      </div>
    </form>
  </div>
</div>
</div>
<div className="back-top" title="Top of Page"><i className="fa fa-arrow-up"></i></div>
      </div>
    );
  }
}

export default Contact;
