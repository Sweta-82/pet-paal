import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { addNotification } from './redux/slices/notificationSlice';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BrowsePetsPage from './pages/BrowsePetsPage';
import PetDetailsPage from './pages/PetDetailsPage';
import CreatePetPage from './pages/CreatePetPage';
import AdoptionFormPage from './pages/AdoptionFormPage';
import ResourcesPage from './pages/ResourcesPage';
import ChatPage from './pages/ChatPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DonationPage from './pages/DonationPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import Footer from './components/layout/Footer';


import ErrorBoundary from './components/common/ErrorBoundary';

import { Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo ? <Outlet /> : <Navigate to="/login" />;
};

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo && userInfo.role === 'admin' ? <Outlet /> : <Navigate to="/" />;
};

const ENDPOINT = 'http://localhost:5000'; // Make sure this matches your server URL

const App = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      const socket = io(ENDPOINT);
      socket.emit('setup', userInfo);

      socket.on('notification_received', (notification) => {
        dispatch(addNotification(notification));
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [userInfo, dispatch]);

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen bg-off-white font-sans text-gray-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/browse-pets" element={<BrowsePetsPage />} />
            <Route path="/pets/:id" element={<PetDetailsPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/donate" element={<DonationPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />

            {/* Protected Routes */}
            <Route path="" element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/create-pet" element={<CreatePetPage />} />
              <Route path="/pets/edit/:id" element={<CreatePetPage />} />
              <Route path="/adoption-form/:id" element={<AdoptionFormPage />} />
              <Route path="/chat" element={<ChatPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route path="" element={<AdminDashboardPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />

      </div>
    </ErrorBoundary >
  );
};

export default App;
