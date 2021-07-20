import React, { Component } from "react";
import ItemManagerContract from "./contracts/ItemManager.json";
import ItemContract from "./contracts/Item.json";
import getWeb3 from "./getWeb3";
// import 'bootstrap/dist/css/bootstrap.min.css';

import "./App.css";

class App extends Component {
  
  state = {
    loaded: false,
    // itemContract: '',
    // cost: 0,
    // itemName: 'Item 1',
    // address: '',
    // count: 0,
    items: [{
      cost: 0,
      itemName: 'Item 1',
      step: 0,
      itemAddress: '',
    }]
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await this.web3.eth.net.getId();
      this.itemManager = new this.web3.eth.Contract(
        ItemManagerContract.abi,
        ItemManagerContract.networks[networkId] && ItemManagerContract.networks[networkId].address,
      );

      this.item = new this.web3.eth.Contract(
        ItemContract.abi,
        ItemContract.networks[networkId] && ItemContract.networks[networkId].address,
      );
      // this.setState({ itemContract })
      console.log('item manager', this.itemManager.methods.items(1).call())
      console.log('item', this.item.methods)
      // const count = await this.itemManager.methods.index().call()
      // this.setState({ count: [...this.setState.count, this.setState.items.length ] })
      // console.log(this.state.count)
      let index = await this.itemManager.methods.itemIndex().call()
      for (var i = 1; i <= index; i++) {
        const item = await this.itemManager.methods.items(i).call()
        this.setState({
          items: [...this.state.items, {
            cost: item._itemPrice,
            itemName: item._identifier,
            step: item._state,
            itemAddress: item._item
          }]
        })
      }
      // const index = await this.itemManager.methods.items()
      // console.log('index', index)
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.listenToPaymentEvent();
      this.setState({ loaded:true });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  listenToPaymentEvent = () => {
    let self = this;
    this.itemManager.events.SupplyChainStep().on("message", async function(event) {
      if(event.returnValues._step === 1) {
        let item = await self.itemManager.methods.items(event.returnValues._itemIndex).call();
        console.log(item);
        alert("Item " + item._identifier + " was paid, deliver it now!");
      };
      console.log("event", event);
    });
  }
  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  // handleInputChange = (e) => {
  //   this.setState({ input: e.target.value });
  // };

  handleSubmit = async() => {
    const { cost, itemName } = this.state;
    let item = await this.itemManager.methods.createItem(itemName, cost).send({ from: this.accounts[0] });
    
    console.log("item submitted", item);
    // let newCount = this.state.count + 1;
    // cost.push(cost);
    // this.setState({cart: cart});
    // let address = result.events.SupplyChainStep.returnValues._itemAddress; 
    this.setState({
      // address: item.events.SupplyChainStep.returnValues,
      // count: newCount, 
      items: [...this.state.items, {
        cost: cost,
        itemName: itemName,
        step: item.events.SupplyChainStep.returnValues._step,
        itemAddress: item.events.SupplyChainStep.returnValues._itemAddress
      }]
    })
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1 class="bg-light border p-5">Supply Chain Manager</h1>
        <div class="m-5 w-25 p-5 bg-primary">
          <h5 class="text-white">Create an Item</h5>
          <div class="input-group pt-3 mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">Item ID</span>
            </div>
              <input type="text" class="form-control" placeholder="123XYZ..." name="itemName" value={this.state.itemName} onChange={this.handleInputChange}/>
          </div>
          <div class="input-group pb-3 mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="basic-addon1">Cost in Wei</span>
            </div>
              <input type="text" class="form-control" placeholder="100" name="cost" value={this.state.cost} onChange={this.handleInputChange}/>
          </div>
       
          <button class="btn btn-light" type="button" onClick={this.handleSubmit}>Create New Item</button>
        </div>
  
        
        {/* Cost in Wei: <input type="text" name="cost" value={this.state.cost} onChange={this.handleInputChange} /> */}
        {/* Item ID: <input type="text" name="itemName" value={this.state.itemName} onChange={this.handleInputChange} /> */}
       
     
        {/* <p>Send money to: {this.state.address._itemAddress}</p>
        <p>Step: {this.state.address._step}</p>
        <p>Cost: {this.state.cost}</p>
        <p>Name: {this.state.itemName}</p> */}

        <ol>
          {this.state.items.map((item, key) => {
            if (key !== 0) {
              return (
                <div key={key} class="d-flex justify-content-center">
                  <div class="card m-2 text-left mr-5 w-75">
                    <div class="card-header bg-secondary text-white font-weight-bold d-flex justify-content-between">
                      <p>ID: {item.itemName}</p>
                      <p class="text-right">Cost: {item.cost}</p>
                    </div>
                    <div class="card-body">
                      <p>Pay To: {item.itemAddress}</p>
                      <p>Step: {item.step}</p>
                    </div>
                  </div>
                </div>
              )
            }
          })}
        </ol>
      </div>
    );
  }
}

export default App;
