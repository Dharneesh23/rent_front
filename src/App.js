



import React, { useEffect, useState } from 'react';
import OnboardingSlides from './components/OnboardingSlides';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import SelectionPage from './pages/SelectionPage';
import GetForRentDashboard from './pages/GetForRentDashboard';
import UserManagement from './pages/UserManagement';
import ListingManagement from './pages/ListingManagement';
import RentalTransactions from './pages/RentalTransactions';
import PostForRent from './pages/PostForRent';

function App() {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <div className="App">
      {route === '#/login' ? (
        <LoginPage />
      ) : route === '#/signup' ? (
        <SignUpPage />
      ) : route === '#/admin-dashboard' ? (
        <AdminDashboard />
      ) : route === '#/user-dashboard' ? (
        <UserDashboard />
      ) : route === '#/user-management' ? (
        <UserManagement />
      ) : route === '#/listing-management' ? (
        <ListingManagement />
      ) : route === '#/rental-transactions' ? (
        <RentalTransactions />
      ) : route === '#/post-for-rent' ? (
        <PostForRent />
      ) : route === '#/selection' ? (
        <SelectionPage />
      ) : route === '#/get-for-rent-dashboard' ? (
        <GetForRentDashboard />
      ) : (
        <OnboardingSlides />
      )}
    </div>
  );
}

export default App;
