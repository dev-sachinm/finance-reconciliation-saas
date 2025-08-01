'use client';

import Link from 'next/link';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const signUp = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const signupRes = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      const signupData = await signupRes.json();

      if (!signupRes.ok) {
        throw new Error(signupData.error || 'Signup failed');
      }

      console.log('Signup successful:', signupData);

      const sendEmailRes = await fetch('/api/users/sendVerificationEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: signupData.user.id, email: signupData.user.email }),
      });

      if (!sendEmailRes.ok) {
        console.error('Failed to send verification email');
      }

      router.push('/sign-in');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const isButtonDisabled = !(user.email && user.username && user.password) || loading;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Sign Up</h1>
      
      {error && <p style={styles.errorText}>{error}</p>}

      <div style={styles.formContainer}>
        <h2 style={styles.subHeading}>Create Your Account</h2>
        <form onSubmit={signUp} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="email">Email:</label>
            <input
              style={styles.input}
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="username">Username:</label>
            <input
              style={styles.input}
              type="text"
              id="username"
              name="username"
              value={user.username}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="password">Password:</label>
            <input
              style={styles.input}
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button
            type="submit"
            style={{ 
              ...styles.button, 
              backgroundColor: isButtonDisabled ? '#ccc' : styles.button.backgroundColor,
              cursor: isButtonDisabled ? 'not-allowed' : 'pointer'
            }}
            disabled={isButtonDisabled}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
      </div>

      <p style={styles.signUpLink}>
        Already have an account? <Link href="/sign-in" style={styles['signUpLink a']}>Sign in here</Link>
      </p>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f4f7f6",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "2.5em",
    marginBottom: "20px",
    color: "#333",
  },
  subHeading: {
    fontSize: "1.5em",
    marginBottom: "15px",
    color: "#555",
    textAlign: "center",
    width: "100%",
  },
  formContainer: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
    marginBottom: "20px",
    boxSizing: "border-box",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    marginBottom: "8px",
    display: "block",
    fontWeight: "bold",
    color: "#666",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1em",
    boxSizing: "border-box",
  },
  button: {
    padding: "12px 20px",
    backgroundColor: "#0070f3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1.1em",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
    marginTop: "10px",
  },
  buttonHover: {
    backgroundColor: "#005bb5",
  },
  errorText: {
    color: "#e74c3c",
    marginBottom: "15px",
    textAlign: "center",
    fontWeight: "bold",
  },
  orDivider: {
    margin: "20px 0",
    fontSize: "1.2em",
    color: "#888",
    position: "relative",
  },
  socialButtonsContainer: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  githubButton: {
    backgroundColor: "#333",
  },
  googleButton: {
    backgroundColor: "#db4437",
  },
  signUpLink: {
    marginTop: "25px",
    color: "#666",
    textAlign: 'center',
  },
  'signUpLink a': {
    color: "#0070f3",
    textDecoration: "none",
    fontWeight: "bold",
  },
  'signUpLink a:hover': {
    textDecoration: "underline",
  },
};