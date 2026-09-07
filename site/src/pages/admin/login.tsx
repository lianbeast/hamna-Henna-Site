import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
    } else {
      window.location.href = '/admin/dashboard';
    }
    setLoading(false);
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h2>Admin Access</h2>
        <p>Please sign in to manage your business site.</p>
        <form onSubmit={handleLogin}>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        {error && <p className="error-msg">{error}</p>}
      </div>

      <style>{`
        .admin-login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          padding: 20px;
          font-family: system-ui, sans-serif;
        }
        .admin-login-card {
          background: white;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 400px;
          text-align: center;
          border: 1px solid #eee;
        }
        .admin-login-card h2 { margin-bottom: 8px; color: #333; }
        .admin-login-card p { margin-bottom: 24px; color: #666; font-size: 14px; }
        .field { text-align: left; margin-bottom: 16px; }
        .field label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 4px; color: #444; }
        .field input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-sizing: border-box;
        }
        button {
          width: 100%;
          padding: 12px;
          background: #8c5123;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 10px;
        }
        button:disabled { opacity: 0.6; }
        .error-msg { color: #d32f2f; font-size: 13px; margin-top: 16px; }
      `}</style>
    </div>
  );
}
