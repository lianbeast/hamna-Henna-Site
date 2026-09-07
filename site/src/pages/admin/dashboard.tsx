import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminDashboard() {
  const [profile, setProfile] = useState({
    business_name: '',
    contact_email: '',
    instagram_handle: '',
    tagline: '',
  });
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    async function loadData() {
      // 1. Check Auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        window.location.href = '/admin/login';
        return;
      }

      // 2. Load Profile (own row first, else any row)
      const { data: profData } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      if (profData) setProfile(profData);
      else {
        const { data: anyData } = await supabase.from('profiles').select('*').maybeSingle();
        if (anyData) setProfile(anyData);
      }

      // 3. Load Inquiries
      const { data: inqData } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
      if (inqData) setInquiries(inqData);

      setLoading(false);
    }
    loadData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setMsg('Not signed in.'); setSaving(false); return; }

    const { error } = await supabase
      .from('profiles')
      .upsert({ ...profile, id: user.id }, { onConflict: 'id' });

    if (error) {
      setMsg('Error updating profile: ' + error.message);
    } else {
      setMsg('Profile updated successfully!');
    }
    setSaving(false);
  };

  if (loading) return <div className="admin-center">Loading Dashboard...</div>;

  return (
    <div className="admin-container">
      <nav className="admin-nav">
        <h1>Business Admin</h1>
        <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/admin/login'; }}>Logout</button>
      </nav>

      <div className="admin-grid">
        {/* Settings Section */}
        <section className="admin-card">
          <h2>Site Settings</h2>
          <form onSubmit={handleUpdateProfile}>
            <div className="field">
              <label>Business Name</label>
              <input
                value={profile.business_name}
                onChange={e => setProfile({...profile, business_name: e.target.value})}
              />
            </div>
            <div className="field">
              <label>Tagline</label>
              <input
                value={profile.tagline}
                onChange={e => setProfile({...profile, tagline: e.target.value})}
              />
            </div>
            <div className="field">
              <label>Contact Email</label>
              <input
                value={profile.contact_email}
                onChange={e => setProfile({...profile, contact_email: e.target.value})}
              />
            </div>
            <div className="field">
              <label>Instagram Handle</label>
              <input
                value={profile.instagram_handle}
                onChange={e => setProfile({...profile, instagram_handle: e.target.value})}
              />
            </div>
            <button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
            {msg && <p className="save-msg">{msg}</p>}
          </form>
        </section>

        {/* Inquiries Section */}
        <section className="admin-card">
          <h2>Booking Inquiries</h2>
          <div className="inquiry-list">
            {inquiries.length === 0 ? <p>No inquiries yet.</p> : (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Service</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map(inq => (
                    <tr key={inq.id}>
                      <td>{new Date(inq.created_at).toLocaleDateString()}</td>
                      <td>{inq.customer_name}</td>
                      <td>{inq.service}</td>
                      <td>{inq.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>

      <style>{`
        .admin-container { padding: 40px; font-family: system-ui, sans-serif; max-width: 1200px; margin: 0 auto; }
        .admin-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .admin-nav h1 { margin: 0; color: #333; }
        .admin-nav button { padding: 8px 16px; cursor: pointer; background: #eee; border: 1px solid #ccc; border-radius: 6px; }
        .admin-grid { display: grid; grid-template-columns: 350px 1fr; gap: 30px; }
        .admin-card { background: white; padding: 24px; border-radius: 12px; border: 1px solid #ddd; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .admin-card h2 { margin-top: 0; margin-bottom: 20px; color: #444; font-size: 20px; }
        .field { margin-bottom: 16px; text-align: left; }
        .field label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 4px; color: #666; }
        .field input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
        button { width: 100%; padding: 12px; background: #8c5123; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; }
        .save-msg { margin-top: 12px; font-size: 13px; text-align: center; color: green; }
        .inquiry-list { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        th, td { text-align: left; padding: 12px; border-bottom: 1px solid #eee; }
        th { background: #f9f9f9; color: #666; }
        .admin-center { display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: system-ui, sans-serif; }
        @media (max-width: 768px) {
          .admin-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
