import Link from 'next/link'
import Layout from '../components/Layout';

export default function Index() {
  return (
    <Layout title="Barnbnb - Host Requirements">
      <div>
        <div className="row justify-content-md-center">
          <div className="col-12 col align-self-center">
            <div style={{ margin: 20 }}>
              <h2 style={{ fontSize: 35 }}>Host barns must...</h2>
              <div className="mt-5">
                <p style={{ fontSize: 24, color: "#999" }}>Be clean and well maintained</p>
                <hr />
              </div>

              <div className="mt-2">
                <p style={{ fontSize: 24, color: "#999" }}>Provide basic amenities like bedding and bathroom facilities</p>
                <hr />
              </div>

              <div className="mt-2">
                <p style={{ fontSize: 24, color: "#999" }}>Comply with local zoning laws</p>
                <hr />
              </div>

              <div className="mt-2">
                <p style={{ fontSize: 24, color: "#999" }}>Include a vintage tractor photo op</p>
                <hr />
              </div>
    
              <div className="mt-3">
                <Link href="/log-in">
                  <a style={{ width: "100%", backgroundColor: "#eee" }} className="btn btn-light">My barn doesn't meet the requirements</a>
                </Link>
              </div>

              <div className="mt-2">
                <Link href="/identity-check">
                  <a style={{ width: "100%" }} className="btn btn-success">My barn meets the requirements</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
