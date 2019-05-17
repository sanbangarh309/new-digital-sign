import React, {Component} from 'react';
import './Signature.css';
import SignaturePad from 'react-signature-canvas'
import PropTypes from 'prop-types';
class Sign extends Component {
    constructor(props){
        super(props);
        this.state ={
          signInput:null,
          buttons:{
            sign:false,
            clear:false,
            revoke:false
          }
        };
      }


      bindSignature(e){
        if(this.sigCanvas.isEmpty()) return false;
        let docId = this.props.docId || 1;
        let newcanvas = this.trim(this.sigCanvas.getCanvas());
        let image = newcanvas.toDataURL(),
        container = document.getElementById('signature_container_'+docId),
        img = document.createElement("img"),
          onClick = (e)=>{ 
          // debugger;
          // container.removeChild(e.target);
        };
          img.src = image;
          img.alt = "Double Click to Remove Signature";
          $(img).addClass('sign_image');
          $(img).css('margin-top',this.props.t);
          $(img).css('margin-left',this.props.l);
          this.props.updateSignField({src:image,top:this.props.t,left:this.props.l,canvas:newcanvas});
          // container.children.length ? container.removeChild(container.children[0]) : null;
          if(this.props.doc_for_sign){
            // container.appendChild(img);
          }
          // container.appendChild(img);
        //   debugger;
          // img.removeEventListener("dblclick",onClick);
          // img.addEventListener("dblclick",onClick);
          this.setState({buttons:{revoke:true,clear:true,sign:true}});
      }

      onEndSignature(e){
        this.props.updateSignFieldType();
      }

      resizeCanvas(e){
        let canvas = React.FindDOMNode(this.refs.signingSurface),
             ratio =  Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
      }

      clearSignature(e){
        // debugger;
        this.sigCanvas.clear();
        //  this.state.signInput.clear();
         this.setState({buttons:{sign:true,clear:true,revoke:false}});
      }

      componentWillUnmount(){
          window.addEventListener("resize",this.resizeCanvas);
      }

      componentDidMount(){
          this.sigCanvas.clear();
      }

      trim(c) {
        var ctx = c.getContext('2d'),
          copy = document.createElement('canvas').getContext('2d'),
          pixels = ctx.getImageData(0, 0, c.width, c.height),
          l = pixels.data.length,
          i,
          bound = {
            top: null,
            left: null,
            right: null,
            bottom: null
          },
          x, y;
        for (i = 0; i < l; i += 4) {
          if (pixels.data[i+3] !== 0) {
            x = (i / 4) % c.width;
            y = ~~((i / 4) / c.width);
        
            if (bound.top === null) {
              bound.top = y;
            }
            
            if (bound.left === null) {
              bound.left = x; 
            } else if (x < bound.left) {
              bound.left = x;
            }
            
            if (bound.right === null) {
              bound.right = x; 
            } else if (bound.right < x) {
              bound.right = x;
            }
            
            if (bound.bottom === null) {
              bound.bottom = y;
            } else if (bound.bottom < y) {
              bound.bottom = y;
            }
          }
        } 
        try {
          var trimHeight = bound.bottom - bound.top,
            trimWidth = bound.right - bound.left,
            trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);
          copy.canvas.width = trimWidth;
          copy.canvas.height = trimHeight;
          copy.putImageData(trimmed, 0, 0);
          return copy.canvas;
        }catch(e){
          return copy.canvas;
        }
        
        
      }

    //   componentDidMount(){
    //     let canvas = document.getElementById(this.props.srcElement),
    //     widget =new SignaturePad(canvas,{
    //       minWidth:.2,
    //       maxWidth:3,
    //       onBegin(e){
    //         this.setState({buttons:{sign:true,clear:true,revoke:false}});
    //       },
    //       onEnd(e){
            
    //       },
    //     });
    //     this.setState({signInput:widget}); 
    //     window.addEventListener("resize",this.resizeCanvas);
    //     // debugger;
    //   }

      render() {
        if(this.props.bind_signature){
          this.bindSignature(this);
        }
        // style={{width:'50%'}}
        return <div className='container signature-container'>
          <div class='row'>
            <div class='col-md-12' style={{backgroundColor: 'darkgrey'}} id="signature_pad_draw">
            <SignaturePad 
                penColor={this.props.color}
                canvasProps={{width: this.props.w, height: this.props.h, className: 'sigCanvas sign_pad_tab' , id:'sign_pad_tab'}} 
                onEnd={this.onEndSignature.bind(this)}
                ref={(ref) => { this.sigCanvas = ref }}
                velocityFilterWeight={0.1}
            />
            <p className="clear-link"><a href="javascript:void(0)" onClick={this.clearSignature.bind(this)}>clear</a></p>
            </div>
              </div>
          </div>;
      }
}
Sign.propTypes = {
  updateSignField:PropTypes.func,
};
export default Sign;