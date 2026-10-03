import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-col footer-brand">
          <span className="brand">haat</span>
          <p className="muted small">
            Haat is a portfolio project built with MongoDB, Express, React and Node.
            Orders here are for demonstration only.
          </p>
        </div>

        <div className="footer-col">
          <h3 className="footer-heading">Shop</h3>
          <ul className="footer-links">
            <li><Link to="/">All products</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/orders">My orders</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3 className="footer-heading">Help</h3>
          <ul className="footer-links">
            <li><span>Payments</span></li>
            <li><span>Shipping</span></li>
            <li><span>Cancellation &amp; Returns</span></li>
            <li><span>FAQ</span></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3 className="footer-heading">Policies</h3>
          <ul className="footer-links">
            <li><span>Terms of use</span></li>
            <li><span>Security</span></li>
            <li><span>Privacy</span></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3 className="footer-heading">Connect with us</h3>
          <div className="footer-social">
            <span aria-label="Facebook">f</span>
            <span aria-label="Instagram">ig</span>
            <span aria-label="X">x</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom container">
        <span className="muted small">&copy; 2026 haat.com</span>
      </div>
    </footer>
  );
}
