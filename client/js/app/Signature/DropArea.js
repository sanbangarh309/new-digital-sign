import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Draggable.css';
// drop area Component
class DropArea extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        field_lists : [],
        list: [],
        show_field: false,
        doc_key: null,
        add_new: true,
        field_count:0,
        signer_field:null,
        items: {},
        chkduplicacy:[],
        currentNode:null,
        currentText:null,
        removeDom:null,
        allOk:false,
        attachedFile:null,
        draggable_id:null
      };
    }

    componentDidMount() {
      let list = []; 
      setTimeout(() => {
        let count = 0;
        this.props.docs.map(doc => {  
          if (doc.drag_data) {
            Object.keys(doc.drag_data).map(key => {
              list.push(doc.drag_data[key]);
              count++;
            }); 
          }
        });
        console.log(list)
        let newState = Object.assign(
          this.state, {
            items : list
          });
    
        this.setState(newState);
      }, 1000);
    }

    onDragOver(e) {
      console.log("DropArea.onDragOver");
      e.preventDefault();
      return false;
    }
    onDrop(e) {
      console.log("DropArea.onDrop");
      if(this.props.doc_for_sign){
        return; 
      }
      let fields = this.props.signer_field || '';
      let list = this.state.items; 
      try {
        var obj = JSON.parse(e.dataTransfer.getData('application/json'));
        // let list = this.state.list;
        if(list){
          list[obj.id].isDragging = false;
          list[obj.id].top  = (e.clientY - obj.y);
          list[obj.id].left = (e.clientX - obj.x);
        }else{
          list = {};
        }
      }catch(e){
        var obj = {};
        let list = {};
      }

      if(list){
        let newState = Object.assign(
          this.state, {
            items : list
          });

        this.setState(newState);
    }
      e.preventDefault();
    }
    updateStateDragging( id, isDragging){ 
      let list = this.state.items; 
      // let index = this.state.field_lists.findIndex((item) => item.id == id);
      if(list[id]){
        list[id].isDragging = isDragging;   
        let newState = Object.assign(
          this.state, {
            items : list
          });
        this.setState(newState);
      }
    }
    updateStateResizing( id, isResizing){
      let list = this.state.items;
      // let index = this.state.list.findIndex((item) => item.id == id);
      if(list[id]){
        list[id].isResizing = isResizing;
        let newState = Object.assign(
          this.state, {
            items : list
          });
        this.setState(newState);
      }
    }
    funcResizing(id, clientX, clientY, field='',docId=''){
      if(this.props.doc_for_sign){
        return; 
      }
      if(docId){
        this.state.doc_key = docId;
      }
      let element = this.refs[field+'_'+ this.state.doc_key+'_'+ id];
      let list = this.state.items;
      let position = element.refs.node.getBoundingClientRect();
      let w = clientX - position.left + (16 / 2);
      let h = clientY - position.top  + (16 / 2);
      list[id].width =   w;
      list[id].height =  h;
      list[id].fontSize = parseFloat(list[id].height/2.5);
      let newState = Object.assign(
        this.state, {
          items : list
        });
      this.setState(newState);
    }
    pasteSelectedField(e){
      if (!e.target.className.includes('checkbox') && !e.target.className.includes('attach') && e.target.nodeName != 'INPUT') {
        console.log('prevent Default')
        e.preventDefault(); 
      }
      
      this.setState({currentNode:e.target.nodeName});
      this.setState({currentText:e.target.innerText});
      let doc_id = $(e.target).parents('div.unselectable').last().attr('data-docId');
      let draggable_id = $(e.target).parents('div.unselectable').last().attr('data-dragId');
      let key___ = '';
      // let draggable_id = '';
      doc_id = (doc_id ? doc_id : e.target.id.replace(/[^\d.]/g, '')) || 1;
      console.log(doc_id);
      console.log(draggable_id);
      if (e.target.nodeName == 'SPAN' || e.target.className.includes('preventClicking') || e.target.nodeName == 'INPUT') {
        // let parentElId = '';
        // let draggableElId = ''
        //   // || e.target.className.includes('attach')
        // if (e.target.className.includes('checkbox') || e.target.className.includes('checkwrap') || (e.target.className.includes('attach') && e.target.nodeName != 'INPUT')) {
        //   doc_id = e.target.parentElement.parentElement.parentElement.id.replace(/[^\d.]/g, '');
        //   draggable_id = e.target.parentElement.parentElement.id.charAt(e.target.parentElement.parentElement.id.length - 1);
        // }else{
        //   doc_id = e.target.parentElement.parentElement.id.replace(/[^\d.]/g, '');
        //   draggable_id = e.target.parentElement.id.charAt(e.target.parentElement.id.length - 1);
        // }
        // if (e.target.nodeName == 'INPUT' && e.target.className.includes('attach')) {
        //   doc_id = e.target.parentElement.parentElement.parentElement.parentElement.id.replace(/[^\d.]/g, '');
        //   draggable_id = e.target.parentElement.parentElement.parentElement.id.charAt(e.target.parentElement.parentElement.parentElement.id.length - 1);
        // }
        // if (draggableElId) {
        //   draggable_id = draggableElId.charAt(draggableElId.length - 1); //draggableElId[draggableElId.length - 1];
        // }
         
        // doc_id = parentElId.replace(/[^\d.]/g, '');
        // if (e.target.nodeName == 'INPUT' && this.props.doc_for_sign) {
        //   if (e.target.type = 'checkbox' && e.target.checked) {
        //     this.props.checkAllOk(draggable_id);
        //     // return; 
        //   }else{
        //     this.props.checkAllOk(draggable_id);
        //   }
        // }
        if (this.props.doc_for_sign) {
          this.props.checkAllOk(draggable_id);
        }
      }
      if (e.target.className.includes('attach') || $.trim(e.target.className) == 'attach') {
        if (e.target.lastChild) {
          console.log(e.target.lastChild);
          e.target.lastChild.click();
          return;
        }
      }
      // if (e.target.className.includes(this.props.doc_for_sign)) {
      //   let parentElId = $(e.target).parent().attr('id');
      //   draggable_id = $(e.target).attr('id');
      //   draggable_id = draggable_id.charAt(draggable_id.length - 1); //draggable_id[draggable_id.length - 1];
      //   doc_id = parentElId.replace(/[^\d.]/g, '');
      // }
      // if (this.props.doc_for_sign) {
      //   this.props.docs.map(doc => {
      //     Object.keys(doc.drag_data).map(key => {
      //       if (doc.drag_data[key].type == 'signer_added' && doc.drag_data[key].signer_id == this.props.doc_for_sign) {
      //         let currentTarget = $('#' + doc.drag_data[key].content + '_doc_' + doc.drag_data[key].doc_id + '_' + doc.drag_data[key].id);
      //         switch (doc.drag_data[key].content) {
      //           case 'checkbox':
      //             if (currentTarget.find('input[type="checkbox"]:checked').length > 0) {
      //               this.setState({allOk:true});
      //             }else{
      //               console.log('not checked')
      //               this.setState({ allOk: false });
      //             }
      //             break;

      //           case 'text':
      //             if (currentTarget.find('input[type="text"]').val() != '' && currentTarget.find('input[type="text"]').val() != 'undefined') {
      //               this.setState({ allOk: true });
      //             } else {
      //               this.setState({ allOk: false });
      //             }
      //             break;
              
      //           default:
      //             break;
      //         }
      //         // console.log(doc.drag_data[key])
      //         // console.log('#' + doc.drag_data[key].content+'_doc_' + doc.drag_data[key].doc_id + '_' + doc.drag_data[key].id);
      //         // console.log($('#' + doc.drag_data[key].content +'_doc_' + doc.drag_data[key].doc_id + '_' + doc.drag_data[key].id));
      //       }
      //     });
      //   });
      //   this.props.checkAllOk(this.state.allOk);
      // }
      if(this.props.doc_for_sign && (e.target.nodeName == 'SPAN' || e.target.className.includes('signer_added'))){
        this.state.draggable_id = draggable_id ? draggable_id : '';
        if (e.target.className.includes('signer_added')) {
          this.state.removeDom = e.target;
          this.props.getSignPosition(e.target.style.top, e.target.style.left, doc_id);
        } else {
          this.state.removeDom = e.target.parentElement;
          this.props.getSignPosition(e.target.parentElement.style.top, e.target.parentElement.style.left, doc_id);
        }
        if(e.target.innerText.trim().includes("initial")){
          key___ = 'sign_text';
          this.props.showInitialField(e);
          $('#Signfiled').modal('show');
          return;
        }
        if(e.target.innerText.trim().includes("sign")){
          key___ = 'sign';
          this.props.showSignatureField(e);
          $('#Signfiled').modal('show');
          return;
        }
        // if(e.target.innerText.trim().includes("text")){
        //   e.target.parentElement.remove();
        //   key___ = e.target.innerText.trim();
        // }
        // if(e.target.innerText.trim().includes("date")){
        //   e.target.parentElement.remove();
        //   key___ = e.target.innerText.trim();
        // }
        if(e.target.innerText.trim().includes("check")){
          // e.target.parentElement.remove();
          key___ = 'check';
        }
        // e.target.parentElement.remove();
        // $('#Signfiled').modal('show'); 
      }
      if(this.props.doc_for_sign && this.props.field_type.length <=0 && e.target.className.includes('signature_container')){
        return;
      }
      if(this.props.doc_for_sign && this.props.field_type.includes('initials') && !this.props.field_type.includes('sign_text')){
        return;
      }
      // for(var value of e.target.classList.values()) {
      //   console.log(value);
      // }
      if ((!e.target.className.includes('btn-removebox1') && !e.target.className.includes('form-control') && !e.target.className.includes('unselectable') && !e.target.className.includes('sign_image') && !e.target.className.includes('resizer') && !e.target.className.includes('preventClicking') && !e.target.className.includes('attach') && e.target.nodeName != 'INPUT') || key___ !=''){
        console.log('new element created')
        this.setState({add_new:true});
        let position = e.target.getBoundingClientRect();
        var x = e.clientX - position.left; //x position within the element.
        var y = e.clientY - position.top;
        let h = 70;
        let w = 100;
        let alreday = false;
        let list = this.state.items; 
        let key___c = [];
        if(key___ == ''){
          key___c = this.props.field_type.slice(this.props.field_type.length - 1);
          key___ = key___c[0];
        }
        if(key___ == 'sign' || (this.props.doc_for_sign && e.target.parentElement.style.top)){
          this.props.getSignPosition(e.target.parentElement.style.top,e.target.parentElement.style.left,doc_id);
          if(this.props.doc_for_sign && e.target.parentElement.style.top){
            y = e.target.parentElement.style.top;
            x = e.target.parentElement.style.left;
          }
          // if(key___ == 'text'){
          //   w = 230
          //   h = 40 
          // }
        }else if(key___ != 'signer_added'){
          this.props.getSignPosition(y-28,x,doc_id);
        }
        
        if(key___ == 'sign_text' && this.props.doc_for_sign){
          y = this.props.top;
          x = this.props.left;
          var index = this.props.field_type.indexOf('sign_text');
          var index2 = this.props.field_type.indexOf('initials');
          if (index > -1) {
            this.props.checkAllOk(this.state.draggable_id);
            this.state.removeDom.remove();
            this.props.field_type.splice(index, 1);
            this.props.field_type.splice(index2, 1);
          }
        } 
        if (key___ == 'sign' && this.props.doc_for_sign) {
          y = this.props.top;
          x = this.props.left;
          var index = this.props.field_type.indexOf('sign');
          if (index > -1) {
            this.props.checkAllOk(this.state.draggable_id);
            this.state.removeDom.remove();
            this.props.field_type.splice(index, 1);
          }
        } 
        if(key___ == 'signer'){
          this.props.refreshSigners(doc_id);
          $('#add_signer').modal('show');
          $('#add_signer input#signer').val('');
          $('#add_signer select#exist_signer').val('');
          $('#add_signer input#signer').removeAttr('readonly');
          $('#add_signer select#exist_signer').prop('disabled', false);
          $("#add_signer  input[name='field_required']").prop("checked", false);
          return false;
        }
        if(key___c == 'initials' && !this.props.doc_for_sign){
          $('#Signfiled').modal('show');
        }
       
        if(key___c.length <= 0 && !this.props.doc_for_sign){
          this.props.updateTab('signpad');
          $('#Signfiled').modal('show');
          return;
        }
        
        if(e.target.nodeName == 'SPAN' &&  !this.props.doc_for_sign){
          key___ = e.target.innerText;
        }
        
        for(let res of Object.keys(list)){
          if(res.top == y && res.left == x){
            alreday = true;
          }
          if(this.state.chkduplicacy.indexOf(this.state.field_count) > -1){  
            alreday = true;
          }
          // if(res.isDragging || res.isResizing){
          //   alreday = true;
          // }
        }
        let newobj = {};
          if(this.props.doc_for_sign && key___ =='sign'){
            let new_list = [];
            Object.keys(this.state.items).map(key => {
              if(this.state.items[key].type =='signer' && this.state.items[key].content == 'sign'){  
              }else{
                new_list.push(this.state.items[key]);
              }
            });
            Object.assign(newobj, new_list);
            this.setState({items:newobj});
          }
        let fontsize = '1.2vw';
        if(key___ == 'text'){
          fontsize = '2.2vw';
        }
        if(!x && !y){
          return;
        } 
        
        if(!alreday){ 
          // this.setState((state) => ({ field_count: state.field_count + 1})); 
          let items = []
          let text = '';
          if(key___ == 'signer_added'){
            if(this.props.first_attempt){
              x = this.props.left
              y = this.props.top
              this.props.closeAttempt();
            }else{
              y = y-28;
            }
            
            text = this.props.signer_field;
            w = 140;
            h = 30;
            fontsize = '1.0vw'; 
            if (text == 'checkbox') {
              text = '✔';
              w = 20;
              h = 22;
            }
          }
          if(key___ == 'date'){
            w = 100;
            h = 50;
            fontsize = '1.4vw';
            y = y - 50;
          }
          if(key___ == 'sign_text'){
            w = 230;
            h = 60;
            if (this.props.doc_for_sign) {
              x = parseFloat(x) - 30;
              y = parseFloat(y) - 30;
            }else{
              y = parseFloat(y) - parseFloat(h);
            }
            fontsize = '2.8vw';
          }
          if(key___ == 'check'){
            w = 20;
            h = 20;
            y = y - 30;
          }
          if(key___ == 'text'){
            w = 33;
            h = 40;
            y = parseFloat(y) - 40;
          }
          if (key___ == 'signer_added' && text == 'radio') {
            w = '32px';
            text = (<img src={'/assets/img/radio_inactive.png'}></img>);
          }
          let clr = null;
          let txt = null;
          let fnt = null;
          if(this.props.sign_texts){
            clr = this.props.sign_texts.color;
            txt = this.props.sign_texts.text;
            fnt = this.props.sign_texts.font;
          }
          if(key___ == 'sign' && this.props.sign_image && this.props.sign_image.canvas){
            w = this.props.sign_image.canvas.width;
            // h = this.props.sign_image.canvas.height;
            h = '64px';
            if (!this.props.first_attempt) {
              y = parseFloat(y) - 64;
            } else {
              this.props.closeAttempt();
            }
          }
          if(key___ == 'sign' && this.props.sign_image && this.props.isResizing){
            w = this.props.width;
            h = this.props.height;
          }
          let listArray = [];
          if(Object.prototype.toString.call(list) === '[object Object]'){
            listArray = Object.keys(list).map(i => list[i]);
          }else{
            listArray = list; 
          }
          // this.state.field_lists.push({ id: this.state.field_count, isDragging: false, isResizing: false, top:y, left: x,width:w, height:h, fontSize:fontsize,isHide:false, type:key___,appendOn:false,content:text,doc_id:doc_id,required:this.props.field_required,sign_img:this.props.sign_image,sign_text:txt,sign_font:fnt,sign_color:clr,signer_id:this.props.signer_id});
          listArray.push({ id: this.state.field_count, isDragging: false, isResizing: false, top: y, left: x, width: w, height: h, fontSize: fontsize, isHide: false, type: key___, appendOn: false, content: text, doc_id: doc_id, required: this.props.field_required, sign_img: this.props.sign_image, sign_text: txt, sign_font: fnt, sign_color: clr, signer_id: this.props.signer_id, signer_clr: this.props.signer_clr,attach_img: null});  
          Object.assign(newobj, listArray);
          this.setState({show_field:true});
          if(e.target.id && e.target.id !=''){
            this.setState({doc_key:doc_id});
          }
          this.setState({items:newobj});
        }
      }else{
        this.setState({add_new:false});
      }
      // debugger;
    }
  getBase64 = (file, id) => {
    // this.setState({ file_name: file.name});
    const newState = Object.keys(this.state).reduce((result, key) => {
      // conditionally set value of result
      result[key] = key.startsWith('attached_name_' + id) ? file.name : this.state[key];
      return result;
    }, {});
    this.setState(newState);
    localStorage.setItem('attached_name_' + id, file.name);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

    uploadImage = (id,e) => {
      const file = e.target.files[0];
      const objThis = e.target;
      this.getBase64(file, id).then(base64 => {
        objThis.parentElement.setAttribute("data-src", base64);
      });
    }

    removeFieldBox(id,doc_id){
      if(this.props.doc_for_sign){
        return; 
      }
      let list = this.state.items;
      delete list[id];
      // delete this.state.field_lists[id];
      let newState = Object.assign(
        this.state, {
          items : list
      });
      this.setState(newState);
    }

    render() {
      let DropJgah = []
      let dropjgah_classes = ['drop-area', 'container', 'doc-bg', 'signature_container'];
      if(!this.props.doc_for_sign){
        dropjgah_classes.push('hovrcr_sign');
      }
      let key_ = 1;
      const total_page = this.props.docs.length;
      let fields = this.state.items;
      this.props.docs.map(doc => {
        let items = [];
        let back_style = {
          width:  doc.w,
          height: doc.h,
          backgroundImage:"url(/files/docs/" + doc.name + ")"
        };
        if (this.props.template_id){
          back_style['backgroundImage'] = "url(/files/templates/" + doc.name + ")";
        }
        // console.log(this.state.doc_key);
        // if((this.state.doc_key == key_) || doc.drag_data){
        Object.keys(fields).map(key => {
            if (!fields[key].isHide && fields[key].doc_id == key_){ 
                if(this.state.chkduplicacy.includes(key)){
                  // delete this.state.list[fields[key].id];
                 
                  // if(!this.state.add_new){
                    // $('#'+fields[key].type+'_doc_'+key_+'_'+key).remove();
                  // }
                }else{
                  this.state.chkduplicacy.push(key);
                  this.state.field_count = this.state.field_count+1;
                    // console.log('current:key- '+this.state.doc_key);
                    // console.log('org:key- '+key_);
                }
                // console.log(fields[key])
                // let signimg = '';
                // if(fields[key].type == 'sign'){
                //   signimg = fields[key].sign_img;
                // }
                items.push(
                  <Draggable 
                    ref={fields[key].type +'_'+key_+'_'+ key}
                    key={key}
                    drag_id={key}
                    id={'doc_'+key_+'_'+key}
                    docId={key_}
                    fieldType={fields[key].type}
                    signer_field={fields[key].content}
                    sign_image={fields[key].sign_img}
                    field_required={fields[key].required}
                    sign_text={fields[key].sign_text}
                    sign_font={fields[key].sign_font}
                    sign_color={fields[key].sign_color}
                    signer_id={fields[key].signer_id}
                    top={fields[key].top}
                    left={fields[key].left}
                    width={fields[key].width}
                    height={fields[key].height}
                    fontSize={fields[key].fontSize}
                    isDragging={fields[key].isDragging}
                    isResizing={fields[key].isResizing}
                    updateStateDragging={this.updateStateDragging.bind(this)}
                    updateStateResizing={this.updateStateResizing.bind(this)}
                    funcResizing={this.funcResizing.bind(this)}
                    removeFieldBox={this.removeFieldBox.bind(this)}
                    pasteSelectedField={this.pasteSelectedField.bind(this)}
                    uploadImage={this.uploadImage.bind(this)}
                    doc_for_sign={this.props.doc_for_sign}
                    currentNode={this.state.currentNode}
                    currentText={this.state.currentText}
                    signer_clr={fields[key].signer_clr}
                    allOk={this.props.allOk}
                    edit_id={this.props.edit_id}
                  />
                );
            }
          });
          
        DropJgah.push(<div><div className="pageNumber">Page {key_} of {total_page}</div><div
            className={dropjgah_classes.join(' ')} 
            onDragOver={this.onDragOver.bind(this)}
            id={'signature_container_'+key_}
            onDrop={this.onDrop.bind(this)} 
            style = {back_style}
            onClick={(e) =>{this.pasteSelectedField(e)}}
            >
            {items}
        </div></div>)
        // }else{
        //   DropJgah.push(<div
        //     className={dropjgah_classes.join(' ')}
        //     onDragOver={this.onDragOver.bind(this)}
        //     id={'signature_container_'+key_}
        //     onDrop={this.onDrop.bind(this)} 
        //     style = {back_style}
        //     onClick={(e) =>{this.pasteSelectedField(e)}}
        //     >
        //   </div>)
        // }
        
        key_++;
      });
      
      return (
        <div className="right-maintemplate" key="1">
        {DropJgah}
        </div>
      );
    }
  };
  
  
  // draggable Component
  class Draggable extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        resized_div : [],
        checked: true
      }
    }
    onMouseDown(e){
      console.log("Draggable.onMouseDown");
      var elm = document.elementFromPoint(e.clientX, e.clientY);
      if( elm.className != 'resizer' ){
        this.props.updateStateDragging( this.props.drag_id, true );
      }
    }
    onMouseUp(e){
      console.log("Draggable.onMouseUp");
      // if(e.target.className == 'round-sml btn-removebox1'){ 
      //   this.removeField(e);
      // }
      this.props.updateStateDragging( this.props.drag_id, false );
      // if(this.props.fieldType =='signer' && this.props.doc_for_sign){
      //   this.props.pasteSelectedField(e);
      // }
    }
    onDragStart(e) {
      console.log("Draggable.onDragStart");
      const nodeStyle = this.refs.node.style;
      let fieldtype = this.refs.node.id.replace('_'+this.props.id, '');
      e.dataTransfer.setData( 'application/json', JSON.stringify({
        id: this.props.drag_id,
        fieldtype: this.props.fieldType,
        x: e.clientX - parseInt(nodeStyle.left),
        y: e.clientY - parseInt(nodeStyle.top),
      }));
    }
    onDragEnd(e){
      console.log("Draggable.onDragEnd");
      this.props.updateStateDragging( this.props.drag_id, false );
    }

    removeField(e){
      this.props.removeFieldBox(this.props.drag_id,this.props.docId)
    }

    adjustWidth = (docid, e) => {
      var of = $(e.target.parentElement).offset(),
        left = of.left;
      if ((parseInt(((e.target.value.length + 1) * 22)) + parseInt(left)) <= 1340) {
        if (e.target.hasAttribute('maxLength')) {
          e.target.removeAttribute("maxLength");
        }
        e.target.parentElement.style.width = ((e.target.value.length + 1) * 22) + 'px';
        e.target.style.width = ((e.target.value.length + 1) * 22) + 'px';
      }else{
        if (!e.target.hasAttribute('maxLength')){
          $(e.target).attr('maxLength', (e.target.value.length + 1));
        }
      }
    }

    componentWillMount(){
      this.resizeContents(".class_"+this.props.fieldType,'#'+this.props.fieldType+'_' + this.props.id);
    }

    componentDidMount() {
      console.log(this.props.allOk)
      if (this.props.doc_for_sign && this.props.allOk) {
        console.log($('#' + this.props.fieldType_ + '_doc_' + this.props.docId + '_' + this.props.id).find('#' + this.props.doc_for_sign))
        $('#' + this.props.fieldType_ + '_doc_' + this.props.docId + '_' + this.props.id).find('#' + this.props.doc_for_sign).css('border', 'none !important');
        // styles['background'] = 'transparent';
        // boxeStyle['display'] = 'none';
        // cusstyle['border'] = 'none !important';
        // labelCss['border'] = 'none !important';
      }
    }

    handleCheck = (e) => {
      this.setState({
        checked: e.target.checked
      })
    }
    
    resizeContents(text,parent) {
          if (text != '') {
            // $('.text-fitter').css('font-size', 'medium');
            var w1 = 230;
            var w2 = 230;
            var wRatio = Math.round(w1 / w2 * 10) / 10;
        
            var h1 = 60-10;
            var h2 = 100;
            var hRatio = Math.round(h1 / h2 * 10) / 10;
        
            var constraint = Math.min(wRatio, hRatio);
            // $(text).css('font-size', constraint + 'em');
          }
  }

    render() {
      let dateField = ''
      let styles = {
        top:    this.props.top,
        left:   this.props.left,
        width:  this.props.width,
        height: this.props.height,
        fontSize: this.props.fontSize,
        textAlign: 'center',
        display:'table'
      };
      let cusstyle = {
          width: '100%',
          height: '100%',
          maxHeight: '100%',
          maxWidth: '100%',
          background: 'transparent',
          outline: 'none',
          color: '#000',
          padding: '5px',
          margin: '0px',
          resize: 'none',
          overflow: 'hidden',
          fontSize:this.props.fontSize,
          position:'relative',
          cursor: 'move',
          textAlign: 'center',
          border: 'none!important',
          borderColor:'transparent'
      }
    let boxeStyle = {
      zIndex:'90',
    }
    let textstyle = {
      color: 'white'
    }
    
    let field = this.props.fieldType;
    let signer_field = this.props.signer_field ;
    if (field == 'text') {
      cusstyle['height'] = this.props.height;
      dateField = signer_field;
      if (!signer_field && signer_field =='') {
        styles['width'] = '33px';
      }
      cusstyle['textAlign'] = 'left';
    }
    if (this.props.signer_clr && (field == 'signer_added' || field == 'radio')){
      styles['backgroundColor'] = this.props.signer_clr;
    }
    if (this.props.edit_id && field == 'signer_added' && this.props.sign_image && this.props.sign_image.includes('radio_inactive.png')) {
        signer_field = (<img src={'/assets/img/radio_inactive.png'}></img>)
        cusstyle['cursor'] = 'pointer';
        cusstyle['WebkitAppearance'] = 'pointer';
    }
      if (this.props.doc_for_sign && field == 'signer_added' && this.props.sign_image && this.props.sign_image.includes('radio_inactive.png')) {
      field = 'radio';
    }
    if(this.props.doc_for_sign && field == 'signer_added'){
      if (signer_field == 'text'){
        field = 'text';
        cusstyle['cursor'] = 'pointer';
        styles['width'] = '33px';
      }
      if (signer_field == 'date'){
        field = 'date';
      }
      if (signer_field == '✔'){
        field = 'checkbox';
        boxeStyle['display'] = 'none';
        styles['width'] = this.props.width;
        styles['height'] = this.props.height;
        cusstyle['cursor'] = 'pointer';
        cusstyle['WebkitAppearance'] = 'pointer';
      }
      textstyle['color'] = 'black';
    }
    let datadtype = 'text';
    if(field == 'date'){
      datadtype = 'date;'
      var date = new Date().getDate();
      var month = new Date().getMonth() + 1;
      var year = new Date().getFullYear();
      dateField = month + '/' + date + '/' + year;
    }
    let sign_image_style = {};
    let img_src = this.props.sign_image ? (this.props.sign_image.src || this.props.sign_image) : '';
    if(field == 'sign' && this.props.sign_image && !this.state.resized_div.includes(field+'_' + this.props.id)){ 
      if(this.props.sign_image.canvas){
        // styles['width'] = this.props.sign_image.canvas.width;
        // styles['height'] = this.props.sign_image.canvas.height;
        img_src = this.props.sign_image.src;  
      }else{
        img_src = this.props.sign_image;
      }
      this.state.resized_div.push(field+'_' + this.props.id);
    }
      sign_image_style = { width: this.props.width, height: this.props.height };
    // if(this.props.fieldType == 'sign' && this.props.sign_image && this.props.isResizing){
    //   styles['width'] = this.props.width;
    //   styles['height'] = this.props.height;
    // }
    // if(this.props.fieldType == 'check'){
    //   // styles['width'] = '60px';
    //   // styles['height'] = '60px';
    // }
   
    if(field == 'sign_text'){
      dateField = this.props.sign_text;
      cusstyle['fontFamily'] = this.props.sign_font;
      cusstyle['color'] = this.props.sign_color;
      cusstyle['padding'] = '10px';
      cusstyle['margin'] = '3px';
      // cusstyle['fontSize'] = (50-parseInt(this.props.sign_text.length))+'px';
      cusstyle['width'] = this.props.width;
      cusstyle['height'] = this.props.height;
      // styles['width'] = '230px';
      // styles['height'] = '60px';
    }
    // if(this.props.fieldType == 'sign'){
    //   let field_ = this.props.sign_image;
    // }else{
    //   let field_ = <textarea className="form-control" defaultValue={dateField} style={cusstyle}></textarea>;
    // }
    // console.log(field)
    // console.log(this.props.signer_field)
    if((field == 'signer_added' || field == 'signer') && this.props.currentNode !='SPAN'){
      // styles['width'] = this.props.isResizing ? this.props.width : '230px';
      // textstyle['fontSize'] = '2.8vw';
      // textstyle['marginLeft'] = '7px';
      textstyle['width'] = this.props.width;
      textstyle['height'] = this.props.height;
    }
    
      if(this.props.doc_for_sign && this.props.currentNode =='SPAN' && this.props.currentText == 'text'){ 
        // this.props.fieldType = 'text';
        // this.props.signer_field = '';
      }
      let chkStyle = {width:this.props.width,height:this.props.height};

      if(this.props.doc_for_sign && (field == 'sign' || field == 'check' || field == 'sign_text' || field == 'date')){
        styles['background'] = 'transparent';
        boxeStyle['display'] = 'none';
        styles['pointerEvents'] = 'none';
      }else if(this.props.doc_for_sign){
        styles['background'] = 'rgba(34, 176, 20, 0.2)';
      }
      if(this.props.doc_for_sign && this.props.doc_for_sign != this.props.signer_id && !['sign','check','sign_text'].includes(field)){                    
        styles['display'] = 'none';
      }
      // if (this.props.doc_for_sign && this.props.doc_for_sign != this.props.signer_id && field == 'text') {
      //   styles['display'] = 'none';
      // }
      // console.log(field);
      if (this.props.doc_for_sign && this.props.doc_for_sign == this.props.signer_id && field == 'text'){
        // cusstyle['flexWrap'] = 'nowrap';
        cusstyle['textOverflow'] = 'ellipsis';
        cusstyle['whiteSpace'] = 'ellipsis';
        // cusstyle['textAlign'] = 'left';
        // cusstyle['minHeight'] = 'inherit';
        // cusstyle['maxHeight'] = '50px';
        // cusstyle['height'] = '48px';
        cusstyle['fontSize'] = '33.8px';
        styles['display'] = 'flex';
        styles['height'] = '40px';
        // styles['background'] = 'transparent';
      }
      let labelCss = {};
      if (this.props.doc_for_sign && this.props.allOk) {
        styles['background'] = 'transparent';
        boxeStyle['display'] = 'none';
        labelCss['border'] = 'none !important';
      }
      // if (this.props.doc_for_sign && field == 'checkbox') {
      //   styles['width'] = '40px';
      //   styles['height'] = '30px';
      //   cusstyle['width'] = '40px';
      //   cusstyle['height'] = '30px';
      // }
      // console.log(field + ':- '+this.props.signer_id)
      // let draggable = "true";
      // // {this.props.isDragging}
      // if(this.props.isResizing){
      //   draggable = "false";
      // }
      // class={"signer_field_"+this.props.fieldType+'_' + this.props.id}
      // style={{width:this.props.width,height:this.props.height}}
      // let draggable = this.props.isDragging;
      // if(this.props.doc_for_sign){
      //   draggable = "false";
      // }
      let extra_class = '';
      if (this.props.doc_for_sign && this.props.allOk) {
        extra_class = 'signed_done';
      }
      if (this.props.doc_for_sign) {
        boxeStyle['display'] = 'none';
      }
      if (this.props.doc_for_sign && signer_field == 'attach') {
        field = signer_field;
        if (localStorage.getItem('attached_name_'+this.props.id)){
          signer_field = localStorage.getItem('attached_name_' + this.props.id);
        }
      }
      sign_image_style['height'] = '64px';
      console.log(field+'  '+this.props.signer_id);
      return (
        <div className={"text-field-box item unselectable "+field+' '+this.props.signer_id+' '+this.props.field_required}
          ref={"node"}
          data-id={field}
          data-docId={this.props.docId}
          data-dragId={this.props.drag_id}
          data-color={this.props.signer_clr}
          draggable= {this.props.doc_for_sign ? "false" : this.props.isDragging}
          id={ field+'_' + this.props.id }
          fieldtype={field}
          onMouseDown={this.props.doc_for_sign ? false : this.onMouseDown.bind(this)}
          onMouseUp={this.props.doc_for_sign ? false : this.onMouseUp.bind(this)}
          onDragStart={this.props.doc_for_sign ? false : this.onDragStart.bind(this)}
          onDragEnd={this.props.doc_for_sign ? false : this.onDragEnd.bind(this)} 
          style={styles}>
          {(() => {
            // onKeyDown = { this.adjustWidth.bind(this) }
            // <img src={'/assets/img/checkmark.png'} class={"preventClicking " + extra_class} id={this.props.doc_for_sign ? this.props.signer_id : this.props.drag_id} style={chkStyle}></img>
            switch (field) { 
              case "sign": return (<img src={img_src} className={"preventClicking "+extra_class} id={this.props.doc_for_sign ? this.props.signer_id : this.props.drag_id} style={sign_image_style}></img>);
              case "check": return (<img src={'/assets/img/checkmark.png'} class={"preventClicking " + extra_class} id={this.props.doc_for_sign ? this.props.signer_id : this.props.drag_id} style={chkStyle}></img>);
              case "signer_added": return (<span className={"preventClicking " + this.props.field_required + " " + extra_class} id={this.props.signer_id} style={textstyle}>{signer_field}</span>);
              case "signer": return (<span className={"preventClicking " + this.props.field_required + " " + extra_class} id={this.props.signer_id} style={textstyle}>{signer_field}</span>);
              case "sign_text": return (<span style={cusstyle} class={"class_" + field + " preventClicking " + extra_class} id={this.props.doc_for_sign ? this.props.signer_id : this.props.drag_id}>{this.props.sign_text}</span>);
              case "checkbox": return (<div className="checkwrap"><input type="checkbox" className={"class_" + field + " preventClicking " + extra_class} id={this.props.doc_for_sign ? this.props.signer_id : this.props.drag_id} style={cusstyle} /><label style={labelCss}></label></div>);
              case "radio": return (<input type="radio" name="custom_checkboxes" className={"class_" + field + " preventClicking " + extra_class} id={this.props.doc_for_sign ? this.props.signer_id : this.props.drag_id} style={cusstyle} />);
              case "attach": return (<div className="attach"><span className={"preventClicking attach " + this.props.field_required + " " + extra_class} id={this.props.signer_id} style={textstyle}>{signer_field}<input type="file" className="attach" onChange={this.props.uploadImage.bind(this,this.props.id)} accept="image/*" style={{ opacity: 0, width: '0px', height: '0px'}} /></span></div>)
              // default: return (<textarea rows="1" className={"form-control "+this.props.field_required} onKeyDown={this.adjustWidth.bind(this)} id={this.props.drag_id} placeholder={field} defaultValue={dateField} style={cusstyle}></textarea>);
              default: return (<input type={datadtype} className={this.props.field_required + " " + extra_class} onKeyPress={this.adjustWidth.bind(this, this.props.docId)} id={this.props.doc_for_sign ? this.props.signer_id : this.props.drag_id} placeholder={field} defaultValue={dateField} style={cusstyle} />);
            }
          })()}
          <div className="round-sml btn-removebox1" onClick={this.removeField.bind(this)} style={boxeStyle}>✕</div>
          <div className="round-sml ui-resizable-handle ui-resizable-nw" style={boxeStyle}></div>
          <div className="round-sml ui-resizable-handle ui-resizable-sw" style={boxeStyle}></div>
          <div className="round-sml ui-resizable-handle ui-resizable-se" style={boxeStyle}></div>
          {(() => {
            if(!this.props.doc_for_sign){
              return (<Resizer
                ref={"resizerNode"}
                id={this.props.id}
                drag_id={this.props.drag_id}
                docId={this.props.docId}
                isResizing={this.props.isResizing}
                fieldtype={field}
                doc_for_sign={this.props.doc_for_sign}
                resizerWidth={16}
                resizerHeight={16}
                updateStateResizing={this.props.updateStateResizing}
                funcResizing={this.props.funcResizing} />);
            }
          })()}
        
      </div>
      );
    }
  };
  Draggable.propTypes = {
      id:         PropTypes.string.isRequired,
      isDragging: PropTypes.bool.isRequired,
      isResizing: PropTypes.bool.isRequired,
      top:        PropTypes.number.isRequired,
      left:       PropTypes.number.isRequired,
      width:      PropTypes.number.isRequired,
      height:     PropTypes.number.isRequired,
      updateStateDragging: PropTypes.func.isRequired,
      updateStateResizing: PropTypes.func.isRequired,
      funcResizing:        PropTypes.func.isRequired,
    };
  
  
  
  // Resizer Component
  class Resizer extends React.Component {
    constructor(props) {
      super(props);
    }
    componentDidMount(){
      const x = document.getElementById("signature_container_"+this.props.docId);
      if(x){
        x.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        x.addEventListener('mouseup', this.onMouseUp.bind(this), false);
      }
      // window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
      // window.addEventListener('mouseup', this.onMouseUp.bind(this), false);
    }
    componentWillUnmount(){
      const x = document.getElementById("signature_container_"+this.props.docId);
      if(x){
        x.removeEventListener('mousemove', this.onMouseMove.bind(this), false);
        x.removeEventListener('mouseup', this.onMouseUp.bind(this), false);
      }
      // window.removeEventListener('mousemove', this.onMouseMove.bind(this), false);
      // window.removeEventListener('mouseup', this.onMouseUp.bind(this), false);
    }
    onMouseDown(e) {
      console.log("Resizer.onMouseDown");
      this.props.updateStateResizing( this.props.drag_id, true);
    }
    onMouseMove(e) {
      if( this.props.isResizing ){
        console.log("Resizer.onMouseMove");
        this.props.funcResizing( this.props.drag_id, e.clientX, e.clientY,this.props.fieldtype,this.props.docId);
      }
    }
    onMouseUp(e) {
      console.log("Resizer.onMouseUp");
      if( this.props.isResizing ){
        this.props.updateStateResizing( this.props.drag_id, false);
      }
    }
    render() {
      const style = {
        width:  this.props.resizerWidth,
        height: this.props.resizerHeight,
      };
      if(this.props.doc_for_sign){
        style['display'] = 'none';
      }
      return (
        <div className="resizer"
              style={style}
              onMouseDown={this.onMouseDown.bind(this)}
          ></div>
      );
    }
  };
  Resizer.propTypes = {
    id:                   PropTypes.string.isRequired,
    isResizing:           PropTypes.bool.isRequired,
    funcResizing:         PropTypes.func.isRequired,
    updateStateResizing:  PropTypes.func.isRequired,
    resizerWidth:         PropTypes.number.isRequired,
    resizerHeight:        PropTypes.number.isRequired
  };
  export default DropArea;
  