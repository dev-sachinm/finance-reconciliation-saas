'use client';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CircularProgress, Alert, AlertTitle } from '@mui/material';
export default function VerifyAccount() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  const verifyAccount = async () => {
    try {
      const token = searchParams.get('token');

      if (!token) {
        throw new Error('Verification token is missing');
      }

      const response = await axios.post('/api/users/verifyAccount', { token });
      
      if (response.status === 200) {
        setStatus('success');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        throw new Error(response.data.message || 'Verification failed');
      }
    } catch (err: any) {
      setStatus('error');
      setError(
        err.response?.data?.message || 
        err.message || 
        'An unknown error occurred during verification'
      );
      console.error('Account verification error:', err);
    }
  };

  useEffect(() => {
    verifyAccount();
  }, []); // Empty dependency array to run only once

  // Render appropriate UI based on status
  switch (status) {
    case 'loading':
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <CircularProgress />
          <p className="mt-4">Verifying your account...</p>
        </div>
      );
    
    case 'success':
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="max-w-md p-6 bg-green-50 rounded-lg">
            <h2 className="text-2xl font-bold text-green-800 mb-2">Account Verified!</h2>
            <p className="text-green-600">
              Your account has been successfully verified. Redirecting to login...
            </p>
          </div>
        </div>
      );
    
    case 'error':
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <Alert severity="error" className="max-w-md">
            <AlertTitle>Verification Failed</AlertTitle>
            {error}
            <div className="mt-4">
              <button 
                onClick={() => window.location.reload()}
                className="text-blue-600 hover:underline"
              >
                Try Again
              </button>
            </div>
          </Alert>
        </div>
      );
    
    default:
      return null;
  }
}