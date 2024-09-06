import Link from 'next/link';
import Layout from '../components/Layout';

export default function Index() {
  return (
    <Layout title="Barnbnb - About Hosting">
      <div style={{ marginTop: 100}}> 
        <div id="carouselExampleDark" className="carousel carousel-dark slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active" data-bs-interval="10000">
              <img src="/static/images/1.png" className="d-block text-center" alt="..." />
              <div className="carousel-caption d-md-block">
                <h5>How Barnbnb works</h5>
                <p>Barnbnb connects travelers with hosts to experience an authentic barn stay.</p>
              </div>
            </div>
            <div className="carousel-item" data-bs-interval="2000">
              <img src="/static/images/2.png" className="d-block" alt="..." />
              <div className="carousel-caption d-md-block">
                <h5>Get paid to share your barn</h5>
                <p>Travelers use the app to find incredible barns around the world, and then book their stay.</p>
              </div>
            </div>
            <div className="carousel-item">
              <img src="/static/images/3.png" className="d-block" alt="..." />
              <div className="carousel-caption d-md-block">
                <h5>Receive requests, you're in control</h5>
                <p>You'll receive a requests to stay at your barn and you'll get paid based on the duration of the stay.</p>
              </div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>    

        <div className="mt-2" style={{ paddingLeft: 10, paddingRight: 10}}>
          <Link href="/requirements">
            <a style={{ width: "100%" }} className="btn btn-success">Continue</a>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
