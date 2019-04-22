import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import './Product.css';
import axios from 'src/common/myAxios';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product_data:[],
      qry:''
    };
    this.getUserFeed = this.getUserFeed.bind(this);
    this.onChange = this.onChange.bind(this);
    // this.getUserFeed(this)
  }

  componentDidMount() {
    document.title = 'Product Search'
  }

  getUserFeed(e) {
    if(e.target.name == 'search'){
      this.setState({'qry':e.target.value});
      this.setState({product_data:[]});
    }
    axios.post('/api/get_products',this.state).then((res) => {
            this.setState({
                product_data: res.data,
            });
    });
  }
  onChange(e){
    this.setState({[e.target.name]:e.target.value});
  }

  render() {
    if (this.state.redirectToReferrer) {
      return (<Redirect to={'/login'}/>)
    }
    return (
      <div className="container">
      <h2>Filter Product</h2>
      <p>Type something in the input field to search the list for specific items:</p>
      <input class="form-control" name="search" type="text" placeholder="Search.." onKeyUp={this.getUserFeed} />
      <br/>
      <ul class="list-group" id="myList">
      {this.state.product_data.map(function(product, index){
        return <li className="list-group-item">{product.name} :- {product.price}</li>;
      })}
      </ul>
      </div>
    );
  }
}

export default Search;
