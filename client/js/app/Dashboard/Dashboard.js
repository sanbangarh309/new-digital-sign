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
      templates:[],
      folders:[],
      folder:null,
      old_folder:null,
      disabled_fields:{pointerEvents:'none',color:'#c9c2c2'},
      checked_values:[],
      move_to:null
    };
    localStorage.setItem("files_array", [])
    this.onChange = this.onChange.bind(this);
    // this.props.dispatch(auth.actions.getDocs(localStorage.getItem('jwtToken')));
    this.getFolders();
    this.getDocs();
  }

  componentDidMount(){
    setTimeout(() => {
      var toggler = document.getElementsByClassName("caret");
      var i;
      for (i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function() {
          // this.parentElement.classList.toggle("active");
          // if($(this.parentElement).hasClass('nested')){
          //   this.parentElement.querySelector(".nested").classList.toggle("active");
          //   this.classList.toggle("caret-down");
          // }
        });
      }
    }, 1000);
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

  getFolders = (e) => {
    axios.post('/api/get_folders/',{token:localStorage.getItem('jwtToken')}).then((res) => {
      this.setState({
        folders: res.data
      });
    }).catch(error => {
      console.log(error.response);
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

  deleteFolder = (folder,e) => {
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
        axios.delete('/api/folder/'+folder).then((res) => {
          this.getFolders();
          swal("Deleted!", "Your folder has been deleted", "success");
        }).catch(error => {
          swal("Error!", "Something Went wrong", "danger");
        }); 
      }
    });
  }

  createFolder = (e) => {
    e.preventDefault();
    $('#create_folder').modal('show');
  }

  saveFolder = (e) => {
    e.preventDefault();
    if(this.state.folder){
      axios.post('/api/createfolder',{folder:this.state.folder}).then((res) => {
        this.getFolders();
        setTimeout(() => $('#create_folder').modal('hide'), 500)
      }).catch(error => {
       
      });
    }
  }

  showRenamePop = (folder,e) => {
    e.preventDefault();
    this.setState({old_folder:folder});
    $('#rename_folder').modal('show');
  }


  renameFolder = (e) => {
    if(this.state.folder && this.state.old_folder){
      axios.put('/api/folder',{folder:this.state.folder,old_folder:this.state.old_folder}).then((res) => {
        this.getFolders();
        setTimeout(() => $('#rename_folder').modal('hide'), 500)
      }).catch(error => {
       
      });
    }
  }

  saveAction = (e) => {
    // e.preventDefault();
    let new_arr = [];
    if(e.target.checked){
      new_arr.push(e.target.value);
      let unique = [...new Set(new_arr)];
      this.setState({checked_values:unique});
    }else{
      new_arr = new_arr.filter(function(ele){
          return ele != e.target.value;
      });
    }
    if(new_arr.length > 0){
      this.setState({disabled_fields:{}});
    }else{
      this.setState({disabled_fields:{pointerEvents:'none',color:'#c9c2c2'}});
    }
  }

  folderStructure = (e) => {
    e.preventDefault();
    $('#folder_structure').modal('show');
  }

  selectFolder = (folder,e) => {
    // e.preventDefault();
    $('#myUL li').removeClass('activeClass');
    $('#myUL li span').removeClass('activeClass');
    if(e.target.tagName == 'SPAN'){
      $(e.target.parentElement).addClass("activeClass");  
    }else{
      $(e.target).addClass("activeClass");
    }
    this.setState({move_to:folder});
    
  }

  moveDoc = (e) => {
    console.log(this.state.move_to);
    console.log(this.state.checked_values)
    if(this.state.move_to && this.state.checked_values.length > 0){
      axios.post('/api/movefile',{move_to:this.state.move_to,docs:this.state.checked_values}).then((res) => {
        this.getFolders();
        setTimeout(() => $('#folder_structure').modal('hide'), 500)
      }).catch(error => {
       
      });
    }
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
                      <li><a href="javascript:void(0)" onClick={this.createFolder}>NEW FOLDER</a></li>
                      {/* <li><a href="javascript:void(0)">FOLDER SEND </a></li> */}
                      <li><a href="javascript:void(0)" style={this.state.disabled_fields}>SEND FOR SIGNING</a></li>
                      <li><a href="javascript:void(0)" onClick={this.folderStructure} style={this.state.disabled_fields}>MOVE TO</a></li>
                      <li className="delete-row"><a className="fa fa-trash danger" href="javascript:void(0)"></a></li>
                      {/* <li className="search-row">
                        <form id="example1_filter" className="dataTables_filter">
                          <label className="filter_search">
                            <input type="search" className="form-control input-sm" placeholder="Search..." aria-controls="example1"/>
                            <button className="btn search--btn"><i className="fa fa-search"></i></button>
                          </label>
                        </form>
                      </li> */}
                      <li className="upload_docs"><input type="file" id="hidden_upload_file" onChange={this.docUpload}  /><i className="fa fa-upload"></i></li>
                      <li><a href="#"><i className="fa fa-filter"></i></a></li>
                    </ul>
                  </div>
                  <div className="card-body">
                    <ol className="od-list">
                    {this.state.folders.map((value, index) => {
                      let img = "/assets/img/folder.jpg";
                      let folder = value.substr(value.lastIndexOf('/') + 1);
                      return (<li key={index}>
                                 <ul className="list-inline top-box-list">
                                    <li><input type="checkbox" value={folder} /><span></span></li>
                                    <li className="doc-box">
                                      <a href="#">
                                        <div className="fig-left">
                                          <img src={img} alt="No Thumb" className="doc-pic"/>
                                        </div>
                                        <div className="doc-info">
                                          <p><span className="date-doc small">{folder}</span></p>
                                        </div>
                                      </a>
                                    </li>
                                    <li><NavLink to={'signature/'+folder} className="btn btn-default btn-flat">Open</NavLink></li>
                                    <li>
                                    <div class="dropdown">
                                      <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">More
                                      <span class="caret"></span></button>
                                      <ul class="dropdown-menu">
                                        <li><a onClick={this.deleteFolder.bind(this, folder)} href="javascript:void(0)">Delete</a></li>
                                        <li><a onClick={this.showRenamePop.bind(this, folder)} href="javascript:void(0)">Rename</a></li>
                                      </ul>
                                    </div>
                                    </li>
                                 </ul>
                            </li>)
                    })}
                    </ol>
                  </div>
                  <div className="card-body">
                    <ol className="od-list">
                    {this.state.docs.map((value, index) => {
                      let img = "/files/docs/"+value.images[0].name || "/assets/img/doc-1.png";
                      return (<li key={index}>
                                 <ul className="list-inline top-box-list">
                                    <li><input onClick={this.saveAction} type="checkbox" value={value._id} /><span></span></li>
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
                                    <li><NavLink to={'signature/'+value._id} className="btn btn-default btn-flat">SIGN</NavLink></li>
                                    {/* data-toggle="modal" data-target="#emailModal" */}
                                    <li><a href="javascript:void(0)" id={value._id} onClick={this.appendId}>SEND FOR SIGNING </a></li>
                                    <li><NavLink to={'signature/'+value._id} className="btn btn-default btn-flat"><i className="fa fa-edit"></i></NavLink></li>
                                    {/* <li><a href="#"><i className="fa fa-share"></i></a></li> */}
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

      <div className="modal fade" id="create_folder" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                  <div className="col-md-12 col-md-offset-4">
                        <div className="panel panel-default">
                          <div className="panel-body">
                            <div className="text-center">
                                <h3><i className="fa fa-lock fa-4x"></i></h3>
                                <h2 className="text-center">Create Folder</h2>
                                <div className="panel-body">
                                    <div className="form-group">
                                      <div className="input-group">
                                        <span className="input-group-addon"><i className="glyphicon glyphicon-envelope color-blue"></i></span>
                                        <input id="folder" name="folder" placeholder="Enter Folder Name" onChange={this.onChange} className="form-control"  type="text" />
                                      </div>
                                    </div>
                                    <div className="form-group">
                                      <input name="recover-submit" className="btn btn-lg btn-primary btn-block" value="Save" onClick={this.saveFolder} type="button" />
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

       <div className="modal fade" id="rename_folder" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                  <div className="col-md-12 col-md-offset-4">
                        <div className="panel panel-default">
                          <div className="panel-body">
                            <div className="text-center">
                                <h3><i className="fa fa-lock fa-2x"></i></h3>
                                <h2 className="text-center">Rename Folder</h2>
                                <div className="panel-body">
                                    <div className="form-group">
                                      <div className="input-group">
                                        <span className="input-group-addon"><i className="glyphicon glyphicon-envelope color-blue"></i></span>
                                        <input id="folder" name="folder" placeholder="Enter New Folder Name" onChange={this.onChange} className="form-control"  type="text" />
                                      </div>
                                    </div>
                                    <div className="form-group">
                                      <input name="recover-submit" className="btn btn-lg btn-primary btn-block" value="Save" onClick={this.renameFolder} type="button" />
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

       <div className="modal fade" id="folder_structure" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                  <div className="col-md-12 col-md-offset-4">
                        <div className="panel panel-default">
                          <div className="panel-body">
                                <h2 className="text-center">Select Folder</h2>
                                <div className="panel-body">
                                    <div className="form-group">
                                      <div className="input-group">
                                      <ul id="myUL">
                                      {this.state.folders.map((value, index) => {
                                        let folder = value.substr(value.lastIndexOf('/') + 1);
                                        return (<li onClick={this.selectFolder.bind(this, folder)}><span class="caret">{folder}</span>
                                        {/* <ul class="nested">
                                          <li>Water</li>
                                          <li>Coffee</li>
                                          <li><span class="caret">Tea</span>
                                            <ul class="nested">
                                              <li>Black Tea</li>
                                              <li>White Tea</li>
                                              <li><span class="caret">Green Tea</span>
                                                <ul class="nested">
                                                  <li>Sencha</li>
                                                  <li>Gyokuro</li>
                                                  <li>Matcha</li>
                                                  <li>Pi Lo Chun</li>
                                                </ul>
                                              </li>
                                            </ul>
                                          </li>  
                                        </ul> */}
                                      </li>);
                                      })}
                                      </ul>
                                      </div>
                                    </div>
                                    <div className="form-group">
                                      <input name="recover-submit" className="btn btn-lg btn-primary btn-block" value="Move" onClick={this.moveDoc} type="button" />
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

export default Dashboard;
