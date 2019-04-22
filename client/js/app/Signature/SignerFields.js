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
        //   }));
        this.props.setSignerField(field);
      }

      setField = (field,e) => {
        e.preventDefault();
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
                        <li class="current-btn"><a href="#" id={'signer_sign'} class="btn" onClick={this.setField.bind(this,'sign')}><span class="material-icons">border_color</span> Signature Field</a></li>
												<li><a href="javascript:void(0)" id={'signer_text'} class="btn" onClick={this.setField.bind(this,'text')}><span class="material-icons">text_fields</span> Text Field</a></li>
												<li><a href="javascript:void(0)" id={'signer_date'} class="btn" onClick={this.setField.bind(this,'date')}><span class="material-icons">insert_invitation</span> Date Field</a></li>
												<li><a href="javascript:void(0)" id={'signer_initial'} class="btn" onClick={this.setField.bind(this,'initial')}><span class="material-icons">adjust</span> Initials Field</a></li>
												<li><a href="javascript:void(0)" id={'signer_checkbox'} class="btn" onClick={this.setField.bind(this,'checkbox')} ><span class="material-icons">done_all</span> Checkbox Field</a></li>
												<li><a href="javascript:void(0)" id={'signer_radio'} class="btn" onClick={this.setField.bind(this,'radio')}><span class="material-icons">radio_button_checked</span> Radio Fields</a></li>
												<li><a href="javascript:void(0)" id={'signer_attach'} class="btn" onClick={this.setField.bind(this,'attach')}><span class="material-icons file-attach">attach_file</span> Attachment</a></li>
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