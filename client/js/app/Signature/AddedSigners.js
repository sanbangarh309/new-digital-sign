import React, {Component} from 'react';
import axios from 'src/common/myAxios';
class AddedSigners extends Component {
    constructor(props){
        super(props);
        this.state ={
          signers:[],
        };
        console.log(this.props.signer_ids);
        this.getSigners();
      }

      getSigners  = () => {
        axios.post('/api/signers/',{ids:this.props.signer_ids,token:localStorage.getItem('jwtToken')}).then((res) => {
          this.setState({
            signers: res.data
          });
         
        }).catch(error => {
          console.log(error.response);
        });
      }

      render() {
        const Fields = this.state.signers.map((person) =>
                <li 
                key={person._id}
                >
                <a href="javascript:void(0)" id={'signer_'+person._id} className="btn sign-btn" className="btn"><span class="material-icons">border_color</span>{person.name}</a>
                </li>
        );
          return (
            <ul className="btn-list">
            <li>
            <div id="accordion" className="inner-accordian">
                <div className="card">
                <div className="card-header" id="headingTwo">
                    <button className="btn btn-link" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                    Signers List
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