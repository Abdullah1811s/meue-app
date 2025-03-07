import { Toaster } from 'react-hot-toast';
import './App.css';
import NavbarComponent from './components/customComponents/NavbarComponent';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './components/customComponents/Footer';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {!isAdminRoute && <NavbarComponent />}
      <Outlet />
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
