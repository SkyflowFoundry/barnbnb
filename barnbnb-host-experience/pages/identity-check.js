import React, { Component } from 'react';
import Layout, { getBearerToken }  from '../components/Layout';
import LoadingButton from '../components/LoadingButton';
import Skyflow from 'skyflow-js';

async function getSkyflowId() {
  return new Promise(async function(resolve, reject) {
    const res = await fetch('/api/skyflow-propery-manager-id', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'GET'
      }
    );

    const result = await res.json();

    resolve(result.skyflowId);
  });
};

class IdVerificationPage extends Component {
  constructor() {
    super();

    this.state = { }

    this.idVerificationHandler = this.idVerificationHandler.bind(this);
  }

  componentDidMount() {
    this.initPage();
  }

  initPage = async () => {
    const skyflowId = await getSkyflowId();
   
    console.log(skyflowId);

    const skyflowClient = Skyflow.init({
      vaultID: process.env.vaultID,
      vaultURL: process.env.vaultURL,
      getBearerToken: getBearerToken,
      options: {
        env: Skyflow.Env.DEV
      }
    });

    this.container = skyflowClient.container(Skyflow.ContainerType.COLLECT);
    const element = this.container.create({
      type: Skyflow.ElementType.FILE_INPUT,   // Skyflow.ElementType enum.
      table: 'property_owners',             // The table this data belongs to.
      column: 'drivers_license_image',            // The column into which this data should be inserted.
      skyflowID: skyflowId,         // The skyflow_id of the record.
      inputstyles: {
        base: {
          color: '#1d1d1d',
          fontSize: '20px'
        },
      },
      labelStyles: {
        base: {
          fontSize: '12px',
          fontWeight: 'bold',
        },
      },
      errorTextStyles: {
        base: {
          color: '#f44336',
        },
      },
    },
    { 
      allowedFileType: [".pdf",".png", ".jpg", ".jpeg"]
    });

    element.mount('#file');
  }

  async idVerificationHandler(event) {
    event.preventDefault();

    this.container.uploadFiles().then(res => {
      window.location.href = '/banking-info';
    })
    .catch(err => {
      console.log(err);
    });
  }

  render() {	
    return (
      <Layout title="Barnbnb - Trust & Verification">
        <div>
          <div className="row justify-content-md-center">
            <div className="col-12 col align-self-center">
              <div style={{ margin: 20 }}>
                <h2 style={{ fontSize: 35 }}>Verification and trust</h2>
                <p>Before you can list your barn, you must pass an ID verifiation. This is mandatory step. It will help you boost your position as a trusted professional property manager.
                </p>
                <p>
                  <b>Note:</b> Your ID will be securely stored and will not be visible or shared with anyone.
                </p>
                <div className="mt-5 row">
                  <div className="col-12">
                  <form>
                    <div id="file"/>
                    <br/>
                    <p><b>Note:</b> Allowed files are png, jpg, jpeg, and PDF.</p>
                  </form>
                  </div>
                </div>

                <div className="mt-5">
                  <LoadingButton submitHandler={this.idVerificationHandler} loadingText="Saving ID..." defaultText="Continue" />
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
      <IdVerificationPage />
    </Layout>
  );
}
