import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Styling Import
import './App.css';

// Components & Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AiChatbot from './components/AiChatbot';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookTable from './pages/BookTable';
import MyBookings from './pages/MyBookings';
import HotelDetails from './pages/HotelDetails';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddDish from './pages/admin/AddDish';
import AddHotel from './pages/admin/AddHotel';

// Main App Router Component
function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0F172A' }}>
        <Navbar />

        {/* Main Routes Container */}
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/hotel/:id" element={<HotelDetails />} />
            <Route path="/book/:hotelId" element={<BookTable />} />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-dish"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AddDish />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-hotel"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AddHotel />
                </ProtectedRoute>
              }
            />
            {/* Catch-all fallback route */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        {/* Global Floating Gemini AI Chatbot Widget */}
        <AiChatbot />

        <Footer />
      </div>
    </Router>
  );
}

export default App;