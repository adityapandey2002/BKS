import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, clearError } from '../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    if (isAuthenticated) navigate('/');
    return () => dispatch(clearError());
  }, [isAuthenticated, navigate, dispatch]);

  const submit = (e) => {
    e.preventDefault();
    dispatch(signupUser(form));
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-3">{error}</div>}

      <form onSubmit={submit} className="space-y-4">
        <input className="w-full border rounded px-3 py-2" placeholder="Name"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="w-full border rounded px-3 py-2" placeholder="Email" type="email"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} minLength={6} required />
        <button disabled={isLoading} className="w-full bg-blue-600 text-white py-2 rounded">
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="text-center mt-4">
        Have an account? <Link to="/login" className="text-blue-600">Log in</Link>
      </p>
    </div>
  );
};

export default Signup;
