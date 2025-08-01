"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const authError = searchParams.get("error");

  useEffect(() => {
    if (authError) {
      switch (authError) {
        case "CredentialsSignin":
          setError("Invalid credentials. Please check your email and password.");
          break;
        case "OAuthAccountNotLinked":
          setError("This email is already registered with a different provider.");
          break;
        case "EmailSignin":
          setError("Check your email for a magic link!");
          break;
        case "OAuthSignin":
          setError("Error signing in with OAuth provider.");
          break;
        case "SessionRequired":
          setError("Please sign in to access this page.");
          break;
        default:
          setError("An unexpected error occurred. Please try again.");
          break;
      }
    }
  }, [authError]);

  const handleCredentialsSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await signIn("credentials", {
        redirect: false, // Prevents Auth.js from doing its own redirect
        username,
        password,
        callbackUrl: callbackUrl, // Pass the original callback URL
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch (err: any) {
      console.error("Sign-in error:", err);
      setError("An unexpected network error occurred.");
    }
  };

  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: callbackUrl });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Sign In</h1>

      {error && <p style={styles.errorText}>{error}</p>}

      <div style={styles.formContainer}>
        {/* Credentials (Email/Password) Form */}
        <h2 style={styles.subHeading}>Sign in with Email & Password</h2>
        <form onSubmit={handleCredentialsSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>Sign In</button>
        </form>
      </div>
      <p style={styles.signUpLink}>
        Don't have an account? <a href="/sign-up">Sign up here</a>
      </p>
    </div>
  );
}

// Basic Inline Styles (you'd typically use CSS modules or Tailwind CSS)
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
    width: "calc(100% - 20px)",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1em",
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
    gap: "10px", // Spacing between buttons
  },
  githubButton: {
    backgroundColor: "#333", // GitHub's brand color
  },
  googleButton: {
    backgroundColor: "#db4437", // Google's brand color
  },
  signUpLink: {
    marginTop: "25px",
    color: "#666",
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