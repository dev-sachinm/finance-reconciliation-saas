'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type User = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function resetPassword() {
  const router = useRouter();

  const [user, setUser] = useState<User>({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const filled = user.email.trim() && user.password.trim();
    if(user.password !=='' && user.confirmPassword!=='' && user.password!==user.confirmPassword){
      setError('Password and Confirm Password not matching')
    }else if(user.password===user.confirmPassword){
      setError('')
    }
    setButtonDisabled(!filled);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const resetPassword = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.post('/api/users/resetPassword', user);
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Reset password failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-row-wrapper">
        <h1 className="sign-up-title">⚝ Reset Password ⚝</h1>
      </div>

      {error && (
        <div className="form-row-wrapper">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      <div className="p-2 form-field-separator" />

      <div className="form-row-wrapper">
        <label className="form-label" htmlFor="email">Email:</label>
        <input
          className="p-1 border"
          type="text"
          id="email"
          name="email"
          value={user.email}
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
        <label className="form-label" htmlFor="confirmPassword">Confirm Password:</label>
        <input
          className="p-1 border"
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={user.confirmPassword}
          onChange={handleChange}
        />
      </div>
      <div className="form-row-wrapper">
        <div className="form-row-inner">
          <button
            onClick={resetPassword}
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
              'Reset Password'
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
