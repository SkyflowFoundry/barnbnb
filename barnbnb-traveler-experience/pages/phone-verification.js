import React, { Component } from 'react';
import Layout, { getBearerToken }  from '../components/Layout';
import LoadingButton from '../components/LoadingButton';
import Skyflow from 'skyflow-js';

class PhoneVerificationPage extends Component {
  constructor() {
    super();

    this.state = { }

    this.idVerificationHandler = this.idVerificationHandler.bind(this);
  }

  componentDidMount() {
    this.initPage();
  }

  initPage = async () => {
    
  }

  async idVerificationHandler(event) {
    event.preventDefault();

    
  }

  render() {	
    return (
      <Layout title="Barnbnb - Phone Verification">
        <div>
          <div className="row justify-content-md-center">
            <div className="col-12 col align-self-center">
              <div style={{ margin: 20 }}>
                <h2 style={{ fontSize: 35 }}>Phone verification</h2>
                <p>
                  Before you can continue, you must verify your phone number. This is mandatory step.
                </p>
                <p>
                  Enter the code that you received on your phone in the form below.
                </p>

                <div className="mt-5 row">
                  <div className="col-12">
                  <form>
                    TODO
                  </form>
                  </div>
                </div>

                <div className="mt-5">
                  <LoadingButton submitHandler={this.idVerificationHandler} loadingText="Checking verification..." defaultText="Continue" />
                </div>
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
      <PhoneVerificationPage />
    </Layout>
  );
}
