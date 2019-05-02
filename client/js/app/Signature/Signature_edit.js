import React, {Component} from 'react';
import axios from 'src/common/myAxios';
import DropArea from './DropArea';
import  { Redirect } from 'react-router-dom'
import Sign from './Sign';
import './Signature.css';
var html2canvas = require('html2canvas');
import jsPDF from 'jspdf';
import swal from 'sweetalert';
var NavLink = require('react-router-dom').NavLink;
import SignerFields from './SignerFields';
const getBase64 = (file) => {
  return new Promise((resolve,reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}
// localStorage.clear();
class Signature_edit extends Component {
  constructor(props){
    super(props);
    let edit_id = null;
    const params = this.props.location.pathname.split('/');
    if(params[params.length-1] != 'signature'){
      edit_id = params[params.length-1];
    }
    // debugger;
    this.state = {
      page:'signature',
      inputFields:[],
      doc:null,
      edit_id:edit_id,
      doc_blob:null,
      pdf_doc:null,
      top:383,
      left:479,
      doc_id:null,
      HTML_Width:null,
      HTML_Height:null,
      top_left_margin:null,
      canvas_image_width:null,
      canvas_image_height:null,
      page_section:null,
      uploaded_sign:null,
      sign_image:null,
      sign_font:null,
      sign_text:null,
      bind_signature:false,
      signer_field:null,
      sign_texts:{},
      docs:[],
      color:'black',
      buttons:{
        sign:false,
        clear:false,
        revoke:false
      },
      doc_for_sign: this.props.location.query.sign ? this.props.location.query.sign : false,
      signer:null,
      exist_signer:null,
      signers_err:null,
      active_tab:'initial',
      signers:[]
    };
    let doc = localStorage.getItem('uploaded_doc') || ''
    if(doc){
      this.chkFileType(doc);
    }
    this.addField = this.addField.bind(this);
    this.handleChange = this.handleChange.bind(this);
    // console.log(this.state);debugger;
  }

  componentDidMount() {
    let docs = localStorage.getItem('files_array') || this.state.docs
    try {
      docs = JSON.parse(docs)
    }catch(e){

    }

    axios.get('/api/signers').then((res) => {
      this.setState({
        signers: res.data
      });
     
    }).catch(error => {
      console.log(error.response);
    });

    if (this.state.edit_id) {
      axios.get('/api/doc/'+this.state.edit_id).then((res) => {
        this.setState({
          docs: res.data.images
        });
      }).catch(error => {
        console.log(error.response);
      });
    }else{
      this.setState({
        docs: docs
      });
    }
  }

  addField(e){
    let fld = this.state.signer_field;
    if(this.state.signer){
      axios.post('/api/addfield',this.state).then((res) => {
        this.state.inputFields.push('signer_added');
        // let unique = [...new Set(this.state.inputFields)];
        // this.setState({inputFields:unique});
        this.setState({signer_field: res.data.name+' '+fld});
        this.setState({signer_id: res.data._id});
        $('#add_signer').modal('hide');
        setTimeout(() => {
          $(".signature_container").click();
        }, 1000);
      }).catch(error => {
        
      });
    }else if(this.state.exist_signer){
      this.state.inputFields.push('signer_added');
      // let unique = [...new Set(this.state.inputFields)];
      // this.setState({inputFields:unique});
      let sgn = this.state.exist_signer;
      this.setState({signer_field: sgn+' '+fld});
      $('#add_signer').modal('hide');
      setTimeout(() => {
        $(".signature_container").click();
      }, 1000);
      
    }else{
      this.setState({signers_err: 'Signer is Required'});
      // debugger;
    }
  }

  chkFileType = (doc) => {
    // this.setState({
    //        doc_blob: doc
    // });
    var loader = document.getElementById('outer-barG');
    $('<div class="modal-backdrop show" id="modal_backdrop"></div>').appendTo('body');
    $(loader).css('display','block');
    axios.post('/api/chktype',{doc_file:doc}).then((res) => {
        localStorage.setItem('uploaded_doc','')
        let fina_data = [];
        Object.keys(res.data.message).map(key => {
          var i = new Image(); 
          i.onload = function(){
            fina_data.push({name:res.data.message[key].name,w:i.width,h:i.height});
          };
          i.src = 'files/docs/'+res.data.message[key].name;
        });
        setTimeout(() => {
          localStorage.setItem("files_array", JSON.stringify(fina_data))
          this.setState({
            docs: fina_data
          });
          var loader = document.getElementById('outer-barG');
          $('#modal_backdrop').remove();
          $(loader).css('display','none');
        }, 1000);    
    }); 
  }

  convertHtmlToCanvas = (e) => {
    e.preventDefault();
    let save = '';
    let doc = '';
    let width = '';
    let height = '';
    let edit_id = this.state.edit_id;
    let docs = this.state.docs;
    let inputfields = this.state.inputFields;
    if(this.state.docs.length > 0){
      for(let i=1;i <=this.state.docs.length;i++){
        $("#signature_container_"+i).css('background-color','transparent');
        html2canvas(document.querySelector("#signature_container_"+i), { allowTaint: true }).then(canvas => { 
          var imgData = canvas.toDataURL(
            'image/jpeg',[0.0, 1.0]);      
            this.calculatePDF_height_width("#signature_container_"+i,0);
            if(i ==1){
              doc = new jsPDF('p', 'mm', 'a4');
              width = doc.internal.pageSize.getWidth();
              height = doc.internal.pageSize.getHeight();
              doc.setFont("helvetica");
              doc.setFontType("bold");
            }else{
              doc.addPage();
            }
            let drag_data = [];
             docs[parseInt(i)-1].drag_data = [];
            $("#signature_container_"+i+" .unselectable").each(function( index ) {
              let key___ = inputfields.slice(inputfields.length - 1);
              let field = $( this ).data('id') || key___[0];
              let type = $( this ).data('id') || field; 
              let img = $( this ).find('img').attr('src');
              let w=$(this).width();
              let h=$(this).height();
              let font = $(this).css("font-size");
              let fontfamily = $(this).find('span').css('font-family');
              let clr = $(this).find('span').css('color');
              let signer_id = $(this).find('span').attr('id');
              // if(docs[index]){
                drag_data.push({ id: index, isDragging: false, isResizing: false, top:$( this ).css('top'), left: $( this ).css('left'),width:w, height:h, fontSize:font,isHide:false, type:type,appendOn:false,content:$( this ).find('span').text(),doc_id:i,required:false,sign_img:img,sign_text:$( this ).find('span').text(),sign_font:fontfamily,sign_color:clr,signer_id:signer_id});
              // }
              // console.log( index + ": " + $( this ).attr('id') );
              // console.log( index + ": " + $( this ).css('left') );
            });
            docs[parseInt(i)-1].drag_data = drag_data;
            doc.addImage(imgData, 'JPEG', 0, 0, width, height);
            if(i == this.state.docs.length){
              setTimeout(function() {
                var blob = doc.output("blob");
                var blobURL = URL.createObjectURL(blob);
                var downloadLink = document.getElementById('pdf-download-link');
                downloadLink.href = blobURL;
                var loader = document.getElementById('outer-barG');
                $('#modal_backdrop').remove();
                $(loader).css('display','none');
                swal({
                  title: "Do You Want to save it in your account?",
                  text: "Are you sure that you want to save this ?",
                  icon: "success",
                  buttons: ["No", "Yes"],
                  dangerMode: false,
                })
                .then(willSave => {
                  if (willSave) {
                    var reader = new FileReader();
                    reader.readAsDataURL(blob); 
                    reader.onloadend = function() {
                        let base64data = reader.result;                
                        axios.put('/api/doc/'+edit_id,{base64Data:base64data,token:localStorage.getItem('jwtToken'),docs:docs}).then((res) => {
                          
                        });
                    }
                    swal("Saved!", "Your doc file has been saved", "success");
                    return <Redirect to='/dashboard'  />
                  }
                });
              },500);
            }
        });
      }
    }
  }

 

  calculatePDF_height_width = (selector,index) => {
    this.state.page_section = $(selector).eq(index);
    this.state.HTML_Width = this.state.page_section.width();
    this.state.HTML_Height = this.state.page_section.height();
    this.state.top_left_margin = 10;
    this.state.PDF_Width = this.state.HTML_Width + (this.state.top_left_margin * 2);
    this.state.PDF_Height = (this.state.PDF_Width * 1.2) + (this.state.top_left_margin * 2);
    this.state.canvas_image_width = this.state.HTML_Width;
    this.state.canvas_image_height = this.state.HTML_Height;
  }

  docUpload = (e) => {
    const file = e.target.files[0];
    getBase64(file).then(base64 => {
      this.setState({
        uploaded_sign: base64
      });
      this.chkFileType(base64);
    });
  }

  removeSignature(e){
    e.preventDefault();
    this.signaturePad.clear();
  }

  saveData(e){
    e.preventDefault();
    var loader = document.getElementById('outer-barG');
    $('<div class="modal-backdrop show" id="modal_backdrop"></div>').appendTo('body');
    // document.getElementById("app").appendChild('<div class="modal-backdrop show"></div>');
    $(loader).css('display','block');
    this.convertHtmlToCanvas(e);
  }

  createTextField(e){
    e.preventDefault();
    $(e.target).addClass('current-btn');
    $('#date_field').removeClass('current-btn');
    $('#initial_field').removeClass('current-btn');
    $('#sign_pad').removeClass('current-btn');
    $('#check_field').removeClass('current-btn');
    $('#clear_field').removeClass('current-btn');
    

    $('.signature_container').addClass('hovrcr_text');
  	$('.signature_container').removeClass('hovrcr_date');
  	$('.signature_container').removeClass('hovrcr_initials');
    $('.signature_container').removeClass('hovrcr_check');
    $('.signature_container').removeClass('hovrcr_sign');
    this.state.inputFields.push('text');
    // this.setState({inputFields:textfield});
    console.log('clicked on text button')
  }

  createDateField(e){
    e.preventDefault();
    $(e.target).addClass('current-btn');
    $('#text_field').removeClass('current-btn');
    $('#initial_field').removeClass('current-btn');
    $('#sign_pad').removeClass('current-btn');
    $('#check_field').removeClass('current-btn');
    $('#clear_field').removeClass('current-btn');

    $('.signature_container').addClass('hovrcr_date');
    $('.signature_container').removeClass('hovrcr_text');
    $('.signature_container').removeClass('hovrcr_initials');
    $('.signature_container').removeClass('hovrcr_check');
    $('.signature_container').removeClass('hovrcr_sign');
    this.state.inputFields.push('date');
    // this.setState({inputFields:datefield});
    let unique = [...new Set(this.state.inputFields)];
    this.setState({inputFields:unique});
    console.log('clicked on Date button')
  }

  showInitialField(e){
    e.preventDefault();
    this.state.inputFields.push('initials');
    $(e.target).addClass('current-btn');
    $('#text_field').removeClass('current-btn');
    $('#sign_pad').removeClass('current-btn');
    $('#check_field').removeClass('current-btn');
    $('#clear_field').removeClass('current-btn');
    $('#date_field').removeClass('current-btn');

    $('#text_field').removeClass('current-btn');
    $('.sign-btn').click();
    $('#sign_nav_tabs .nav-item #type_').addClass('active');
    $('#sign_nav_tabs .nav-item #draw_').removeClass('active');
    $('#sign_nav_tabs .nav-item #upload_').removeClass('active');

    $('.modal-content .modal-body #type').addClass('active');
    $('.modal-content .modal-body #draw').removeClass('active').removeClass('show');
    $('.modal-content .modal-body #upload').removeClass('active').removeClass('show');

    $('.signature_container').addClass('hovrcr_initials');
    $('.signature_container').removeClass('hovrcr_text');
    $('.signature_container').removeClass('hovrcr_date');
    $('.signature_container').removeClass('hovrcr_check');
    $('.signature_container').removeClass('hovrcr_sign');
    console.log('clicked on Initial Button')
  }

  showSignatureField(e){
    e.preventDefault();
    $(e.target).addClass('current-btn');
    $('#text_field').removeClass('current-btn');
    $('#initial_field').removeClass('current-btn');
    $('#check_field').removeClass('current-btn');
    $('#clear_field').removeClass('current-btn');
    $('#date_field').removeClass('current-btn');

    $('#text_field').removeClass('current-btn');
    // $('.sign-btn').click();
    $('#sign_nav_tabs .nav-item #draw_').addClass('active');
    $('#sign_nav_tabs .nav-item #type_').removeClass('active');
    $('#sign_nav_tabs .nav-item #upload_').removeClass('active');

    $('.modal-content .modal-body #draw').addClass('active').addClass('show');
    // $('.signature-container div div').addClass('sign_pad_tab');
    
    $('.modal-content .modal-body #type').removeClass('active');
    $('.modal-content .modal-body #upload').removeClass('active').removeClass('show');

    $('.signature_container').addClass('hovrcr_sign');
    $('.signature_container').removeClass('hovrcr_text');
    $('.signature_container').removeClass('hovrcr_date');
    $('.signature_container').removeClass('hovrcr_check');
    $('.signature_container').removeClass('hovrcr_initials');
    console.log('clicked on Signature Button')
  } 

  showCheckField = (e) => {
    e.preventDefault();
    $(e.target).addClass('current-btn');
    $('#text_field').removeClass('current-btn');
    $('#initial_field').removeClass('current-btn');
    $('#sign_pad').removeClass('current-btn');
    $('#clear_field').removeClass('current-btn');
    $('#date_field').removeClass('current-btn');

    $('.signature_container').addClass('hovrcr_check');
    $('.signature_container').removeClass('hovrcr_text');
    $('.signature_container').removeClass('hovrcr_date');
    $('.signature_container').removeClass('hovrcr_sign');
    $('.signature_container').removeClass('hovrcr_initials');
    this.state.inputFields.push('check');
  }

  clearContainer = (e) => {
    $(e.target).addClass('current-btn');
    $('.signature_container').removeClass('hovrcr_check').removeClass('hovrcr_text').removeClass('hovrcr_date').removeClass('hovrcr_sign').removeClass('hovrcr_initials');
    $('#text_field').removeClass('current-btn');
    $('#initial_field').removeClass('current-btn');
    $('#sign_pad').removeClass('current-btn');
    $('#check_field').removeClass('current-btn');
    $('#date_field').removeClass('current-btn');
    let unique = [...new Set([])];
    this.setState({inputFields:unique});
    this.setState({sign_image:null});
    this.setState({bind_signature: false});
    this.setState({sign_text: null});
    this.setState({sign_texts: {}});
    $('.signature_container').html('');
  }

  getSignPosition(top,left,doc_id){
    this.setState({top:top});
    this.setState({left:left});
    this.setState({doc_id:doc_id});
  }

  updateSignField(sign){
    this.setState({sign_image:sign});
    this.setState({bind_signature: false});
  }

  updateSignFieldType(){
    this.state.inputFields.push('sign');
  }

  saveColor = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }

  setSignFont = (font,e) => {
    this.setState({sign_font: font});
  }

  appendSignFont = (e) => {
    this.setState({sign_text: e.target.value});
    $('li.card').text(e.target.value);
    $('li.card').css('color',this.state.color);
  }

  appendSignature = (e) => {
    if(this.state.inputFields.includes('sign')){
      this.setState({bind_signature: true});
    }
    if(this.state.sign_text){
      this.state.inputFields.push('sign_text');
    }
    $('#close_btn').click();
    this.setState({active_tab:'initial'});
  }

  setSignerField = (field) => {
    this.setState({signer_field: field});
    // this.state.signer_field.push(field);
    this.state.inputFields.push('signer');
  }

  appendSignature = (e) => {
    if(this.state.inputFields.includes('sign') && this.state.active_tab == 'signpad'){
      this.setState({bind_signature: true});
    }else{
      if(this.state.sign_text && this.state.active_tab == 'initial'){
        this.setState({sign_texts: {text:this.state.sign_text,font:this.state.sign_font,color:this.state.color}});
        this.state.inputFields.push('sign_text');
      }
    }
    $('#close_btn').click();
  }

  resetTabs = (e) => {
    if(e.target.innerText == 'DRAW'){
      this.setState({active_tab:'signpad'});
    }
    if(e.target.innerText == 'TYPE'){
      this.setState({active_tab:'initial'});
    }
  }
  handleChange(e) {
    if(e.target.name == 'signer'){
      if(e.target.value){
        $('select[name="exist_signer"]').prop('disabled', true);
      }else{
        $('select[name="exist_signer"]').prop('disabled', false);
      }
    }
    if(e.target.name == 'exist_signer'){
      if(e.target.value){
        this.setState({signer_id: $(e.target).children(":selected").attr("id")});
        $('input[name="signer"]').attr('readonly','readonly');
      }else{
        $('input[name="signer"]').removeAttr('readonly');
      }
    }
    if(e.target.name == 'field_required'){
      if($(e.target).is(":checked")){
        this.setState({[e.target.name]: e.target.value});
      }else{
        this.setState({[e.target.name]: ''});
      }
    }else{
      this.setState({[e.target.name]: e.target.value});
    }
  }

  render() { console.log(this.state.signer_id)
    let dashboard = '';
    let docs = localStorage.getItem('files_array')  || this.state.docs 
    try {
      docs = JSON.parse(docs)
    }catch(e){

    }
    
    if (!localStorage.getItem('jwtToken') && !this.state.doc_for_sign) {
      return <Redirect to='/'  />
    }else{
      dashboard = <li><NavLink  className="btn" id="dashboard" to='/dashboard'>Dasboard</NavLink></li>
    }
    let required_msg = this.state.signers_err ? (<h3 className="text-center" style={{color:'red'}}>{this.state.signers_err}</h3>) : '';
    return (
      <div><header>
         <nav className="navbar navbar-expand-lg navbar-light custom-navheader navbar-fixed header-template" id="sroll-className">
      <div className="container-fluid">
        <div className="col-md-12">
          <div className="row">
            <a className="navbar-brand d-lg-block d-md-block" href="index.html"><img src="/assets/img/fina-logo.png" alt=""/></a>
            <button className="navbar-toggler hamburger-btn collapsed" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
						<div className="hamburger">
							<span></span>
							<span></span>
							<span></span>
						</div>
						<div className="cross">
							<span></span>
							<span></span>
						</div>
					</button>
            <div className="collapse navbar-collapse navigation-bar2" id="navbarCollapse">
              <ul className="navbar-nav ml-auto custom-nav">
                {/* <li className="nav-item active">
                   <a className="nav-link" href="#" target="_blank" id="pdf-download-link"><i className="fa fa-download"></i></a>
                </li> */}
                <li className="nav-item">
                   <a className="btn btn-done nav-link" onClick={this.saveData.bind(this)} href="javascript:void(0)">Save</a>
                </li>

                <li className="nav-item active">
							   <a className="nav-link save-link"  target="_blank" id="pdf-download-link" href="javascript:void(0)"><i className="material-icons">save_alt</i></a>
							</li>
							{/* <li className="nav-item dropdown notify">
								<a className="nav-link" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								  <i className="material-icons">mail_outline</i>
								  <span className="notification">5</span>
								  <p className="d-lg-none d-md-block">
									Some Actions
								  </p>
								<div className="ripple-container"></div></a>
								<div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
								  <a className="dropdown-item" href="#">Mike John responded to your email</a>
								  <a className="dropdown-item" href="#">You have 5 new tasks</a>
								  <a className="dropdown-item" href="#">You're now friend with Andrew</a>
								  <a className="dropdown-item" href="#">Another Notification</a>
								  <a className="dropdown-item" href="#">Another One</a>
								</div>
							</li> */}
							<li className="nav-item dropdown user-nv">
								<a className="nav-link profile-button" href="javascript:void(0);"data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
									<span className="avatar-status avatar-online">
										<img className="rounded-circle" src="http://162.144.215.8/~site4brandz/cphp/61/digis/content/images/avatar-1.jpg" alt="avatar" />
									</span>
									<span className="fa fa-caret-down"></span>	
								</a>
								<div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
									 <a className="dropdown-item" href="user-profile-page.html"><i className="material-icons">person_outline</i> Profile</a>
									<a className="dropdown-item" href="app-chat.html"><i className="material-icons pt-f">forum</i> Chat</a>
									<a className="dropdown-item" href="page-faq.html"><i className="material-icons">help_outline</i> Help</a>
									<a className="dropdown-item" href="user-lock-screen.html"><i className="material-icons">lock_outline</i> Lock</a>
									<a className="dropdown-item" href="user-login.html"><i className="material-icons">keyboard_tab</i> Logout</a>
								</div>
							</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
         </nav>
      </header>
      {/* style={{paddingTop:'0px'}} */}
    <div className="container-fluid main-wrapper" >
      <div className="left-sidebar">
        {(() => {
          if(!this.state.doc_for_sign){
            return (<SignerFields 
              field={this.state.inputFields}
              setSignerField={this.setSignerField.bind(this)}
            />);
          }
        })()}

        {(() => {
          if(!this.state.doc_for_sign){
            return (<ul className="btn-list">
                    <li>
                      <div id="accordion" className="inner-accordian">
                        <div className="card">
                          <div className="card-header" id="headingOne">
                            <button className="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                            Add Content to document
                            </button>
                          </div>
                          <div id="collapseOne" className="collapse  show" aria-labelledby="headingOne" data-parent="#accordion">
                            <div className="card-body">
                              <ol className="btn-mainlist">
                              {dashboard}
                                <li><a href="javascript:void(0)" id="sign_pad" className="btn sign-btn" onClick={this.showSignatureField.bind(this)} data-toggle="modal" data-target="#Signfiled"><span class="material-icons">border_color</span> Signature</a></li>
                                <li><a href="javascript:void(0)" id="text_field" className="btn" onClick={this.createTextField.bind(this)}><span class="material-icons">text_fields</span> Text</a></li>
                                <li><a href="javascript:void(0)" id="date_field" className="btn" onClick={this.createDateField.bind(this)}><span class="material-icons">insert_invitation</span> Date</a></li>
                                <li><a href="javascript:void(0)" id="initial_field" className="btn" onClick={this.showInitialField.bind(this)}><span class="material-icons">adjust</span> Initials</a></li>
                                <li><a href="javascript:void(0)" id="check_field" className="btn" onClick={this.showCheckField.bind(this)}><span class="material-icons">done_all</span> Check</a></li>
                                <li><a href="javascript:void(0)" id="clear_field" className="btn" onClick={this.clearContainer.bind(this)}>Clear</a></li>
                              </ol>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>);
          }
        })()}
      </div>
      <DropArea 
      docs={docs}
      field_type={this.state.inputFields} 
      getSignPosition={this.getSignPosition.bind(this)} 
      sign_image={this.state.sign_image} 
      sign_text={this.state.sign_text}
      sign_texts={this.state.sign_texts} 
      sign_font={this.state.sign_font} 
      sign_color={this.state.color}
      signer_field={this.state.signer_field}
      doc_for_sign={this.state.doc_for_sign}
      top={this.state.top}
      left={this.state.left}
      doc_id={this.state.doc_id}
      signer_id={this.state.signer_id}
      />
    </div>
    <div className="modal signmodal signature_modal" id="Signfiled">
	<div className="modal-dialog modal-lg">
		<div className="modal-content">
			<div className="modal-header">
				<button type="button" className="close" data-dismiss="modal">&times;</button>
				<div className="col-12 p-0 tabnav-top">
        <ul className="nav nav-tabs" id="sign_nav_tabs">
						<li className="nav-item">
							<a className="nav-link " id="type_" onClick={this.resetTabs.bind(this)} data-toggle="tab" href="#type">Type</a>
						</li>
						<li className="nav-item">
							<a className="nav-link active" id="draw_" onClick={this.resetTabs.bind(this)} data-toggle="tab" href="#draw">Draw</a>
						</li>
						<li className="nav-item">
							<a className="nav-link" id="upload_" onClick={this.resetTabs.bind(this)} data-toggle="tab" href="#upload">Upload</a>
						</li>
					</ul>
				</div>
			</div>
			<div className="modal-body">
				<div className="container-fluid">
					<div className="tab-content">
						<div className="tab-pane" id="type">
							<div className="col-12 p-0">
								<div className="col-md-12 textinput p-0">
									<input id="signatureTextInput" className="form-control" onChange={this.appendSignFont.bind(this)} placeholder="Type your name here"/>
								</div>
								<div className="col-md-12 textinput">
									<ul className="col-list">
										<li className="card prev-box preview cedarville_cursive black-txt" onClick={this.setSignFont.bind(this,'Cedarville cursive')} style={{color:this.state.color}}>Type your name here</li>
                    <li className="card prev-box preview kristi black-txt" onClick={this.setSignFont.bind(this,'Kristi')} style={{color:this.state.color}}>Type your name here</li>
                    <li className="card prev-box preview mr_dafo black-txt" onClick={this.setSignFont.bind(this,'Mr Dafoe')} style={{color:this.state.color}}>Type your name here</li>
                    <li className="card prev-box preview sacramento black-txt" onClick={this.setSignFont.bind(this,'Sacramento')} style={{color:this.state.color}}>Type your name here</li>
                    <li className="card prev-box preview montez black-txt" onClick={this.setSignFont.bind(this,'Montez')} style={{color:this.state.color}}>Type your name here</li>
                    <li className="card prev-box preview reenie_beanie black-txt" onClick={this.setSignFont.bind(this,'Reenie Beanie')} style={{color:this.state.color}}>Type your name here</li>
									</ul>
								</div>
							</div>
						</div>
						<div className="tab-pane container fade active show" id="draw">
							<div className="col-12 p-0">
								<div className="signature-area">
                  <Sign 
                    w="800" 
                    h="300" 
                    t={this.state.top} 
                    l={this.state.left} 
                    docId={this.state.doc_id} 
                    color={this.state.color}
                    bind_signature={this.state.bind_signature}
                    updateSignField={this.updateSignField.bind(this)}
                    updateSignFieldType={this.updateSignFieldType.bind(this)}
                    doc_for_sign={this.state.doc_for_sign}
                    />
								</div>
							</div>
						</div>
						<div className="tab-pane container fade" id="upload">
							<div className="col-12 p-0">
								<div className="photo-area" styl="width:100%; height:250px;">
									<div className="col-md-12 text-center imguploadwrapper">
										<p>Upload an image of your signature</p>
										<div className="upload-box">
											<input type="file" onChange={this.docUpload} />
											<label><button>Upload Signature</button></label>
										</div>
									</div>
									<p className="clear-link"><a href="javascript:void(0)" onClick={this.removeSignature.bind(this)}>clear</a></p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="modal-footer">
				<div className="row">
					<div className="col-md-6 pl-0">
						<ul className="list-inline color-list">
							<li className="black"><input name="color" value="black" type="radio" onChange={this.saveColor.bind(this)} /><label></label></li>
							<li className="blue"><input name="color" value="blue" type="radio" onChange={this.saveColor.bind(this)}/><label></label></li>
							<li className="green"><input name="color" value="green" type="radio" onChange={this.saveColor.bind(this)}/><label></label></li>
						</ul>
					</div>
					<div className="col-md-6">
						<div className="d-flex btn-block pull-right">
							<button type="button" className="btn btn-default close_btn" id="close_btn" data-dismiss="modal">Cancel</button>
							<button className="btn btn-primary btn-large" onClick={this.appendSignature.bind(this)}>Sign</button>
						</div>
					</div>
					</div>
				</div>
			</div>
		</div>
	</div>

  <div className="modal fade" id="add_signer" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                  <div className="col-md-12 col-md-offset-4">
                        <div className="panel panel-default">
                          <div className="panel-body">
                            <div className="text-center">
                                <h3><i className="fa fa-sign-in fa-4x"></i></h3>
                                <h2 className="text-center">Field Properties</h2>
                                {required_msg}
                                <div className="panel-body">
                                    <div className="form-group">
                                      <div className="input-group">
                                        <span className="input-group-addon"><i className="glyphicon glyphicon-envelope color-blue"></i></span>
                                        <input id="signer" name="signer" placeholder="Who is filling in this field?" onChange={this.handleChange} className="form-control"  type="text" />
                                      </div>
                                    </div>
                                    Or
                                    <div className="form-group">
                                      <div className="input-group">
                                        <span className="input-group-addon"><i className="glyphicon glyphicon-envelope color-blue"></i></span>
                                        <select name="exist_signer" id="exist_signer" onChange={this.handleChange}>
                                        <option value=''>Select Signer</option>
                                        {this.state.signers.map((person) => <option id={person._id} key={person._id}>{person.name}</option>)}
                                        </select>
                                      </div>
                                    </div>
                                    <div className="form-group">
                                      <div className="input-group">
                                        <label className="input-group-addon">Field Required</label>
                                        <input name="field_required" onChange={this.handleChange} className="form-control"  type="checkbox" />
                                      </div>
                                    </div>
                                    <div className="form-group">
                                      <input name="recover-submit" className="btn btn-lg btn-primary btn-block" value="Add Field" onClick={this.addField} type="button" />
                                    </div>
                                </div>
                            </div>
                          </div>
                        </div>
                  </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
       </div>
    </div>)
  }
}
// console.log(Signature)
// debugger;
export default Signature_edit;
