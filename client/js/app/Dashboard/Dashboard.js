import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import './Dashboard.css';
import axios from 'src/common/myAxios';
var NavLink = require('react-router-dom').NavLink;
import {connect} from 'react-redux';
// import auth from 'src/auth';

@connect((store) => {
  return {
      docs: store.docs,
      user: store.user,
  };
})

class Dashboard extends Component {
  static propTypes = {
      dispatch: PropTypes.func,
      docs: PropTypes.array,
      user: PropTypes.object,
  };

  constructor(props) {
    super(props);
  //  console.log(tab);debugger;
    this.state = {
      added: false,
      msg: '',
      alert: '',
      page:'Dashboard',
      redirect: false,
      docs:[],
      data:[],
      tab:null,
      templates:[],
      folders:[],
      folder:null,
      folder_id:null,
      doc_id: null,
      disabled_fields:{pointerEvents:'none',color:'#c9c2c2'},
      checked_values:[],
      move_to:null,
      folder_data:[],
      email_to:'',
      subject:'',
      message:'',
      drag:null,
      signers:[],
      current_doc:null,
      currentPage:1,
      current_pages:null,
      lastDate:null,
      total_pages:0,
      pageLimit: 4,
      invitation_list:[]
    };
    localStorage.setItem("files_array", [])
    this.onChange = this.onChange.bind(this);
    // this.props.dispatch(auth.actions.getDocs(localStorage.getItem('jwtToken')));
    this.getFolders();
    this.getDocs();
    // connect(this.mapStateToProps.bind(this));
  }

  mapStateToProps(state) {
    const { docs } = this.state
    return { docs: docs }
  }

