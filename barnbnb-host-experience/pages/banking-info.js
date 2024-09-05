import React, { Component } from 'react';
import LoadingButton from '../components/LoadingButton';
import Layout, { getBearerToken } from '../components/Layout';
import Skyflow from 'skyflow-js';

class BankingInfoPage extends Component {
  constructor() {
    super();

    this.state = {
      holderName: '',
      routingNumber: '',
      accountNumber: '',
    }

    this.holderChangeHandler = this.holderChangeHandler.bind(this);
    this.routingChangeHandler = this.routingChangeHandler.bind(this);
    this.accountChangeHandler = this.accountChangeHandler.bind(this);   
    this.bankingHandler = this.bankingHandler.bind(this);
  }

  holderChangeHandler(event) {
    this.setState({holderName: event.target.value});
  }

  routingChangeHandler(event) {
    this.setState({routingNumber: event.target.value});
  }

  accountChangeHandler(event) {
    this.setState({accountNumber: event.target.value});
  }

  async bankingHandler(event) {
    event.preventDefault();

    // Create the Moov account.
    const result = await fetch('/api/moov-account-creation', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });

    const payload = await result.json();
    let skyflowId = payload.skyflowId;

    // Account was successfully created.
    if(payload.ok === true) {
      const skyflowClient = Skyflow.init({
        vaultID: process.env.vaultID,
        vaultURL: process.env.vaultURL,
        getBearerToken: getBearerToken,
        options: {
          env: Skyflow.Env.DEV
        }
      });
  
      // Save bank information to the vault.
      let response = await skyflowClient.insert({
        records: [
          {
            fields: {
              bank_account_number: this.state.accountNumber,
              bank_routing_number: this.state.routingNumber,
              property_owners_skyflow_id: skyflowId,
              account_holder_name: this.state.holderName
            },
            table: 'property_owners_bank_information'
          }
        ]
      }, { tokens: true });

      // Create the Moov bank account.
      const result = await fetch('/api/moov-bank-account-creation', {
        body: JSON.stringify(response.records[0]),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      });

      const payload = await result.json();
      if(payload.ok === true) {
        window.location.href = '/property-listing';
      }
    }
  }

  render() {	
    return (
      <Layout title="Barnbnb - Banking Information">
        <div>
          <div className="row justify-content-md-center">
            <div className="col-12 col align-self-center">
              <div style={{ margin: 20 }}>
                <h2 style={{ fontSize: 35 }}>Set up direct deposit</h2>
                <p>Add your banking information so you can get paid when people book.
                </p>
                <form method="POST" onSubmit={this.bankInfoHandler}>
                <div className="mb-3 mt-5">
                    <input placeholder="Holder name" onChange={this.holderChangeHandler} type="text" name="holder" className="form-control" id="inputHolder" />
                  </div>
                  <div className="mb-3">
                    <input placeholder="Routing number" onChange={this.routingChangeHandler} type="text" name="routing" className="form-control" id="inputRouting" />
                  </div>
                  <div className="mb-3">
                    <input placeholder="Account number" onChange={this.accountChangeHandler} type="text" name="account" className="form-control" id="inputAccount" />
                  </div>

                  <div>
                    <img src="/static/images/bank-check.gif" className="img-fluid text-center" />
                  </div>

                  <div className="mt-5">
                    <LoadingButton submitHandler={this.bankingHandler} loadingText="Saving bank information..." defaultText="Continue" />
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
      <BankingInfoPage />
    </Layout>
  );
}
