'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type User = {
  username: string;
  password: string;
};

export default function Login() {
  const router = useRouter();

  const [user, setUser] = useState<User>({
    username: '',
    password: '',
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const filled = user.username.trim() && user.password.trim();
    setButtonDisabled(!filled);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const login = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.post('/api/users/login', user);
      router.push(`/profile/${response.data.user.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-row-wrapper">
        <h1 className="sign-up-title">⚝ Login Details ⚝</h1>
      </div>

      {error && (
        <div className="form-row-wrapper">
          <p className="text-red-500">{error}</p>
        </div>
      )}

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
        <div className="form-row-inner width33">
          <button
            onClick={login}
            className={
              buttonDisabled
                ? 'form-submit-button form-submit-button-disabled'
                : 'form-submit-button'
            }
            disabled={buttonDisabled || loading}
          >
            {loading ? (
              <>
                Logging in...
                <img
                  src="/images/loading.png"
                  alt="Loading..."
                  width={12}
                  className="ml-2 inline-block"
                />
              </>
            ) : (
              'Login'
            )}
          </button>
        </div>

        <div className="form-row-inner width33">
          <Link href="/signup" className="form-submit-button">
            Sign Up
          </Link>
        </div>
        <div className="form-row-inner width33">
          <Link href="/resetPassword" className="form-submit-button">
            Reset Password
          </Link>
        </div>
      </div>
    </div>
  );
}