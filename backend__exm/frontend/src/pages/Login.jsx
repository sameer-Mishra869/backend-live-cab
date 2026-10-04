import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:5001/api';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', role: 'customer'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      if (isRegister) {
        // Register
        await axios.post(`${API}/auth/register`, form);
        setMessage({ text: '✅ Registration successful! Ab login karo.', type: 'success' });
        setIsRegister(false);
        setForm({ name: '', email: '', password: '', phone: '', role: 'customer' });
      } else {
        // Login
        const res = await axios.post(`${API}/auth/login`, {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/fare-estimate');
        window.location.reload();
      }
    } catch (err) {
      setMessage({
        text: '❌ ' + (err.response?.data?.message || 'Kuch gadbad ho gayi!'),
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '0.8rem' }}>
          <img src="/logo.png" alt="CabBook 3D Logo" style={{ width: '80px', height: '80px', borderRadius: '18px', objectFit: 'cover', boxShadow: '0 8px 25px rgba(245,158,11,0.3)' }} />
        </div>
        <h1 className="auth-title">CabBook</h1>
        <p className="auth-sub">
          {isRegister ? 'Naya account banao' : 'Apne account mein login karo'}
        </p>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Apna naam daalo"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select name="role" value={form.role} onChange={handleChange}>
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 characters)"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {message.text && (
            <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
              {message.text}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? <span className="spinner" /> : null}
            {loading ? 'Wait karo...' : isRegister ? '📝 Register' : '🔐 Login'}
          </button>
        </form>

        <div className="auth-toggle">
          {isRegister ? (
            <>Already account hai? <span onClick={() => setIsRegister(false)}>Login karo</span></>
          ) : (
            <>Naya user ho? <span onClick={() => setIsRegister(true)}>Register karo</span></>
          )}
        </div>
      </div>
    </div>
  );
}
