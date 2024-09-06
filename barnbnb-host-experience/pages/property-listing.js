import Layout, { getBearerToken }  from '../components/Layout';
import React, { Component } from 'react';
import LoadingButton from '../components/LoadingButton';

const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 
  'West Virginia', 'Wisconsin', 'Wyoming'
];

class PropertyListingForm extends Component {
  constructor() {
    super();

    this.state = {
      state: 'Alabama'
    }
  
    this.handleChange = this.handleChange.bind(this);
    this.saveListingHandler = this.saveListingHandler.bind(this);
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  async saveListingHandler(event) {
    event.preventDefault();

    console.log(this.state);

    // Save property listing information
    const res = await fetch('/api/property-listing', {
        body: JSON.stringify(this.state),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }
    );

    // const result = await res.json();
    // if(result.ok === true) {
      window.location.href = '/congratulations';
    // }
  }

  render() {	
    return (
      <Layout title="Barnbnb - Property Listing">
        <div>
          <div className="row justify-content-md-center">
            <div className="col-12 col align-self-center">
              <div style={{ margin: 20 }}>
                <h2 style={{ fontSize: 35 }}>List your barn</h2>
                <form method="POST" onSubmit={this.saveListingHandler}>
                  <div className="mb-3 mt-5">
                    <input placeholder="Property name" onChange={this.handleChange} type="text" name="name" className="form-control" id="inputName" />
                  </div>
                  <div className="mb-3">
                    <input placeholder="Street address" onChange={this.handleChange} type="text" name="address" className="form-control" id="inputAddress" />
                  </div>
                  <div className="mb-3">
                    <input placeholder="City" onChange={this.handleChange} type="text" name="city" className="form-control" id="inputCity" />
                  </div>
                  <div className="mb-3">
                    <select
                      id="inputState"
                      name="state"
                      className="form-control"
                      onChange={this.handleChange}
                      required
                    >
                      <option value="" disabled>Select your state</option>
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <input placeholder="Zip" onChange={this.handleChange} type="text" name="zip" className="form-control" id="inputZip" />
                  </div>
                  <div className="mb-3">
                    <input placeholder="Cost per night in dollars " onChange={this.handleChange} type="text" name="cost" className="form-control" id="inputCost" />
                  </div>
                  <div className="mb-3">
                    <textarea
                      name="description"
                      className="form-control"
                      placeholder="Enter the description of your property here..."
                      onChange={this.handleChange}
                      rows="10"
                      cols="50"
                      style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                    />
                  </div>

                  <div className="mt-2">
                    <LoadingButton submitHandler={this.saveListingHandler} loadingText="Saving listing..." defaultText="Save listing" />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default function Index() {
  return (
    <Layout>
      <PropertyListingForm />
    </Layout>
  );
}
