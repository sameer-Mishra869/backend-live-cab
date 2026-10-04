import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API = 'http://localhost:5001/api';

export default function MyRides() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchBookings = async () => {
    try {
      const currentToken = localStorage.getItem('token');
      const res = await axios.get(`${API}/bookings/my`, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error('Bookings load nahi hui:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Kya aap sure ho? Booking cancel karna chahte ho?')) return;
    setCancelling(id);
    try {
      const currentToken = localStorage.getItem('token');
      await axios.patch(`${API}/bookings/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      await fetchBookings();
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'Cancel nahi hua!'));
    } finally {
      setCancelling(null);
    }
  };

  const getStatusClass = (status) => `status-badge status-${status}`;

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  if (loading) {
    return (
      <div className="page" style={{ textAlign: 'center', paddingTop: '5rem' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto' }} />
        <p style={{ color: '#8888aa', marginTop: '1rem' }}>Bookings load ho rahi hain...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">📋 My Rides</h1>
          <p className="page-subtitle">Tumhari sabhi cab bookings</p>
        </div>
        <Link to="/book-ride" className="btn btn-primary">
          ➕ New Booking
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🚗</div>
          <div className="stat-value">{bookings.length}</div>
          <div className="stat-label">Total Rides</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{bookings.filter((b) => b.status === 'confirmed').length}</div>
          <div className="stat-label">Confirmed</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-value">{bookings.filter((b) => b.status === 'cancelled').length}</div>
          <div className="stat-label">Cancelled</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">
            ₹{bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + b.fare, 0).toFixed(0)}
          </div>
          <div className="stat-label">Total Spent</div>
        </div>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🚖</div>
          <h3>Koi booking nahi mili!</h3>
          <p>Apni pehli ride book karo</p>
          <Link to="/book-ride" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            🚗 Book a Ride
          </Link>
        </div>
      ) : (
        bookings.map((b) => (
          <div key={b._id} className="booking-card">
            <div className="booking-header">
              <div>
                <div className="booking-route">
                  📍 {b.pickupLocation} → {b.dropLocation}
                </div>
                <div style={{ color: '#8888aa', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                  🏙️ {b.city?.name} &nbsp;|&nbsp; 👨‍✈️ {b.driver?.name} ({b.driver?.vehicleNumber})
                </div>
              </div>
              <span className={getStatusClass(b.status)}>
                {b.status}
              </span>
            </div>

            <div className="booking-fare">₹{b.fare}</div>

            <div className="booking-info">
              <span>📏 {b.distanceKm} km</span>
              <span>📅 {formatDate(b.rideDate)}</span>
              <span>🕐 Pickup: {b.startTime}</span>
              <span>📞 {b.driver?.phone}</span>
            </div>

            {b.status === 'confirmed' && (
              <button
                onClick={() => handleCancel(b._id)}
                className="btn btn-danger"
                style={{ marginTop: '1rem' }}
                disabled={cancelling === b._id}
              >
                {cancelling === b._id ? <span className="spinner" /> : '❌'}
                {cancelling === b._id ? ' Cancelling...' : ' Cancel Ride'}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
