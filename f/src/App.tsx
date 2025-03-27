import { Toaster } from 'react-hot-toast';
import './App.css';
import NavbarComponent from './components/customComponents/NavbarComponent';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './components/customComponents/Footer';
import ScrollToTop from './components/customComponents/ScrollToTop';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isVendorDashboard = location.pathname.includes('/dashboard');
  const isDocPage = location.pathname.includes('doc');

  const hideNavAndFooter = isAdminRoute || isVendorDashboard || isDocPage;

  return (
    <>
      <ScrollToTop />
      <Toaster position="top-right" reverseOrder={false} />
      {!hideNavAndFooter && <NavbarComponent />}
      <Outlet />
      {!hideNavAndFooter && <Footer />}
    </>
  );
}

export default App;
