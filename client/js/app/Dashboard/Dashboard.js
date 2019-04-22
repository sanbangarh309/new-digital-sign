import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import './Dashboard.css';
import axios from 'src/common/myAxios';
import history from '../history';
var NavLink = require('react-router-dom').NavLink;
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
      docs: store.docs,
      user: store.user,
  };
})

class Dashboard extends Component {
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
    this.getDocs();
    this.getTemplates();
  }

  docUpload = (e) => {
    var loader = document.getElementById('outer-barG');
    $(loader).css('display','block');
    const file = e.target.files[0];
    getBase64(file).then(base64 => {
      this.setState({doc:base64});
      localStorage.setItem('uploaded_doc', base64);
      this.setState({
        redirect: 'signature'
      });
    });
  }

  templateUpload = (e) => {
    var loader = document.getElementById('outer-barG');
    $(loader).css('display','block');
    const file = e.target.files[0];
    getBase64(file).then(base64 => {
      axios.post('/api/add_template/',{base64Data:base64,token:localStorage.getItem('jwtToken')}).then((res) => {
        console.log(res.data)
        // this.setState({
        //   docs: res.data
        // });
      }).catch(error => {
        console.log(error.response);
      });
    });
  }

  getDocs = (e) => {
    axios.post('/api/get_docs/',{token:localStorage.getItem('jwtToken')}).then((res) => {
      this.setState({
        docs: res.data
      });
    }).catch(error => {
      console.log(error.response);
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

  deleteDoc = (id,e) => {
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
        axios.delete('/api/doc/'+id).then((res) => {
          this.getDocs();
          swal("Deleted!", "Your doc file has been deleted", "success");
        }).catch(error => {
          swal("Error!", "Something Went wrong", "danger");
        }); 
      }
    }); 
  }

  onChange(e){
    this.setState({[e.target.name]:e.target.value});
   }

  render() {
    // const {docs} = this.props;
    // console.log(this.props);
    if (!localStorage.getItem('jwtToken')) {
      return <Redirect to='/'  />
    }
    if (this.state.redirect) {
      return (<Redirect to={this.state.redirect}/>)
    }
    let url_params = history.location.pathname.split('/');console.log(url_params);
    let tab = url_params[url_params.length-1];
    console.log(tab);
    // if(tab = 'templates'){ 
      // return (
      //   <div>
      //     <header>
      //      <nav className="navbar navbar-expand-lg navbar-light custom-navheader navbar-fixed header-template" id="sroll-className">
      //   <div className="container-fluid">
      //     <a className="navbar-brand d-lg-block d-md-block" href="#"><img src="/assets/img/fina-logo.png" alt=""/></a>
      //     <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
      //       <span className="navbar-toggler-icon"></span>
      //     </button>
      //     <div className="collapse navbar-collapse navigation-bar3" id="navbarCollapse">
      //       <ul className="navbar-nav ml-auto custom-navi">
      //                 <li className="dropdown messages-menu">
      //       </li>
      //         <li className="dropdown user user-menu">
      //           <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
      //             <i className="fa fa-user"></i>
                  
      //           </a>
      //           <ul className="dropdown-menu">
      //             <li>
      //               <NavLink to='/logout' className="btn btn-default btn-flat"><i className="fa fa-sign-out"></i>Logout</NavLink>
      //             </li>
      //           </ul>
      //           </li>
      //       </ul>
      //     </div>
      //   </div>
      //      </nav>
      //   </header>
      //   <div className="container-fluid main-wrapper">
      //   <aside className="main-sidebar">
      //     <div className="user-panel">
      //       <div className="pull-left image">
      //         <img src="/assets/img/user2.jpg" className="img-circle" alt="User Image"/>
      //       </div>
      //       <div className="pull-left info">
      //         <p>DIGISIGN <span className="small">Founder of App</span></p>
      //       </div>
      //      </div>
      //      <ul className="sidebar-menu tree" data-widget="tree">
      //       <li><NavLink activeClassName='active' to='/dashboard'><i className="fa fa-dashboard"></i> <span>Documentation</span></NavLink></li>
      //       <li><NavLink activeClassName='active' to='/templates'><i className="fa fa-rebel"></i> <span>Templates</span></NavLink></li>
      //       <li><NavLink activeClassName='active' to='/logout'><i className="fa fa-sign-out"></i> <span>Logout</span></NavLink></li>
      //      </ul>
      //   </aside>
      //   <div className="right-maintemplate admin-right">
      //     <div className="page container-fluid">
      //       <div className="col-sm-6"><h3 className="text-uppercase">Templates</h3></div>
      //       <div className="col-sm-6 upload_docs" style={{float: 'right',width: '100%',textAlign: 'right'}}><input type="file" id="hidden_upload_file" onChange={this.templateUpload}  /><i className="fa fa-upload"></i></div>
      //       <div className="box-body">
      //         <div className="col-sm-12">
      //           <div className="card box-spice">
      //             <div className="card-body">
      //               <ol className="od-list">
      //               {this.state.templates.map((value, index) => {
      //                 let img = "/files/docs/"+value.name || "/assets/img/doc-1.png";
      //                 return (<li key={index}>
      //                            <ul className="list-inline top-box-list">
      //                               <li><input type="checkbox"/><span></span></li>
      //                               <li className="doc-box">
      //                                 <a href="javascript:void(0)">
      //                                   <div className="fig-left">
      //                                   <embed src={img} width="140px" className="doc-pic" />
      //                                   </div>
      //                                 </a>
      //                               </li>
      //                               <li className="delete-row"><a className="fa fa-trash danger" onClick={this.deleteDoc.bind(this, value._id)} href="javascript:void(0)"></a></li>
      //                           </ul>
      //                       </li>)
      //               })}
      //               </ol>
      //             </div>
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      // </div>
      // </div>
      // );
    // }else{
      return (
        <div className="dash_board">
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
            {/* <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
              <i className="fa fa-envelope-o"></i>
              <span className="label label-success">4</span>
            </a>
            <ul className="dropdown-menu">
              <li className="header">You have 4 messages</li>
              <li>
              <ul className="menu">
                <li>
                <a href="#">
                  <div className="pull-left">
                  <img src="/assets/img/user2.jpg" className="img-circle" alt="User Image"/>
                  </div>
                  <h4>
                  Support Team
                  <small><i className="fa fa-clock-o"></i> 5 mins</small>
                  </h4>
                  <p>Why not buy a new awesome theme?</p>
                </a>
                </li>
                <li>
                <a href="#">
                  <div className="pull-left">
                  <img src="/assets/img/user2.jpg" className="img-circle" alt="User Image"/>
                  </div>
                  <h4>
                  AdminLTE Design Team
                  <small><i className="fa fa-clock-o"></i> 2 hours</small>
                  </h4>
                  <p>Why not buy a new awesome theme?</p>
                </a>
                </li>
                <li>
                <a href="#">
                  <div className="pull-left">
                  <img src="/assets/img/user2.jpg" className="img-circle" alt="User Image"/>
                  </div>
                  <h4>
                  Developers
                  <small><i className="fa fa-clock-o"></i> Today</small>
                  </h4>
                  <p>Why not buy a new awesome theme?</p>
                </a>
                </li>
                <li>
                <a href="#">
                  <div className="pull-left">
                  <img src="/assets/img/user2.jpg" className="img-circle" alt="User Image"/>
                  </div>
                  <h4>
                  Sales Department
                  <small><i className="fa fa-clock-o"></i> Yesterday</small>
                  </h4>
                  <p>Why not buy a new awesome theme?</p>
                </a>
                </li>
                <li>
                <a href="#">
                  <div className="pull-left">
                  <img src="/assets/img/user2.jpg" className="img-circle" alt="User Image"/>
                  </div>
                  <h4>
                  Reviewers
                  <small><i className="fa fa-clock-o"></i> 2 days</small>
                  </h4>
                  <p>Why not buy a new awesome theme?</p>
                </a>
                </li>
              </ul>
              </li>
              <li className="footer"><a href="#">See All Messages</a></li>
            </ul> */}
            </li>
              <li className="dropdown user user-menu">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                  <i className="fa fa-user"></i>
                  
                </a>
                <ul className="dropdown-menu">
                  {/* <li>
                    <a href="javascript:void(0)" className="btn btn-default btn-flat"><i className="fa fa-user"></i> My Profile</a>
                  </li>
                  <li>
                    <a href="javascript:void(0)" className="btn btn-default btn-flat"><i className="fa fa-globe"></i> Feedback</a>
                  </li> */}
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
            <li><NavLink activeClassName='active' to='/dashboard'><i className="fa fa-dashboard"></i> <span>Documentation</span></NavLink></li>
            <li><NavLink activeClassName='active' to='/templates'><i className="fa fa-rebel"></i> <span>Templates</span></NavLink></li>
            <li><NavLink activeClassName='active' to='/logout'><i className="fa fa-sign-out"></i> <span>Logout</span></NavLink></li>
           </ul>
        </aside>
        <div className="right-maintemplate admin-right">
          <div className="page container-fluid">
            <div className="col-sm-6"><h3 className="text-uppercase">Documents</h3></div>
            <div className="box-body">
              <div className="col-sm-12">
                <div className="card box-spice">
                  <div className="card-header">
                    <ul className="list-inline top-box-list">
                      <li><input type="checkbox"/><span></span></li>
                      <li><a href="javascript:void(0)">NEW</a></li>
                      <li><a href="javascript:void(0)">FOLDER SEND </a></li>
                      <li><a href="javascript:void(0)">FOR SIGNING</a></li>
                      <li><a href="javascript:void(0)">Move to</a></li>
                      <li className="delete-row"><a className="fa fa-trash danger" href="javascript:void(0)"></a></li>
                      <li className="search-row">
                        <form id="example1_filter" className="dataTables_filter">
                          <label className="filter_search">
                            <input type="search" className="form-control input-sm" placeholder="Search..." aria-controls="example1"/>
                            <button className="btn search--btn"><i className="fa fa-search"></i></button>
                          </label>
                        </form>
                      </li>
                      <li className="upload_docs"><input type="file" id="hidden_upload_file" onChange={this.docUpload}  /><i className="fa fa-upload"></i></li>
                      <li><a href="#"><i className="fa fa-filter"></i></a></li>
                    </ul>
                  </div>
                  <div className="card-body">
                    <ol className="od-list">
                    {this.state.docs.map((value, index) => {
                      let img = "/files/docs/"+value.images[0].name || "/assets/img/doc-1.png";
                      return (<li key={index}>
                                 <ul className="list-inline top-box-list">
                                    <li><input type="checkbox"/><span></span></li>
                                    <li className="doc-box">
                                      <a href="#">
                                        <div className="fig-left">
                                          <img src={img} alt="No Thumb" className="doc-pic"/>
                                        </div>
                                        <div className="doc-info">
                                          <p>Document<span className="date-doc small">{value.created_at}</span></p>
                                        </div>
                                      </a>
                                    </li>
                                    <li><a href="#">SIGN </a></li>
                                    {/* data-toggle="modal" data-target="#emailModal" */}
                                    <li><a href="javascript:void(0)" id={value._id} onClick={this.appendId}>SEND FOR SIGNING </a></li>
                                    <li><NavLink to={'signature/'+value._id} className="btn btn-default btn-flat"><i className="fa fa-edit"></i></NavLink></li>
                                    <li><a href="#"><i className="fa fa-share"></i></a></li>
                                    <li><a href={'files/docs/'+value.file} target="_blank"><i className="fa fa-download"></i></a></li>
                                    <li className="delete-row"><a className="fa fa-trash danger" onClick={this.deleteDoc.bind(this, value._id)} href="javascript:void(0)"></a></li>
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
    // }
  }
}

export default Dashboard;
