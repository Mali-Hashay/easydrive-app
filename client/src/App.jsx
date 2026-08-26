import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { currentUser } from './store/slices/authSlice';

//  Layouts
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';

// לקוחות 
import HomePage from './pages/publicPages/HomePage';
import SearchCar from './pages/publicPages/SearchCar';
import ContactPage from './pages/publicPages/Contact';
import LoginPage from './pages/publicPages/Login';
import RegisterPage from './pages/publicPages/Register';
import SearchResultsPage from './pages/publicPages/SearchResultsPage';
import ResetPasswordPage from './pages/publicPages/ResetPasswordPage';
import RentalPage from './pages/publicPages/RentalPage';
import MyRentalsPage from './pages/publicPages/MyRentalsPage';
import TermsOfUsePage from './pages/publicPages/TermsOfUse';
import About from './pages/publicPages/About';
import PrivacyPage from './pages/publicPages/PrivacyPolicy';
import AccessibilityPage from './pages/publicPages/Accessibility';
import ProfilePage from './pages/publicPages/ProfilePage';

// ניהול
import AdminRoute from './components/admin/AdminRoute';
import AdminCars from './pages/admin/AdminCars';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRentals from './pages/admin/AdminRentals';
import AdminCategories from './pages/admin/AdminCategories';
import AdminContacts from './pages/admin/AdminContacts';
import AdminPayments from './pages/admin/AdminPayments';
import AdminDashboard from './pages/admin/AdminDashboard';
import FAQ from './components/common/FAQ';
import ScrollToTop from './components/ui/ScrollToTop';


function App() 
{
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) 
      dispatch(currentUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes> 
        {/*   משתמשים ולקוחות */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} /> 
          <Route path='about' element={<About/>}/>
          <Route path="search" element={<SearchCar />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage/>} />
          <Route path="search-results" element={<SearchResultsPage />} />
          <Route path="reset-password/:id/:token" element={<ResetPasswordPage />} />
          <Route path="rental" element={<RentalPage />} />
          <Route path="profile" element={<ProfilePage/>}/>
          <Route path="my-rentals" element={<MyRentalsPage />} />
          <Route path="privacy" element={<PrivacyPage/>}/>
          <Route path="accessibility" element={<AccessibilityPage/>}/>
          <Route path="terms" element={<TermsOfUsePage/>}/>
          <Route path="faq" element={<FAQ/>}/>
        </Route>

        {/*   ניהול */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard/>}/>
          <Route path="cars" element={<AdminCars />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="rentals" element={<AdminRentals />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="contacts" element={<AdminContacts/>} />
          <Route path="payments" element={<AdminPayments/>} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;