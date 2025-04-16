import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Auth from './pages/Auth';
import UserType from './pages/UserType';
import Home from './pages/Home';
import MyBookings from './pages/MyBookings';
import ServiceDetails from './pages/ServiceDetails';
import AddService from './pages/AddService';
import EditService from './pages/EditService';
import MyServices from './pages/MyServices';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import FavoritesPage from './pages/FavoritesPage';
import BookingConfirmation from './pages/BookingConfirmation';
import CategoryPage from './pages/CategoryPage';
import Layout from './components/Layout';
import ProviderLayout from './components/ProviderLayout';
import ChatPage from './pages/ChatPage';
import ChatsListPage from './pages/ChatsListPage';
import PhoneVerificationPage from './pages/PhoneVerificationPage';
import { useAuth } from './context/AuthContext';

function App() {
  const [userType, setUserType] = useState<'client' | 'provider' | null>(null);
  const { user, phoneVerified } = useAuth();

  useEffect(() => {
    const savedUserType = localStorage.getItem('userType') as 'client' | 'provider' | null;
    if (savedUserType) {
      setUserType(savedUserType);
    }
  }, []);

  const handleSetUserType = (type: 'client' | 'provider') => {
    setUserType(type);
    localStorage.setItem('userType', type);
  };
  
  // Protected route component that requires authentication
  const ProtectedRoute = ({ children, requiresPhoneVerification = true }: { children: React.ReactNode, requiresPhoneVerification?: boolean }) => {
    if (!user) {
      return <Navigate to="/auth" replace />;
    }
    
    if (requiresPhoneVerification && !phoneVerified) {
      return <Navigate to="/verify-phone" replace />;
    }
    
    return <>{children}</>;
  };

  return (
    <Router>
      <div className="bg-secondary-100 min-h-screen">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/verify-phone" element={
            <ProtectedRoute requiresPhoneVerification={false}>
              <PhoneVerificationPage />
            </ProtectedRoute>
          } />
          <Route 
            path="/user-type" 
            element={
              <ProtectedRoute>
                <UserType onSelectUserType={handleSetUserType} />
              </ProtectedRoute>
            } 
          />
          
          {/* Client routes */}
          <Route element={<Layout userType="client" />}>
            <Route path="/home" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/my-bookings" element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            } />
            <Route path="/favorites" element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile userType={userType} />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/category/:categoryId" element={
              <ProtectedRoute>
                <CategoryPage />
              </ProtectedRoute>
            } />
          </Route>
          
          {/* Provider routes */}
          <Route element={<ProviderLayout />}>
            <Route path="/provider/home" element={
              <ProtectedRoute>
                <Home isProvider={true} />
              </ProtectedRoute>
            } />
            <Route path="/provider/bookings" element={
              <ProtectedRoute>
                <MyBookings isProvider={true} />
              </ProtectedRoute>
            } />
            <Route path="/provider/add-service" element={
              <ProtectedRoute>
                <AddService />
              </ProtectedRoute>
            } />
            <Route path="/provider/edit-service/:id" element={
              <ProtectedRoute>
                <EditService />
              </ProtectedRoute>
            } />
            <Route path="/provider/my-services" element={
              <ProtectedRoute>
                <MyServices />
              </ProtectedRoute>
            } />
            <Route path="/provider/profile" element={
              <ProtectedRoute>
                <Profile userType={userType} />
              </ProtectedRoute>
            } />
            <Route path="/provider/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
          </Route>
          
          {/* Shared routes */}
          <Route path="/service/:id" element={
            <ProtectedRoute>
              <ServiceDetails />
            </ProtectedRoute>
          } />
          <Route path="/booking-confirmation" element={
            <ProtectedRoute>
              <BookingConfirmation />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
          <Route path="/chat/:id" element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } />
          <Route path="/chats" element={
            <ProtectedRoute>
              <ChatsListPage />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;