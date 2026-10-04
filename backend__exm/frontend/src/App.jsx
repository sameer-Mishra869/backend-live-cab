import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import FareEstimate from './pages/FareEstimate';
import BookRide from './pages/BookRide';
import MyRides from './pages/MyRides';
import Navbar from './components/Navbar';
import './index.css';

// Protected Route — sirf logged in users access kar sakte hain
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" replace />;
};

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      {token && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/fare-estimate"
          element={
            <ProtectedRoute>
              <FareEstimate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book-ride"
          element={
            <ProtectedRoute>
              <BookRide />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-rides"
          element={
            <ProtectedRoute>
              <MyRides />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
