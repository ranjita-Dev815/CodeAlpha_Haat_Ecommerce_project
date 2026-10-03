import { Link } from 'react-router-dom';
import Notice from '../components/Notice.jsx';
import useTitle from '../utils/useTitle.js';

export default function NotFound() {
  useTitle('Page not found');
  return (
    <Notice title="We can't find that page"
      action={<Link to="/" className="btn btn-sm">Back to products</Link>}>
      The link may be broken or the page may have moved.
    </Notice>
  );
}