  getBase64 = (file) => {
    // this.setState({ file_name: file.name});
    localStorage.setItem('file_name', file.name);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
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
      if (this.state.docs.length > 0) {
        let ids = {};
        // Object.keys(docs).forEach(function (head) {
        //   Object.keys(docs[head].images).forEach(function (key) {
        //     ids[docs[head]._id] = [];
        //     console.log(docs[head].images);
            
        //     Object.keys(docs[head].images[key].drag_data).forEach(function (key2) {
        //       // && !ids[docs[head]._id].includes(docs[head].images[key].drag_data[key2].signer_id)
        //       if (docs[head].images[key].drag_data[key2].type == "signer_added") {
        //         ids[docs[head]._id].push(docs[head].images[key].drag_data[key2].signer_id);
        //         // ids[docs[head]._id] = docs[head].images[key].drag_data[key2].signer_id;
        //         // ids.push({ docid: docs[head]._id, signer_id: docs[head].images[key].drag_data[key2].signer_id});
        //         // if (docs[head].images[key].drag_data[key2].signer_id == objThis.state.doc_for_sign) {
        //         //   fillabel[docs[head].images[key].drag_data[key2].id] = { id: docs[head].images[key].drag_data[key2].id, signer_id: docs[head].images[key].drag_data[key2].signer_id, type: docs[head].images[key].drag_data[key2].type, content: docs[head].images[key].drag_data[key2].content, sign: false }
        //         // }
        //       }
        //     });
        //   });
        // });
        // this.getSigners([...new Set(ids)]);
        console.log(ids)
      } 
    }, 2000);
  }

  getSigners  = (ids) => {
    axios.post('/api/signers/',{ids:ids,token:localStorage.getItem('jwtToken')}).then((res) => {
      this.setState({
        signers: res.data
      });
     
    }).catch(error => {
      console.log(error.response);
    });
  }

  getSignersWithDoc = (data) => {
    axios.post('/api/signerswithdoc/', { signDoc: data, token: localStorage.getItem('jwtToken') }).then((res) => {
      this.setState({
        invitation_list: res.data.msg
      });
      console.log(res.data.msg);
    }).catch(error => {
      console.log(error.response);
    });
  }

  docUpload = (e) => {
    $('#outer-barG').show();
    const file = e.target.files[0];
    this.getBase64(file).then(base64 => {
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

  getDocs = (e, page) => {
    $('#outer-barG').show();
    axios.post('/api/get_docs/', { token: localStorage.getItem('jwtToken'), page: page ? page : this.state.currentPage, pageLimit: this.state.pageLimit}).then((res) => {
      this.setState({
        docs: res.data.docs
      });
      this.setState({
        current_pages: res.data.page
      });
      this.setState({
        total_pages: res.data.total_pages
      });
      let ids = {};
      let docs = res.data.docs;
      Object.keys(docs).forEach(function (head) {
        Object.keys(docs[head].images).forEach(function (key) {
          ids[docs[head]._id] = [];
          Object.keys(docs[head].images[key].drag_data).forEach(function (key2) {
            console.log(docs[head].images[key].drag_data[key2])
            if (docs[head].images[key].drag_data[key2].type == "signer_added" && !ids[docs[head]._id].includes(docs[head].images[key].drag_data[key2].signer_id)) {
              ids[docs[head]._id].push(docs[head].images[key].drag_data[key2].signer_id);
            } else if (docs[head].images[key].drag_data[key2].completed && !ids[docs[head]._id].includes(docs[head].images[key].drag_data[key2].signer_id)) {
              ids[docs[head]._id].push(docs[head].images[key].drag_data[key2].signer_id);
            }
          });
        });
      });
      console.log(ids)
      this.getSignersWithDoc(ids);
      // this.setState({
      //   lastDate: res.data.lastDate
      // });
      $('#outer-barG').hide();
    }).catch(error => {
      console.log(error.response);
    });
  }

  appendId = (e) => {
    // this.getSigners();
    let ids = [];
    let dragData = JSON.parse($(e.target).attr('data-string')); 
    Object.keys(dragData).forEach(function (key) {
      if(dragData[key].type == "signer_added"){
        ids.push(dragData[key].signer_id);
      }
    });
    $("#email_table #signersPanel tr input").each(function (index) {
      if ($(this).val() && $.trim($(this).val()) != '') {
        $(this).val('');
      }
    });
    this.setState({subject:''});
    this.setState({message: '' });
    // $("#email_table input.emailSubject").val('');
    // $("#email_table textarea.emailText").val('');
    this.getSigners([...new Set(ids)]);
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
      text: "It Will Also Delete Docs Inside It , Are You Sure ?",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    })
    .then(willdel => {
      if (willdel) {
        axios.delete('/api/folder/'+folder).then((res) => {
          this.getFolders();
          this.getDocs();
          swal("Deleted!", "Your folder has been deleted", "success");
        }).catch(error => {
          swal("Error!", "Something Went wrong", "danger");
        }); 
      }
    });
  }

  sendEmail(e){
    e.preventDefault();
    let id = $('#emailModal form').find('#doc_id').val();
    let emails = [];
    $( "#email_table #signersPanel tr input" ).each(function( index ) {
      if($( this ).val() && $.trim($( this ).val()) !=''){
        emails.push({signer_id:$( this ).attr('id'),email:$( this ).val()});
      } 
    });
    // this.state.signers_email.push(e.target.value);
    let uniqueemails = [...new Set(emails)];
    if(uniqueemails.length > 0 && id){
      axios.post('/api/sendemail',{'emails':uniqueemails,'subject':this.state.subject,'message':this.state.message,'id':id,token:localStorage.getItem('jwtToken')}).then((res) => {
        $('#emailModal').modal('hide');
        // let ids = {};
        // let docs = this.state.docs;
        // Object.keys(docs).forEach(function (head) {
        //   Object.keys(docs[head].images).forEach(function (key) {
        //     ids[docs[head]._id] = [];
        //     Object.keys(docs[head].images[key].drag_data).forEach(function (key2) {
        //       if (docs[head].images[key].drag_data[key2].type == "signer_added" && !ids[docs[head]._id].includes(docs[head].images[key].drag_data[key2].signer_id)) {
        //         ids[docs[head]._id].push(docs[head].images[key].drag_data[key2].signer_id);
        //       }
        //     });
        //   });
        // });
        // this.getSignersWithDoc(ids);
        swal("Success!", "Document Shared Successfully", "success");
      }).catch(error => {
        swal("Error!", "Something Went wrong", "danger");
      });
    }
    return false;
  }

  reOrder = (e) => { 
    var tr = $(e.target).closest("TR"), si = tr.index(), sy = e.pageY, b = $('#email_modal_form'); 
    // if (si == 0) return;
    b.addClass("grabCursor").css("userSelect", "none");
    tr.addClass("grabbed");
    const move = (e) => {
      let drag = this.state.drag;
      if (!drag && Math.abs(e.pageY - sy) < 10) return;
      this.setState({drag: true});
      tr.siblings().each(function() { 
            var s = $(this), i = s.index(), y = s.offset().top; //console.log('I :-  '+i); console.log('Y :-  '+y);console.log('e.pageY :-  '+e.pageY);console.log('outerHeight :-  '+(y + s.outerHeight()));
            if (i >= 0 && e.pageY >= y && e.pageY < y + s.outerHeight()) {
                if(tr.index() == 0){
                  tr.insertAfter(s);
                  return false;
                }
                if(i == 0){
                  tr.insertBefore(s);
                  return false;
                }
                if (i < tr.index())
                    tr.insertAfter(s);
                else
                    tr.insertBefore(s);
                return false;
            }
        });
    }
    
    const up = (e) => {
      let drag = this.state.drag;
      if (drag && si != tr.index()) {
        this.setState({drag: false});
        console.log("moved!");
      }
      $('#email_modal_form').unbind("mousemove", move).unbind("mouseup", up);
      b.removeClass("grabCursor").css("userSelect", "none");
      tr.removeClass("grabbed");
    }
    $('#email_modal_form').mousemove(move).mouseup(up);
  }

  createFolder = (e) => {
    e.preventDefault();
    $('#create_folder').modal('show');
  }

  saveFolder = (e) => {
    e.preventDefault();
    if(this.state.folder){
      axios.post('/api/createfolder', { folder: this.state.folder,token: localStorage.getItem('jwtToken')}).then((res) => {
        this.getFolders();
        setTimeout(() => $('#create_folder').modal('hide'), 500)
      }).catch(error => {
       
      });
    }
  }

  showRenamePop = (id,type,e) => {
    e.preventDefault();
    if (type == 'folder') {
      this.setState({ folder_id: id });
      $('#rename_folder').modal('show');
    }else{
      this.setState({ doc_id: id });
      $('#rename_doc').modal('show');
    }
    
  }


  renameFolder = (e) => {
    if (this.state.folder && this.state.folder_id){
      axios.put('/api/folder', { folder: this.state.folder, folder_id: this.state.folder_id}).then((res) => {
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
      this.state.checked_values.push(e.target.value);
      let unique = [...new Set(this.state.checked_values)];
      this.setState({checked_values:unique});
    }else{
      this.state.checked_values = this.state.checked_values.filter(function(ele){
          return ele != e.target.value;
      });
    }
    if (this.state.checked_values.length > 0){
      this.setState({disabled_fields:{}});
    }else{
      this.setState({disabled_fields:{pointerEvents:'none',color:'#c9c2c2'}});
    }
  }

  folderStructure = (e) => {
    e.preventDefault();
    $('#folder_structure').modal('show');
  }

  selectFolder = (id,e) => {
    // e.preventDefault();
    $('#myUL li').removeClass('activeClass');
    $('#myUL li span').removeClass('activeClass');
    if(e.target.tagName == 'SPAN'){
      $(e.target.parentElement).addClass("activeClass");  
    }else{
      $(e.target).addClass("activeClass");
    }
    this.setState({ move_to: id});
    
  }

  moveDoc = (e) => {
    if(this.state.move_to && this.state.checked_values.length > 0){
      axios.post('/api/movefile',{move_to:this.state.move_to,docs:this.state.checked_values}).then((res) => {
        this.getDocs();
        this.setState({ disabled_fields: { pointerEvents: 'none', color: '#c9c2c2' } });
        setTimeout(() => $('#folder_structure').modal('hide'), 500);
      }).catch(error => {
       
      });
    }
  }

  renameDoc = (e) => {
    if (this.state.current_doc && this.state.doc_id) {
      axios.put('/api/doc/rename', { doc_name: this.state.current_doc, doc_id: this.state.doc_id }).then((res) => {
        this.getDocs();
        setTimeout(() => $('#rename_doc').modal('hide'), 500)
      }).catch(error => {

      });
    }
  }

  openFolder = (folder,name,e) => {
    if(!folder){
      this.setState({folder:null});
      this.setState({folder_data:[...new Set([])]});
      return;
    }
    this.setState({ folder: name});
    axios.get('/api/get_files/'+folder).then((res) => {
      this.setState({
        folder_data: res.data
      });
    }).catch(error => {
      console.log(error.response);
    });
  }

  multiSend = (e) => {
    console.log('multi send');
    // let ids = [];
    // let dragData = JSON.parse($(e.target).attr('data-string'));
    // Object.keys(dragData).forEach(function (key) {
    //   if (dragData[key].type == "signer_added") {
    //     ids.push(dragData[key].signer_id);
    //   }
    // });

    // $("#email_table #signersPanel tr input").each(function (index) {
    //   if ($(this).val() && $.trim($(this).val()) != '') {
    //     $(this).val('');
    //   }
    // });
    // this.setState({ subject: '' });
    // this.setState({ message: '' });
    // // $("#email_table input.emailSubject").val('');
    // // $("#email_table textarea.emailText").val('');

    // this.getSigners([...new Set(ids)]);
    // $('#emailModal').modal('show');
    // if (!$('#doc_id').hasClass('hidden_doc')) {
    //   $('#email_modal_form').append('<input type="hidden" value="' + e.target.id + '" class="hidden_doc" id="doc_id"/>');
    // } else {
    //   $('#doc_id').val(e.target.id);
    // }
  }

  deleteDocs = (e) => {
    if (this.state.checked_values.length > 0) {
      e.preventDefault();
      swal({
        title: "Do You Want to delete it from your account?",
        icon: "warning",
        buttons: ["No", "Yes"],
        dangerMode: true,
      })
        .then(willdel => {
          if (willdel) {
            axios.post('/api/multideletedocs', { docs: this.state.checked_values }).then((res) => {
              this.getDocs();
              this.setState({ disabled_fields: { pointerEvents: 'none', color: '#c9c2c2' } });
              swal("Deleted!", "Selected docs has been deleted", "success");
            }).catch(error => {
              swal("Error!", "Something Went wrong", "danger");
            });
          }
        });
    }
  }

  onChange(e){
    this.setState({[e.target.name]:e.target.value});
  }


  handleClick = (action, e) => {
    if (!e.target.id) {
      let targetid = $(e.target.parentElement).find('a.active').attr('id');
      if (action == 'next') {
        targetid = parseInt(targetid) + 1;
      }
      if (action == 'prev') {
        targetid = parseInt(targetid) - 1;
      }
      e.target.id = targetid;
    }
    this.getTemplates(e, e.target.id);
    this.setState({
      currentPage: Number(e.target.id)
    });
  }

  resendSignature = (data,e) => {
    e.preventDefault();
    $('#outer-barG').show();
    axios.post('/api/sendemail', { 'emails': [{ signer_id: data.signer_id, email: data.email }], 'subject': data.email + ' is Awaiting For Your Signature', 'message': data.email + ' invited you to sign below doc', 'id': data.docId, token: localStorage.getItem('jwtToken'), queId: data.queId }).then((res) => {
      $('#outer-barG').hide();
      swal("Sent!", "Document Resend Successfully", "success");
    }).catch(error => {
      swal("Error!", "Something Went wrong", "danger");
    });
  }

  removeSignature = (docid, queid,e) => {
    e.preventDefault();
    axios.delete('/api/que/' + queid+'/'+docid).then((res) => {
      if (res.data.success) {
        $('#invitation_id_' + queid).remove();
        swal("Deleted!", "Signer deleted Successfully", "success");
      }else{
        swal("Error!", "Something Went wrong", "danger");
      }
    }).catch(error => {
      swal("Error!", "Something Went wrong", "danger");
    });
  }

  stopPropagation = (e) => {
    e.stopPropagation();
  }

  render() {
    const { user } = this.props;
    let modalCss = {
      top: '65px'
    }
    let addedAlert;
    if (this.state.added) {
      addedAlert = <div className={this.state.alert} style={{textAlign:'center'}}>
      <strong>{this.state.msg}</strong>   
      </div>;
      // this.closePopUp()
    }
    if (!localStorage.getItem('jwtToken')) {
      return <Redirect to='/'  />
    }
    if (this.state.redirect) {
      return (<Redirect to={this.state.redirect}/>)
    }
    let folder_path = '';
    if (typeof this.state.folder_data == 'string' || this.state.folder_data.length > 0){
      folder_path = (<div class="folderPath">
      <a href="javascript:void(0)" onClick={this.openFolder.bind(this, null,null)} class="folderLink">Documents</a>
      <span class="folderSeparator" style={{padding: '5px'}}>›</span>{this.state.folder}              
    </div>);
    }

    let renderPageNumbers;
    if (this.state.total_pages > this.state.pageLimit) {
      const pageNumbers = [];
      for (let i = 1; i <= this.state.current_pages; i++) {
        pageNumbers.push(i);
      }
      renderPageNumbers = pageNumbers.map(number => {
        let activeClass_ = '';
        if (this.state.currentPage == number) {
          activeClass_ = 'active';
        }
        return (
          <a key={number}
            id={number}
            onClick={this.handleClick.bind(this)}
            href="javascript:void(0)" class={activeClass_}>{number}</a>
        );
      });
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
            {/* <div className="pull-left image">
              <img src="/assets/img/user2.jpg" className="img-circle" alt="User Image"/>
            </div> */}
            {/* <div className="pull-left info">
              <p>DIGISIGN <span className="small">Founder of App</span></p>
            </div> */}
           </div>
           <ul className="sidebar-menu tree" data-widget="tree">
                <li><NavLink activeClassName='active' to='/dashboard'><i className="fa fa-dashboard"></i> <span>Documents</span></NavLink></li>
            <li><NavLink activeClassName='active' to='/templates'><i className="fa fa-rebel"></i> <span>Templates</span></NavLink></li>
            <li><NavLink activeClassName='active' to='/logout'><i className="fa fa-sign-out"></i> <span>Logout</span></NavLink></li>
           </ul>
        </aside>
        <div className="right-maintemplate admin-right">
          <div className="page container-fluid">
          {folder_path}
            <div className="col-sm-6"><h3 className="text-uppercase">Documents</h3></div>
            <div className="box-body">
              <div className="col-sm-12">
                <div className="card box-spice">
                  <div className="card-header">
                    <ul className="list-inline top-box-list">
                      {/* <li><input type="checkbox" onChange={this.selectDocs.bind(this)}/><span></span></li>  */}
                          <li className="upload_docs"><input type="file" id="hidden_upload_file" onChange={this.docUpload} />UPLOAD <i className="fa fa-upload"></i></li>
                          <li><a href="javascript:void(0)" onClick={this.createFolder}>NEW FOLDER <i className="fa fa-plus"></i></a></li>
                      {/* <li><a href="javascript:void(0)">FOLDER SEND </a></li> */}
                          <li><a href="javascript:void(0)" style={this.state.disabled_fields} onClick={this.multiSend}>SEND FOR SIGNING <i className="fa fa-send-o"></i></a></li>
                          <li><a href="javascript:void(0)" onClick={this.folderStructure} style={this.state.disabled_fields}>MOVE TO <i className="fa fa-arrows"></i></a></li>
                          <li className="delete-row"><a href="javascript:void(0)" onClick={this.deleteDocs} style={this.state.disabled_fields}>TRASH <i className="fa fa-trash danger"></i></a></li>
                          <li className="search-row">
                            <form id="example1_filter" className="dataTables_filter">
                              <label className="filter_search">
                                <input type="search" className="form-control input-sm" placeholder="Search..." aria-controls="example1" />
                                <button className="btn search--btn"><i className="fa fa-search"></i></button>
                              </label>
                            </form>
                          </li>
                    </ul>
                  </div>
                  {(() => {
                        if (typeof this.state.folder_data != 'string' && this.state.folder_data.length > 0) {
                      return (<div className="card-body">
                        <ol className="od-list">
                          {this.state.folder_data.map((value, index) => {
                            let img = "/files/docs/" + value.images[0].name || "/assets/img/doc-1.png";
                            return (<li key={index}>
                              <ul className="list-inline top-box-list">
                                <li><input onChange={this.saveAction} type="checkbox" value={value._id} /><span></span></li>
                                <li className="doc-box">
                                  <NavLink to={'signature/' + value._id} className="btn-default btn-flat">
                                    <div className="fig-left">
                                      <img src={img} alt="No Thumb" className="doc-pic" />
                                    </div>
                                    <div className="doc-info">
                                      <p>{value.file}<span className="date-doc small">{value.created_at}</span></p>
                                    </div>
                                  </NavLink>
                                </li>
                                <li><NavLink to={'signature/' + value._id} className="btn-default btn-flat">SIGN</NavLink></li>
                                {/* data-toggle="modal" data-target="#emailModal" */}
                                <li><a href="javascript:void(0)" id={value._id} data-string={JSON.stringify(value.images[0].drag_data)} onClick={this.appendId}>SEND FOR SIGNING </a></li>
                                <li><NavLink to={'signature/' + value._id} className="btn-default btn-flat"><i className="fa fa-edit"></i></NavLink></li>
                                {/* <li><a href="#"><i className="fa fa-share"></i></a></li> */}
                                <li><a href={'files/docs/' + value.file} target="_blank"><i className="fa fa-download"></i></a></li>
                                <li className="delete-row"><a className="fa fa-trash danger" onClick={this.deleteDoc.bind(this, value._id)} href="javascript:void(0)"></a></li>
                              </ul>
                            </li>);
                          })}
                        </ol>
                      </div>);
                        } else {
                      switch (typeof this.state.folder_data) {
                        case "string": return (<div className="card-body">
                          <ol className="od-list">
                            <li key='not_found'>
                              <div className="doc-info" style={{ textAlign: 'center', padding: '29px' }}>
                                <p><span className="date-doc small" style={{ fontSize: '22px' }}>{this.state.folder_data}</span></p>
                              </div>
                            </li>
                          </ol>
                        </div>);
                        default: return (<div><div className="card-body">
                          <ol className="od-list-2">
                            {this.state.folders.map((value, index) => {
                              let img = "/assets/img/folder.jpg";
                              // let folder = value.substr(value.lastIndexOf('/') + 1);
                              return (<li key={index}>
                                <ul className="list-inline top-box-list-2">
                                  <li><input type="checkbox" value={value._id} /><span></span></li>
                                  <li className="doc-box">
                                    <a href="javascript:void(0)" onClick={this.openFolder.bind(this, value._id, value.name)}>
                                      <div className="fig-left">
                                        <img src={img} alt="No Thumb" className="doc-pic" />
                                      </div>
                                      <div className="doc-info">
                                        <p><span className="date-doc small">{value.name}</span></p>
                                      </div>
                                    </a>
                                  </li>
                                  <li><a href="javascript:void(0)" onClick={this.openFolder.bind(this, value._id, value.name)}>Open</a></li>
                                  <li className="folder_more_button">
                                    <div class="dropdown">
                                      <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">More
                                                                <span class="caret"></span></button>
                                      <ul class="dropdown-menu" style={{ minWidth: '6rem' }}>
                                        <li><a className="btn btn-default" style={{ border: 'solid 1px' }} onClick={this.deleteFolder.bind(this, value._id)} href="javascript:void(0)">Delete</a></li>
                                        <li><a className="btn btn-default" style={{ border: 'solid 1px' }} onClick={this.showRenamePop.bind(this, value._id,'folder')} href="javascript:void(0)">Rename</a></li>
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
                                let signers_list = [];
                                if (this.state.invitation_list[value._id]) {
                                  let docData = this.state.invitation_list[value._id];
                                  Object.keys(docData).map((invitevalue, inviteindex) => {
                                    // console.log(inviteindex);
                                    // console.log(docData[invitevalue]);
                                    if (docData[invitevalue].status == 'pending') {
                                      signers_list.push(<a href="javascript:void(0)" id={"invitation_id_" + docData[invitevalue].queId} style={{ float: 'left', textDecoration: 'none', outline: 'none' }} class="dropdown col-sm-4">
                                        <a href="javascript:void(0)" class="btn-default dropdown-toggle" style={{ textDecoration: 'none', outline: 'none' }} type="button" data-toggle="dropdown"><img src="/assets/img/pending.png" style={{ padding: '3px' }} />{docData[invitevalue].email}
                                        <span class="caret"></span></a>
                                        <ul class="dropdown-menu" style={{ minWidth: '6rem' }}>
                                          <li style={{ padding: '3px'}}><a className="btn btn-default" style={{ border: 'solid 1px' }} onClick={this.resendSignature.bind(this, docData[invitevalue])} href="javascript:void(0)">Resend Signature</a></li>
                                          <li style={{ padding: '3px'}}><a className="btn btn-default" style={{ border: 'solid 1px' }} onClick={this.removeSignature.bind(this, value._id, docData[invitevalue].queId)} href="javascript:void(0)">Remove Signer</a></li>
                                        </ul>
                                      </a>);
                                    }else{
                                      signers_list.push(<a href="javascript:void(0)" onClick={this.stopPropagation} style={{ padding: '3px', float: 'left' }}><img src={"/assets/img/" + docData[invitevalue].status+".png"} style={{ padding: '3px' }} />{docData[invitevalue].email}</a>)
                                    }
                                  });
                                }
                                
                                let img = "/files/docs/" + value.images[0].name || "/assets/img/doc-1.png";
                                return (<li key={index}>
                                  <ul className="list-inline top-box-list">
                                    <li><input onChange={this.saveAction} type="checkbox" value={value._id} /><span></span></li>
                                    <li className="doc-box">
                                      <a className="btn-default btn-flat" href="javascript:void(0)">
                                      <NavLink to={'signature/' + value._id}>
                                        <div className="fig-left">
                                          <img src={img} alt="No Thumb" className="doc-pic" />
                                        </div>
                                      </NavLink>
                                        <div className="doc-info">
                                          <p>{value.title}<span className="date-doc small">{value.created_at}</span><span className="date-doc small row">{signers_list}</span></p>
                                        </div>
                                      </a>
                                    </li>
                                    <li><NavLink to={'signature/' + value._id} className="btn-default btn-flat">SIGN</NavLink></li>
                                    {/* data-toggle="modal" data-target="#emailModal" */}
                                    <li><a href="javascript:void(0)" id={value._id} data-string={JSON.stringify(value.images[0].drag_data)} onClick={this.appendId}>SEND FOR SIGNING </a></li>
                                    {/* <li><a href="#"><i className="fa fa-share"></i></a></li> */}
                                    <li>
                                      <div class="dropdown">
                                        <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">More
                                        <span class="caret"></span></button>
                                        <ul class="dropdown-menu" style={{ minWidth: '6rem' }}>
                                          <li><NavLink to={'signature/' + value._id} style={{ border: 'solid 1px', marginBottom: '10px' }} className="btn btn-default">Edit</NavLink></li>
                                          <li><a className="btn btn-default" style={{ border: 'solid 1px', marginBottom: '10px' }} href={'files/docs/' + value.file} target="_blank">Download</a></li>
                                          <li className="delete-row"><a className="btn btn-default" style={{ border: 'solid 1px', marginBottom: '10px' }} onClick={this.deleteDoc.bind(this, value._id)} href="javascript:void(0)">Delete</a></li>
                                          <li><a className="btn btn-default" style={{ border: 'solid 1px', marginBottom: '10px' }} onClick={this.showRenamePop.bind(this, value._id,'doc')} href="javascript:void(0)">Rename</a></li>
                                        </ul>
                                      </div>
                                    </li>
                                  </ul>
                                </li>);
                              })}
                            </ol>
                          </div></div>);
                      }
                    }
                    
                  })()}
                      {(() => {
                        let disablesFields = {};
                        let disablesFieldsprev = {};
                        if ((this.state.currentPage * this.state.pageLimit) == this.state.total_pages) {
                          disablesFieldsprev['pointerEvents'] = 'none';
                          disablesFieldsprev['color'] = 'burlywood';
                        }
                        if (this.state.currentPage <= 1) {
                          disablesFields['pointerEvents'] = 'none';
                          disablesFields['color'] = 'burlywood';
                        }
                        if (this.state.total_pages > this.state.pageLimit) {
                          return (<div class="pagination">
                            <a href="javascript:void(0)" style={disablesFields} onClick={this.handleClick.bind(this, 'prev')}>&laquo;</a>
                            {renderPageNumbers}
                            <a href="javascript:void(0)" style={disablesFieldsprev} onClick={this.handleClick.bind(this, 'next')}>&raquo;</a>
                          </div>)
                        }
                      })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

          <div className="modal fade" id="create_folder" role="dialog" style={modalCss}>
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

        <div className="modal fade san_custom" id="rename_folder" role="dialog" style={modalCss}>
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

          <div className="modal fade san_custom" id="rename_doc" role="dialog" style={modalCss}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-body">
                  <div className="col-md-12 col-md-offset-4">
                    <div className="panel panel-default">
                      <div className="panel-body">
                        <div className="text-center">
                          <h3><i className="fa fa-lock fa-2x"></i></h3>
                          <h2 className="text-center">Rename Doc</h2>
                          <div className="panel-body">
                            <div className="form-group">
                              <div className="input-group">
                                <span className="input-group-addon"><i className="glyphicon glyphicon-envelope color-blue"></i></span>
                                <input id="current_doc" name="current_doc" placeholder="Enter New Doc Name" onChange={this.onChange} className="form-control" type="text" />
                              </div>
                            </div>
                            <div className="form-group">
                              <input name="recover-submit" className="btn btn-lg btn-primary btn-block" value="Save" onClick={this.renameDoc} type="button" />
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

          <div className="modal fade san_custom" id="folder_structure" role="dialog" style={modalCss}>
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
                                        // let folder = value.substr(value.lastIndexOf('/') + 1);
                                        return (<li onClick={this.selectFolder.bind(this, value._id)}><span class="caret">{value.name}</span>
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

          <div id="emailModal" className="modal fade san_custom" tabindex="-1" role="dialog" aria-labelledby="contactModalLabel" style={modalCss}>
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
							      <form className="form-horizontal" role="form" onSubmit={this.sendEmail.bind(this)} id="email_modal_form">
                    <table id="email_table" className="sendEmailDialogPanel" cellpadding="2" style= {{width: '100%',float: 'left'}}>
                      <tbody>
                          <tr>
                            <td>
                                <span className="signersPanel">
                                  <span className="setSignOrderPanel">
                                      <span className="setSignOrderMessage">Set signing order</span>
                                  </span>
                                  <div className="form-group signersTable">
                                      <div className="ui-datatable-tablewrapper">
                                        <table role="grid" id="signersPanel" style= {{width: '100%',float: 'left'}}>
                                            <tbody>
                                            {this.state.signers.map((person) => <tr id={person._id} role="row">
                                                  <td class="grab" onMouseDown={this.reOrder.bind(this)}>&#9776;</td>
                                                  <td role="gridcell">{person.name}</td>
                                                  <td role="gridcell">
                                                     <span  className="signerEmail" role="application"><input id={person._id} value={this.value} type="text" className="form-control" placeholder="email@example.com" /></span>
                                                  </td>
                                              </tr>)}
                                            </tbody>
                                        </table>
                                      </div>
                                  </div>
                                  {/* <a id="invitationForm:addCcEmails" href="#" className="addCcEmailsButton" onclick="">Add CC</a> */}
                                </span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                                <span>
                                    <label>Subject &amp; Message</label><input id="subject" name="subject" type="text" defaultValue={user.email +' Needs Your Signature'} value={this.state.subject} onChange={this.onChange} required className="form-control emailSubject" />
                                  <div id="invitationForm:emailSubjectMessages" aria-live="polite" className="ui-message"></div>
                                    <textarea cols="20" rows="5" maxlength="2147483647" required className="form-control emailText" defaultValue={user.email +' invited you to sign'} value={this.state.message} onChange={this.onChange} name="message"></textarea>
                                  <div aria-live="polite" className="ui-message"></div>
                                </span>
                            </td>
                          </tr>
                          <tr>
                            <td><span className=""><button id="cancelButton" data-dismiss="modal" style={{width: '24%',float: 'left'}} className="btn btn-danger cancelButton" type="button"><span className="ui-button-text ui-c">Cancel</span></button><button id="inviteButton" style={{width: '24%',float: 'right'}} name="inviteButton" className="btn btn-success" type="submit"><span className="">Send Document</span></button></span></td>
                          </tr>
                      </tbody>
                    </table>
							      </form>
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

export default Dashboard;
