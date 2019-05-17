import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import './Dashboard.css';
import axios from 'src/common/myAxios';
import history from '../history';
var NavLink = require('react-router-dom').NavLink;
import {connect} from 'react-redux';


@connect((store) => {
  return {
      docs: store.docs,
      user: store.user,
  };
})

class Template extends Component {
  static propTypes = {
      dispatch: PropTypes.func,
      docs: PropTypes.object,
      user: PropTypes.object,
  };

  constructor(props) {
    super(props);
  //  console.log(tab);debugger;
    this.state = {
      page:'Dashboard',
      redirect: false,
      docs:[],
      data:[],
      tab:null,
      templates:[]
    };
    localStorage.setItem("files_array", [])
    this.onChange = this.onChange.bind(this);
    // this.props.dispatch(auth.actions.getDocs(localStorage.getItem('jwtToken')));
    this.getTemplates();
  }

  getBase64 = (file) => {
    // this.setState({ file_name: file.name});
    localStorage.setItem('template_name', file.name);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  templateUpload = (e) => {
    var loader = document.getElementById('outer-barG');
    $(loader).css('display','block');
    const file = e.target.files[0];
    this.getBase64(file).then(base64 => {
      axios.post('/api/add_template/', {
        base64Data: base64, token: localStorage.getItem('jwtToken'), file_name: localStorage.getItem('template_name')}).then((res) => {
        this.getTemplates();
        $('#outer-barG').css('display','none');
        // this.setState({
        //   templates: res.data
        // });
        // this.setState({
        //   docs: res.data
        // });
      }).catch(error => {
        console.log(error.response);
      });
    });
  }
  // token:localStorage.getItem('jwtToken')
  getTemplates=(e)=>{
    axios.get('/api/get_templates/',{token:localStorage.getItem('jwtToken')}).then((res) => {
      this.setState({
        templates: res.data
      });
    }).catch(error => {
      console.log(error.response);
    });
  }

  appendId = (e) => {
    $('#emailModal').modal('show');
    if(!$('#doc_id').hasClass('hidden_doc')){
      $('#email_modal_form').append('<input type="hidden" value="'+e.target.id+'" class="hidden_doc" id="doc_id"/>');
    }else{
      $('#doc_id').val(e.target.id);
    }
  }

  openTemplate = (id,e) => {
    e.preventDefault();
    $('#outer-barG').css('display','block');
    axios.post('/api/open_template/',{id:id,token:localStorage.getItem('jwtToken')}).then((res) => {
        this.setState({
           redirect: 'signature?temp='+res.data._id
        });
    });
  }

  deleteTemplate = (id,e) => {
    e.preventDefault();
    swal({
      title: "Do You Want to delete it from your account?",
      text: "Are you sure that you want to delete ?",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    })
    .then(willdel => {
      if (willdel) {
        axios.delete('/api/template/'+id).then((res) => {
          this.getTemplates();
          swal("Deleted!", "Your template file has been deleted", "success");
        }).catch(error => {
          swal("Error!", "Something Went wrong", "danger");
        }); 
      }
    }); 
  }

  onChange(e){
    this.setState({[e.target.name]:e.target.value});
   }

  render() { console.log(this.state.templates)
    // const {docs} = this.props;
    // console.log(this.props);
    if (!localStorage.getItem('jwtToken')) {
      return <Redirect to='/'  />
    }
    if (this.state.redirect) {
      return (<Redirect to={this.state.redirect}/>)
    }
      return (
        <div>
          <header>
           <nav className="navbar navbar-expand-lg navbar-light custom-navheader navbar-fixed header-template" id="sroll-className">
        <div className="container-fluid">
          <a className="navbar-brand d-lg-block d-md-block" href="#"><img src="/assets/img/fina-logo.png" alt=""/></a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse navigation-bar3" id="navbarCollapse">
            <ul className="navbar-nav ml-auto custom-navi">
                      <li className="dropdown messages-menu">
            </li>
              <li className="dropdown user user-menu">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                  <i className="fa fa-user"></i>
                  
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <NavLink to='/logout' className="btn btn-default btn-flat"><i className="fa fa-sign-out"></i>Logout</NavLink>
                  </li>
                </ul>
                </li>
            </ul>
          </div>
        </div>
           </nav>
        </header>
        <div className="container-fluid main-wrapper">
        <aside className="main-sidebar">
          <div className="user-panel">
            <div className="pull-left image">
              <img src="/assets/img/user2.jpg" className="img-circle" alt="User Image"/>
            </div>
            <div className="pull-left info">
              <p>DIGISIGN <span className="small">Founder of App</span></p>
            </div>
           </div>
           <ul className="sidebar-menu tree" data-widget="tree">
            <li><NavLink activeClassName='active' to='/dashboard'><i className="fa fa-dashboard"></i> <span>Documents</span></NavLink></li>
            <li><NavLink activeClassName='active' to='/templates'><i className="fa fa-rebel"></i> <span>Templates</span></NavLink></li>
            <li><NavLink activeClassName='active' to='/logout'><i className="fa fa-sign-out"></i> <span>Logout</span></NavLink></li>
           </ul>
        </aside>
        <div className="right-maintemplate admin-right">
          <div className="page container-fluid">
            <div className="col-sm-6"><h3 className="text-uppercase">Templates</h3></div>
            <div class="upload-btn-wrapper">
                <button class="btn upload_btn">Upload a template</button>
                <input type="file" name="myfile" id="hidden_upload_file" onChange={this.templateUpload} />
            </div>
            {/* <div className="col-sm-6 upload_docs" style={{float: 'right',width: '100%',textAlign: 'right'}}><input type="file" id="hidden_upload_file" onChange={this.templateUpload}  /><i className="fa fa-upload"></i></div> */}
            <div className="box-body">
              <div className="col-sm-12">
                <div className="card box-spice">
                  <div className="card-body">
                    <ol className="od-list">
                          {this.state.templates.map((value, index) => {
                    let img = "/assets/img/doc-1.png";
                    if(value.type == 'pdf'){
                      img = "/assets/img/pdf.png";
                    }
                    else if (value.type == 'msword' || value.type == 'doc'){
                        img = "/assets/img/doc-1.png";
                    }else if (value.type == 'docx') {
                      img = "/assets/img/doc-1.png";
                    }else{
                      img = "/files/docs/"+value.name;
                    }
                      
                    return (<li key={index}>
                                <ul className="list-inline top-box-list">
                                  <li><input type="checkbox"/><span></span></li>
                                  <li className="doc-box">
                                      <a href="javascript:void(0)">
                                        <div className="fig-left">
                                        <img src={img} alt="No Thumb" className="doc-pic"/>
                                        {/* <embed src={img} width="140px" className="doc-pic" /> */}
                                        </div>
                                        <div className="doc-info">
                                <p>{value.name}<span className="date-doc small">{value.created_at}</span></p>
                                        </div>
                                      </a>
                                 </li>
                                 <li><button type="button" className="btn btn-success" onClick={this.openTemplate.bind(this, value._id)}>Open</button></li>
                                 <li><button type="button" className="btn btn-success">Invite Signers</button></li>
                                 <li className="delete-row"><a className="fa fa-trash danger" onClick={this.deleteTemplate.bind(this, value._id)} href="javascript:void(0)"></a></li>
                                </ul>
                        </li>)
                    })}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      );
  }
}

export default Template;
