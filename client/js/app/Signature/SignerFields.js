import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import axios from 'src/common/myAxios';
// import DropArea from './DropArea';
// import Sign from './Sign';
// import './Signature.css';
// var html2canvas = require('html2canvas');
// import jsPDF from 'jspdf';
// import swal from 'sweetalert';
// var NavLink = require('react-router-dom').NavLink;

class SignerFields extends Component {
    constructor(props){
        super(props);
        this.state ={
          field:null,
        };
        this.createTextField = this.createTextField.bind(this);
        this.createDateField = this.createDateField.bind(this);
        this.showInitialField = this.showInitialField.bind(this);
        this.showSignatureField = this.showSignatureField.bind(this);
      }

      showSignatureField(e){
            $('#signer_sign_list').addClass('current-btn');
            $('#signer_text_list').removeClass('current-btn');
            $('#signer_initial_list').removeClass('current-btn');
            $('#signer_checkbox_list').removeClass('current-btn');
            $('#signer_radio_list').removeClass('current-btn');
        $('#signer_attach_list').removeClass('current-btn');
            // $('#check_field').removeClass('current-btn');
            // $('#clear_field').removeClass('current-btn');
            $('#signer_date_list').removeClass('current-btn');
        
            $('#text_field').removeClass('current-btn');
            $('#sign_nav_tabs .nav-item #draw_').addClass('active');
            $('#sign_nav_tabs .nav-item #type_').removeClass('active');
            $('#sign_nav_tabs .nav-item #upload_').removeClass('active');
            $('.modal-content .modal-body #draw').addClass('active').addClass('show');
            $('.modal-content .modal-body #type').removeClass('active');
            $('.modal-content .modal-body #upload').removeClass('active').removeClass('show');
            $('.signature_container').addClass('hovrcr_sign');
            $('.signature_container').removeClass('hovrcr_text');
            $('.signature_container').removeClass('hovrcr_date');
            $('.signature_container').removeClass('hovrcr_check');
            $('.signature_container').removeClass('hovrcr_initials');
      } 

