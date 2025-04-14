
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-white px-4">
      <div className="text-center">
        <h1 className="text-[10rem] font-extrabold text-[#DBC166] leading-none">404</h1>
        <p className="text-2xl mt-2 mb-6">Oops! Page not found.</p>
        <Link
          to="/"
          className="inline-block bg-[#DBC166] text-black font-semibold px-6 py-3 rounded-md transition-all duration-300 hover:bg-yellow-400"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
