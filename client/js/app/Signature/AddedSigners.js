import React, {Component} from 'react';

class AddedSigners extends Component {
    constructor(props){
        super(props);
        this.state ={
          signers:[],
        };
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
          return (
            <ul className="btn-list">
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
                        {Fields}
                    </ol>
                    </div>
                </div>
                </div>
            </div>
            </li>
        </ul>
          )
      }
}

export default AddedSigners;