      createTextField(){
        $('#signer_text_list').addClass('current-btn');
        $('#signer_date_list').removeClass('current-btn');
        $('#signer_initial_list').removeClass('current-btn');
        $('#signer_radio_list').removeClass('current-btn');
        $('#signer_attach_list').removeClass('current-btn');
        $('#signer_sign_list').removeClass('current-btn');
        $('#signer_checkbox_list').removeClass('current-btn');
        $('#check_field').removeClass('current-btn');
        $('#clear_field').removeClass('current-btn');
        
    
        $('.signature_container').addClass('hovrcr_text');
        $('.signature_container').removeClass('hovrcr_date');
        $('.signature_container').removeClass('hovrcr_initials');
        $('.signature_container').removeClass('hovrcr_check');
        $('.signature_container').removeClass('hovrcr_sign');
      }
      createDateField(e){
        $('#signer_date_list').addClass('current-btn');
        $('#signer_text_list').removeClass('current-btn');
        $('#signer_initial_list').removeClass('current-btn');
        $('#signer_attach_list').removeClass('current-btn');
        $('#signer_radio_list').removeClass('current-btn');
        $('#signer_checkbox_list').removeClass('current-btn');
        $('#signer_sign_list').removeClass('current-btn');
        $('#check_field').removeClass('current-btn');
        $('#clear_field').removeClass('current-btn');
    
        $('.signature_container').addClass('hovrcr_date');
        $('.signature_container').removeClass('hovrcr_text');
        $('.signature_container').removeClass('hovrcr_initials');
        $('.signature_container').removeClass('hovrcr_check');
        $('.signature_container').removeClass('hovrcr_sign');
      }
      showInitialField(e){
        $('#signer_initial_list').addClass('current-btn');
        $('#signer_text_list').removeClass('current-btn');
        $('#signer_checkbox_list').removeClass('current-btn');
        $('#signer_radio_list').removeClass('current-btn');
        $('#signer_sign_list').removeClass('current-btn');
        $('#signer_attach_list').removeClass('current-btn');
        $('#check_field').removeClass('current-btn');
        $('#signer_date_list').removeClass('current-btn');
    
        $('#text_field').removeClass('current-btn');
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

  showCheckField = () => {
    $('#signer_checkbox_list').addClass('current-btn');
    $('#signer_radio_list').removeClass('current-btn');
    $('#signer_attach_list').removeClass('current-btn');
    $('#signer_sign_list').removeClass('current-btn');
    $('#signer_initial_list').removeClass('current-btn');
    $('#text_field').removeClass('current-btn');
    $('#initial_field').removeClass('current-btn');
    $('#sign_pad').removeClass('current-btn');
    $('#clear_field').removeClass('current-btn');
    $('#date_field').removeClass('current-btn');
    $('#signer_date_list').removeClass('current-btn');

    $('.signature_container').addClass('hovrcr_check');
    $('.signature_container').removeClass('hovrcr_text');
    $('.signature_container').removeClass('hovrcr_date');
    $('.signature_container').removeClass('hovrcr_sign');
    $('.signature_container').removeClass('hovrcr_initials');
    console.log('clicked on Check Button')
  }

  showRadioField = () => {
    $('#signer_radio_list').addClass('current-btn');
    $('#signer_checkbox_list').removeClass('current-btn');
    $('#signer_attach_list').removeClass('current-btn');
    $('#signer_initial_list').removeClass('current-btn');
    $('#text_field').removeClass('current-btn');
    $('#initial_field').removeClass('current-btn');
    $('#signer_sign_list').removeClass('current-btn');
    $('#sign_pad').removeClass('current-btn');
    $('#clear_field').removeClass('current-btn');
    $('#date_field').removeClass('current-btn');
    $('#signer_date_list').removeClass('current-btn');

    $('.signature_container').addClass('hovrcr_check');
    $('.signature_container').removeClass('hovrcr_text');
    $('.signature_container').removeClass('hovrcr_date');
    $('.signature_container').removeClass('hovrcr_sign');
    $('.signature_container').removeClass('hovrcr_initials');
    console.log('clicked on Radio Button')
  }

  showAttachField = () => {
    $('#signer_attach_list').addClass('current-btn');
    $('#signer_radio_list').removeClass('current-btn');
    $('#signer_checkbox_list').removeClass('current-btn');
    $('#signer_initial_list').removeClass('current-btn');
    $('#signer_sign_list').removeClass('current-btn');
    $('#text_field').removeClass('current-btn');
    $('#initial_field').removeClass('current-btn');
    $('#sign_pad').removeClass('current-btn');
    $('#clear_field').removeClass('current-btn');
    $('#date_field').removeClass('current-btn');
    $('#signer_date_list').removeClass('current-btn');

    $('.signature_container').addClass('hovrcr_check');
    $('.signature_container').removeClass('hovrcr_text');
    $('.signature_container').removeClass('hovrcr_date');
    $('.signature_container').removeClass('hovrcr_sign');
    $('.signature_container').removeClass('hovrcr_initials');
    console.log('clicked on Checkbox Button')
  }

    //   onMouseDown(e){
    //     console.log("Draggable.onMouseDown");
    //     var elm = document.elementFromPoint(e.clientX, e.clientY);
    //     if( elm.className != 'resizer' ){
    //       this.props.updateStateDragging( this.props.drag_id, true );
    //     }
    //   }
    //   onMouseUp(e){
    //     console.log("Draggable.onMouseUp");
    //     this.props.updateStateDragging( this.props.drag_id, false );
    //   }
    //   onDragStart(e) {
    //     console.log("Draggable.onDragStart");
    //     const nodeStyle = this.refs.node.style;
    //     let fieldtype = this.refs.node.id.replace('_'+this.props.id, '');
    //     e.dataTransfer.setData( 'application/json', JSON.stringify({
    //       id: this.props.drag_id,
    //       fieldtype: this.props.fieldType,
    //       x: e.clientX - parseInt(nodeStyle.left),
    //       y: e.clientY - parseInt(nodeStyle.top),
    //     }));
    //   }
     onDragStart(field,e){
        console.log("Draggable.onDragStart");
        console.log(e.clientX)
        // e.dataTransfer.setData( 'application/json', JSON.stringify({
        //     fieldtype: field,
        //     x: e.clientX - parseInt(nodeStyle.left),
        //     y: e.clientY - parseInt(nodeStyle.top),
        // }));
        this.props.setSignerField(field);
      }

      setField = (field,e) => {
        e.preventDefault();
        if(field == 'text'){
          this.createTextField();
        }
        if(field=='date'){
          this.createDateField();
        }
        if(field == 'initial'){
          this.showInitialField();
        }
        if(field == 'sign'){
          this.showSignatureField();
        }
        if (field == 'checkbox') {
          this.showCheckField();
        }
        if (field == 'radio') {
          this.showRadioField();
        }
        if (field == 'attach') {
          this.showAttachField();
        }
        this.props.setSignerField(field);
      }

      render() {
        const Fields = ['sign','text','date','initial','checkbox','checkbox','radio','attach'].map((field) =>
             <li 
             key={'signer_'+field} 
             draggable="true"
             onDragStart={this.onDragStart.bind(this,field)}
             >
             <a href="javascript:void(0)" id={'signer_'+field} className="btn sign-btn" onClick={this.setField.bind(this,field)} className="btn"><span class="material-icons">border_color</span> {field.charAt(0).toUpperCase()+ field.slice(1)} Field</a>
             </li>
        );
        return <ul className="btn-list">
                <li>
                <div id="accordion" className="inner-accordian">
                    <div className="card">
                    <div className="card-header" id="headingTwo">
                        <button className="btn btn-link" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                        Add Fields for signers
                        {/* <span className="btn-helper">for signers</span> */}
                        
                        </button>
                    </div>
                    <div id="collapseTwo" className="collapse show" aria-labelledby="headingTwo" data-parent="#accordion">
                        <div className="card-body">
                        <ol className="btn-mainlist">
                        <li key={'signer_sign'} 
             draggable="true"
             onDragStart={this.onDragStart.bind(this,'sign')} class="current-btn" id={'signer_sign_list'}><a href="#" id={'signer_sign'} class="btn" onClick={this.setField.bind(this,'sign')}><span class="material-icons">border_color</span> Signature Field</a></li>
												<li key={'signer_text'} 
             draggable="true"
             onDragStart={this.onDragStart.bind(this,'text')} id={'signer_text_list'}><a href="javascript:void(0)" id={'signer_text'} class="btn" onClick={this.setField.bind(this,'text')}><span class="material-icons">text_fields</span> Text Field</a></li>
												<li key={'signer_date'} 
             draggable="true"
             onDragStart={this.onDragStart.bind(this,'date')} id={'signer_date_list'}><a href="javascript:void(0)" id={'signer_date'} class="btn" onClick={this.setField.bind(this,'date')}><span class="material-icons">insert_invitation</span> Date Field</a></li>
												<li key={'signer_initial'} 
             draggable="true"
             onDragStart={this.onDragStart.bind(this,'initial')} id={'signer_initial_list'}><a href="javascript:void(0)" id={'signer_initial'} class="btn" onClick={this.setField.bind(this,'initial')}><span class="material-icons">adjust</span> Initials Field</a></li>
												<li key={'signer_checkbox'} 
             draggable="true"
             onDragStart={this.onDragStart.bind(this,'checkbox')} id={'signer_checkbox_list'}><a href="javascript:void(0)" id={'signer_checkbox'} class="btn" onClick={this.setField.bind(this,'checkbox')} ><span class="material-icons">done_all</span> Checkbox Field</a></li>
												<li key={'signer_radio'} 
             draggable="true"
             onDragStart={this.onDragStart.bind(this,'radio')} id={'signer_radio_list'}><a href="javascript:void(0)" id={'signer_radio'} class="btn" onClick={this.setField.bind(this,'radio')}><span class="material-icons">radio_button_checked</span> Radio Fields</a></li>
												<li key={'signer_attach'} 
             draggable="true"
             onDragStart={this.onDragStart.bind(this,'attach')} id={'signer_attach_list'}><a href="javascript:void(0)" id={'signer_attach'} class="btn" onClick={this.setField.bind(this,'attach')}><span class="material-icons file-attach">attach_file</span> Attachment</a></li>
                        </ol>
                        </div>
                    </div>
                    </div>
                </div>
                </li>
            </ul>;
      }
}
SignerFields.propTypes = {
   setSignerField:PropTypes.func,
};
export default SignerFields;