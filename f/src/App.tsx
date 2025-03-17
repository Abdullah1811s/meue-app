import { Toaster } from 'react-hot-toast';
import './App.css';
import NavbarComponent from './components/customComponents/NavbarComponent';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './components/customComponents/Footer';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isVendorDashboard = location.pathname.includes('/dashboard');
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {!isAdminRoute && !isVendorDashboard && <NavbarComponent />}
      <Outlet />
      {!isAdminRoute && !isVendorDashboard && <Footer />}
    </>
  );
}

export default App;
