import Link from 'next/link'
import Layout from '../components/Layout';

export default function Index() {
  return (
    <Layout title="Welcome to Barnbnb">
      <div className="bg-image"
          style={{ backgroundImage: "url('/static/images/barn-background.png')",
          height: "100vh", backgroundSize: "cover" }}>
        <h1 className="title text-center" style={{ paddingTop: 40 }}>Barnbnb</h1>
        <h2 className="text-center title">Share the Charm of Barn Living</h2>
        <div className="row justify-content-md-center position-absolute bottom-0" style={{ padding: 0, margin: 0, width: "100%" }}>
          <div className="col-12 col align-self-center" style={{ padding: 0 }}>
            <div className="" style={{ padding: 20, paddingBottom: 100 }}>
              
              <div className="mt-3">
                <Link href="/sign-up">
                  <a style={{ width: "100%", backgroundColor: "#eee" }} className="btn btn-light">Sign up as a host</a>
                </Link>  
              </div>
              <div className="mt-2">
                <Link href="/log-in">
                  <a style={{ width: "100%" }} className="btn btn-success">Log in</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
