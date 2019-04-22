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
        currentText:null
      };
    }

    componentDidMount() {
      let list = [];
      setTimeout(() => {
        this.props.docs.map(doc => {  
          Object.keys(doc.drag_data).map(key => {
            list.push(doc.drag_data[key]);
          });
        });
        let newState = Object.assign(
          this.state, {
            items : list
          });
        this.setState(newState);
      }, 500);
    }

    onDragOver(e) {
      console.log("DropArea.onDragOver");
      e.preventDefault();
      return false;
    }
    onDrop(e) {
      console.log("DropArea.onDrop");
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
      console.log(this.state.list)
      // this.state.list.splice(parseInt(this.state.list.length)-2, 1)

      // this.setState({
      //   items: [
      //      ...this.state.items.slice(0,obj.id),
      //      Object.assign({}, this.state.items[obj.id], {isDragging: false,top: (e.clientY - obj.y),left: (e.clientX - obj.x)}),
      //      ...this.state.items.slice(obj.id+1)
      //   ]
      // });

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
      list[id].isDragging = isDragging;   
      let newState = Object.assign(
        this.state, {
          items : list
        });
      this.setState(newState);
    }
    updateStateResizing( id, isResizing){
      let list = this.state.items;
      // let index = this.state.list.findIndex((item) => item.id == id);
      list[id].isResizing = isResizing;
      
      let newState = Object.assign(
        this.state, {
          items : list
        });
      this.setState(newState);
    }
    funcResizing(id, clientX, clientY, field=''){
      let element = this.refs[field+'_'+ this.state.doc_key+'_'+ id];  console.log(element);
      let list = this.state.items;
      let position = element.refs.node.getBoundingClientRect();
      list[id].width =   clientX - position.left + (16 / 2);
      list[id].height =  clientY - position.top  + (16 / 2);
      list[id].fontSize = parseFloat(list[id].height/2.5);
      // console.log(position)
      let newState = Object.assign(
        this.state, {
          items : list
        });
      this.setState(newState);
    }
    pasteSelectedField(e){
      this.setState({currentNode:e.target.nodeName});
      this.setState({currentText:e.target.innerText});
      e.preventDefault();
      let key___ = ''
      if( !e.target.className.includes('btn-removebox1') && !e.target.className.includes('form-control') && !e.target.className.includes('unselectable') && !e.target.className.includes('sign_image') && !e.target.className.includes('resizer')){
        console.log('new element created')
        this.setState({add_new:true});
        let position = e.target.getBoundingClientRect();
        var x = e.clientX - position.left; //x position within the element.
        var y = e.clientY - position.top;
        let doc_id = e.target.id.replace ( /[^\d.]/g, '' ) || 1;
        let h = 40;
        let w = 40;
        let alreday = false;
        let list = this.state.items;
        let key___c = this.props.field_type.slice(this.props.field_type.length - 1);
        key___ = key___c[0];
        this.props.getSignPosition(e.target.parentElement.style.top,e.target.parentElement.style.left,doc_id);
        if(key___c.length <= 0 || key___c == 'initials'){
          // $('.sign-btn').click();
          if(this.props.doc_for_sign && e.target.nodeName == 'SPAN'){
            if(e.target.innerText == 'sign'){ 
              e.target.parentElement.remove();
              $('#Signfiled').modal('show');
              return false
            }
            key___ = e.target.innerText;
          }else if(!this.props.doc_for_sign){
            $('#Signfiled').modal('show');
          } 
          return false
        }

        // if(key___.includes('sign')){

        // }
        
        
        if(e.target.nodeName == 'SPAN'){
          key___ = e.target.innerText;
        }
        this.setState((state) => ({ field_count: state.field_count + 1}));
        if(key___ == 'date'){
          w = 100
          h = 50
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
        if(!alreday){
          let items = []
          let text = '';
          if(key___ == 'signer'){
            text = this.props.signer_field;
          }
          this.state.field_lists.push({ id: this.state.field_count, isDragging: false, isResizing: false, top:y, left: x,width:w, height:h, fontSize:20,isHide:false, type:key___,appendOn:false,content:text,doc_id:doc_id});
          
          Object.assign(newobj, this.state.field_lists); 
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

    removeFieldBox(id,doc_id){
      let list = this.state.items; 
      // let index = this.state.field_lists.findIndex((item) => item.id == id);
      delete list[id];
      // list[id].isHide = true;
      // list[id].type = 'yes';
      // list[id].appendOn = false;
      // this.setState({doc_key:doc_id});
      // this.setState({items:list});
      let newState = Object.assign(
        this.state, {
          items : list
        });
      this.setState(newState);
    }

    render() {
      let DropJgah = []
      let key_ = 1;
      let fields = this.state.items; 
      let doc_key = this.state.doc_key;
      this.props.docs.map(doc => {
        let items = [];
        let back_style = {
          width:  doc.w,
          height: doc.h,
          backgroundImage:"url(/files/docs/" + doc.name + ")"
        };
        if(doc.drag_data && Object.keys(fields).length <= 0){
          fields = doc.drag_data;
        }
        if((this.state.doc_key == key_) || doc.drag_data){ 
          Object.keys(fields).map(key => {
            // if(doc.drag_data){
            //   key_ = 
            // }
            if(this.props.doc_for_sign && this.state.currentNode == 'SPAN'){
              if(this.state.currentText == 'sign' && fields[key].type =='signer' && fields[key].content == 'sign'){
                return;
              }
            }
            if(!fields[key].isHide && !fields[key].isDragging && !fields[key].isResizing){ 
                if(this.state.chkduplicacy.includes(fields[key].id)){
                  // delete this.state.list[fields[key].id];
                 
                  // if(!this.state.add_new){
                    $('#'+fields[key].type+'_doc_'+key_+'_'+fields[key].id).remove();
                  // }
                }else{
                  this.state.chkduplicacy.push(fields[key].id);
                    // console.log('current:key- '+this.state.doc_key);
                    // console.log('org:key- '+key_);
                }
                this.state.list.push(
                  <Draggable 
                    ref={fields[key].type +'_'+key_+'_'+ fields[key].id}
                    key={fields[key].id}
                    drag_id={fields[key].id}
                    id={'doc_'+key_+'_'+fields[key].id}
                    docId={key_}
                    fieldType={fields[key].type}
                    signer_field={fields[key].content}
                    sign_image={this.props.sign_image}
                    sign_text={this.props.sign_text}
                    sign_font={this.props.sign_font}
                    sign_color={this.props.sign_color}
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
                    doc_for_sign={this.props.doc_for_sign}
                    currentNode={this.state.currentNode}
                    currentText={this.state.currentText}
                  />
                );
            }
            // else if(fields[key].isDragging || fields[key].isResizing){
            //   if(this.state.chkduplicacy.includes(fields[key].id)){
            //     $('#'+fields[key].type+'_doc_'+key_+'_'+fields[key].id).remove();
            //   }else{

            //   }
            // }

            // console.log(this.state.list);
            // if(fields[key].isDragging){
            //   console.log(this.state.list.splice(parseInt(this.state.list.length)-2, 1));
            // }
            
          });
         
          DropJgah.push(<div
            className="drop-area container doc-bg signature_container hovrcr_sign" 
            onDragOver={this.onDragOver.bind(this)}
            id={'signature_container_'+key_}
            onDrop={this.onDrop.bind(this)} 
            style = {back_style}
            onClick={(e) =>{this.pasteSelectedField(e)}}
            >
            {this.state.list}
          </div>)
        }else{
          DropJgah.push(<div
            className="drop-area container doc-bg signature_container hovrcr_sign"
            onDragOver={this.onDragOver.bind(this)}
            id={'signature_container_'+key_}
            onDrop={this.onDrop.bind(this)} 
            style = {back_style}
            onClick={(e) =>{this.pasteSelectedField(e)}}
            >
          </div>)
        }
        
        key_++;
      });
      return (
        <div className="right-maintemplate" key="1">
        <div className="pageNumber">Page 1 of 1</div>
        {DropJgah}
        </div>
      );
    }
  };
  
  
  // draggable Component
  class Draggable extends React.Component {
    constructor(props) {
      super(props);
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
      this.props.updateStateDragging( this.props.drag_id, false );
      if(this.props.fieldType =='signer' && this.props.doc_for_sign){
        this.props.pasteSelectedField(e);
      }
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

    removeField(e){ alert('remove')
      console.log(this.props);
      this.props.removeFieldBox(this.props.drag_id,this.props.docId)
    }

    render() {
      let dateField = ''
      let styles = {
        top:    this.props.top,
        left:   this.props.left,
        width:  this.props.width,
        height: this.props.height,
        fontSize: this.props.fontSize,
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
          fontSize:'100%',
          position:'relative',
          cursor: 'move',
      }
    if(this.props.fieldType == 'date'){
      var date = new Date().getDate();
      var month = new Date().getMonth() + 1;
      var year = new Date().getFullYear();
      dateField = month + '/' + date + '/' + year;
    }
    if(this.props.fieldType == 'sign' && this.props.sign_image){
      styles['width'] = this.props.sign_image.canvas.width;
      styles['height'] = this.props.sign_image.canvas.height;
    }
    if(this.props.fieldType == 'check'){
      styles['width'] = '100px';
      styles['height'] = '100px';
    }
    if(this.props.fieldType == 'sign_text'){
      dateField = this.props.sign_text;
      cusstyle['fontFamily'] = this.props.sign_font;
      cusstyle['color'] = this.props.sign_color;
      cusstyle['padding'] = '10px';
      cusstyle['margin'] = '3px';
      cusstyle['fontSize'] = '50px';
    }
    // if(this.props.fieldType == 'sign'){
    //   let field_ = this.props.sign_image;
    // }else{
    //   let field_ = <textarea className="form-control" defaultValue={dateField} style={cusstyle}></textarea>;
    // }
    let textstyle = {
      fontSize: '42px',
      marginLeft: '50px'
    }
      if(this.props.doc_for_sign && this.props.currentNode =='SPAN' && this.props.currentText == 'text'){
        this.props.fieldType = 'text';
        this.props.signer_field = '';
      }
      // {this.props.isDragging}
      return (
        <div className={"text-field-box item unselectable "+this.props.fieldType}
          ref={"node"}
          draggable="true"
          id={ this.props.fieldType+'_' + this.props.id }
          fieldtype={this.props.fieldType}
          onMouseDown={this.onMouseDown.bind(this)}
          onMouseUp={this.onMouseUp.bind(this)}
          onDragStart={this.onDragStart.bind(this)}
          onDragEnd={this.onDragEnd.bind(this)} 
          style={styles}>
        {(() => {
          switch (this.props.fieldType) {
            case "sign": return (<img src={this.props.sign_image ? this.props.sign_image.src : ''}></img>);
            case "check": return (<img src={'/assets/img/checkmark.png'} style={{width:'100px',height:'100px'}}></img>);
            case "signer": return (<span style={textstyle}>{this.props.signer_field}</span>);
            default: return (<textarea className="form-control" defaultValue={dateField} style={cusstyle}></textarea>);
          }
        })()}
        <div className="round-sml btn-removebox1" onClick={this.removeField.bind(this)}>✕</div>
        <div className="round-sml ui-resizable-handle ui-resizable-nw" style={{zIndex: '90'}}></div>
        <div className="round-sml ui-resizable-handle ui-resizable-sw" style={{zIndex: '90'}}></div>
        <div className="round-sml ui-resizable-handle ui-resizable-se" style={{zIndex: '90'}}></div>
        <Resizer
            ref={"resizerNode"}
            id={this.props.id}
            drag_id={this.props.drag_id}
            docId={this.props.docId}
            isResizing={this.props.isResizing}
            fieldtype={this.props.fieldType}
            resizerWidth={16}
            resizerHeight={16}
            updateStateResizing={this.props.updateStateResizing}
            funcResizing={this.props.funcResizing} />
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
    }
    onMouseDown(e) {
      console.log("Resizer.onMouseDown");
      this.props.updateStateResizing( this.props.drag_id, true);
    }
    onMouseMove(e) {
      if( this.props.isResizing ){
        console.log("Resizer.onMouseMove");
        this.props.funcResizing( this.props.drag_id, e.clientX, e.clientY,this.props.fieldtype);
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
  