'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type User = {
  email: string;
  username: string;
  password: string;
};

export default function SignUp() {
  const router = useRouter();

  const [user, setUser] = useState<User>({
    email: '',
    username: '',
    password: '',
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const allFieldsFilled =
      user.email.trim() && user.username.trim() && user.password.trim();
    setButtonDisabled(!allFieldsFilled);
  }, [user]);

  const signUp = async () => {
    try {
      setLoading(true);
      setError('');
      await axios.post('/api/users/signup', user);
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="form-container">
      <div className="form-row-wrapper">
        <h1 className="sign-up-title">⚝ Signing Up Details ⚝</h1>
      </div>

      {error && (
        <div className="form-row-wrapper">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      <div className="form-row-wrapper">
        <label className="form-label" htmlFor="email">Email:</label>
        <input
          className="p-1 border"
          type="email"
          id="email"
          name="email"
          value={user.email}
          onChange={handleChange}
        />
      </div>

      <div className="p-2 form-field-separator" />

      <div className="form-row-wrapper">
        <label className="form-label" htmlFor="username">Username:</label>
        <input
          className="p-1 border"
          type="text"
          id="username"
          name="username"
          value={user.username}
          onChange={handleChange}
        />
      </div>

      <div className="p-2 form-field-separator" />

      <div className="form-row-wrapper">
        <label className="form-label" htmlFor="password">Password:</label>
        <input
          className="p-1 border"
          type="password"
          id="password"
          name="password"
          value={user.password}
          onChange={handleChange}
        />
      </div>

      <div className="form-row-wrapper">
        <div className="form-row-inner">
          <button
            onClick={signUp}
            className={
              buttonDisabled
                ? 'form-submit-button form-submit-button-disabled'
                : 'form-submit-button'
            }
            disabled={buttonDisabled || loading}
          >
            {loading ? (
              <>
                Signing Up...
                <img
                  src="/images/loading.png"
                  alt="Loading.."
                  width={12}
                  className="ml-2 inline-block"
                />
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </div>
        <div className="form-row-inner">
          <Link href="/login" className="form-submit-button">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
