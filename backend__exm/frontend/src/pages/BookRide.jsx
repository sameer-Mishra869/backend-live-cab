import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const API = 'http://localhost:5001/api';

export default function BookRide() {
  const [cities, setCities] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const location = useLocation();
  const navigate = useNavigate();
  const passed = location.state || {};

  const [form, setForm] = useState({
    cityId: passed.cityId || '',
    driverId: '',
    pickupLocation: '',
    dropLocation: '',
    distanceKm: passed.distanceKm || '',
    rideDate: '',
    startTime: '',
    endTime: '',
  });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    axios.get(`${API}/cities`, { headers }).then((r) => setCities(r.data.cities || [])).catch(err => console.error(err));
    axios.get(`${API}/drivers`, { headers }).then((r) => setDrivers(r.data.drivers || [])).catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await axios.post(`${API}/bookings`, { ...form, distanceKm: Number(form.distanceKm) }, { headers });
      setMessage({
        text: `✅ Booking confirmed! Fare: ₹${res.data.booking.fare}`,
        type: 'success',
      });
      setTimeout(() => navigate('/my-rides'), 2000);
    } catch (err) {
      setMessage({
        text: '❌ ' + (err.response?.data?.message || 'Booking fail ho gayi!'),
        type: 'error',
      });
      // Conflict details bhi show karo
      if (err.response?.data?.conflictDetails) {
        const cd = err.response.data.conflictDetails;
        setMessage((prev) => ({
          ...prev,
          text: prev.text + `\n⚠️ Existing booking: ${cd.existingRide.time}`,
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">🚗 Book a Ride</h1>
      <p className="page-subtitle">Driver conflict automatically check hoga</p>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* City & Driver */}
          <div className="form-row">
            <div className="form-group">
              <label>🏙️ City</label>
              <select name="cityId" value={form.cityId} onChange={handleChange} required>
                <option value="">-- City Choose Karo --</option>
                {cities.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>👨‍✈️ Driver</label>
              <select name="driverId" value={form.driverId} onChange={handleChange} required>
                <option value="">-- Driver Choose Karo --</option>
                {drivers.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} — {d.vehicleNumber} ({d.vehicleType})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Locations */}
          <div className="form-row">
            <div className="form-group">
              <label>📍 Pickup Location</label>
              <input
                type="text"
                name="pickupLocation"
                placeholder="Pickup ka address"
                value={form.pickupLocation}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>📍 Drop Location</label>
              <input
                type="text"
                name="dropLocation"
                placeholder="Drop ka address"
                value={form.dropLocation}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Distance & Date */}
          <div className="form-row">
            <div className="form-group">
              <label>📏 Distance (KM)</label>
              <input
                type="number"
                name="distanceKm"
                placeholder="e.g. 15"
                value={form.distanceKm}
                onChange={handleChange}
                min="0.1"
                step="0.1"
                required
              />
            </div>
            <div className="form-group">
              <label>📅 Ride Date</label>
              <input
                type="date"
                name="rideDate"
                value={form.rideDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {/* Pickup Time */}
          <div className="form-group">
            <label>🕐 Pickup Time (Start Time)</label>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              required
            />
          </div>

          {message.text && (
            <div
              className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}
              style={{ whiteSpace: 'pre-line' }}
            >
              {message.text}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? <span className="spinner" /> : '✅'}
            {loading ? ' Booking ho rahi hai...' : ' Confirm Booking'}
          </button>
        </form>
      </div>

      <div className="alert alert-info">
        ℹ️ <strong>Driver Conflict Check:</strong> Agar selected driver us date/time pe already booked hai toh booking automatically reject ho jayegi.
      </div>
    </div>
  );
}
