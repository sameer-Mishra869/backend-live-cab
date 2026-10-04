import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:5001/api';

export default function FareEstimate() {
  const [cities, setCities] = useState([]);
  const [cityId, setCityId] = useState('');
  const [distanceKm, setDistanceKm] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    axios
      .get(`${API}/cities`, { headers })
      .then((res) => {
        if (res.data && res.data.cities) {
          setCities(res.data.cities);
        }
      })
      .catch((err) => {
        console.error('City fetch error:', err);
        setError('Cities load karne me dikkat hui. Kripya login check karein!');
      });
  }, []);

  const handleEstimate = async (e) => {
    e.preventDefault();
    if (!cityId || !distanceKm) {
      setError('City aur distance dono select karo!');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await axios.post(
        `${API}/fare/estimate`,
        { cityId, distanceKm: Number(distanceKm) },
        { headers }
      );
      setResult(res.data.fareDetails);
    } catch (err) {
      setError('❌ ' + (err.response?.data?.message || 'Kuch gadbad!'));
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    // Fare estimate data ke saath Book Ride page pe jaao
    navigate('/book-ride', { state: { cityId, distanceKm: Number(distanceKm), fare: result?.estimatedFare } });
  };

  return (
    <div className="page">
      <h1 className="page-title">💰 Fare Estimate</h1>
      <p className="page-subtitle">Booking se pehle apna fare check karo</p>

      <div className="card">
        <form onSubmit={handleEstimate}>
          <div className="form-row">
            <div className="form-group">
              <label>🏙️ City Select Karo</label>
              <select value={cityId} onChange={(e) => setCityId(e.target.value)} required>
                <option value="">-- City Choose Karo --</option>
                {cities.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} (Base: ₹{c.baseRate} | ₹{c.perKmRate}/km)
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>📏 Distance (KM)</label>
              <input
                type="number"
                placeholder="e.g. 10"
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
                min="0.1"
                step="0.1"
                required
              />
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="spinner" /> : '🧮'}
            {loading ? ' Calculating...' : ' Calculate Fare'}
          </button>
        </form>
      </div>

      {result && (
        <div className="fare-result">
          <p style={{ color: '#8888aa', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
            Estimated Fare for {result.city}
          </p>
          <div className="fare-amount">₹{result.estimatedFare}</div>
          <p style={{ color: '#8888aa', fontSize: '0.85rem', margin: '0.5rem 0 1rem' }}>
            Formula: {result.calculation}
          </p>

          <div className="fare-breakdown">
            <div className="fare-item">
              <div className="fare-item-label">🏙️ City</div>
              <div className="fare-item-value">{result.city}</div>
            </div>
            <div className="fare-item">
              <div className="fare-item-label">📏 Distance</div>
              <div className="fare-item-value">{result.distanceKm} km</div>
            </div>
            <div className="fare-item">
              <div className="fare-item-label">🚦 Base Rate</div>
              <div className="fare-item-value">₹{result.baseRate}</div>
            </div>
            <div className="fare-item">
              <div className="fare-item-label">🛣️ Per KM Rate</div>
              <div className="fare-item-value">₹{result.perKmRate}/km</div>
            </div>
          </div>

          <button onClick={handleBookNow} className="btn btn-primary">
            🚗 Book This Ride →
          </button>
        </div>
      )}
    </div>
  );
}
