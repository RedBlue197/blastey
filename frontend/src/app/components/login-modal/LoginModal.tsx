"use client";

import { useState, ChangeEvent } from "react";
// import { signIn } from "next-auth/react"; // Uncomment for actual sign-in
import styles from "./LoginModal.module.css"; // Import the CSS module
import {fetchToken} from "@/services/auth_api_handler"

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [view, setView] = useState<"login" | "signUp" | "emailSignIn" | "forgotPassword">("login");

  const handleSignIn = async (provider: string) => {
    try {
      // await signIn(provider); // Uncomment for actual sign-in
      console.log(`Signing in with ${provider}`);
    } catch (error) {
      setError("Sign-in failed. Please try again.");
    }
  };

  const handleEmailSignIn = async () => {
    try {
      // Implement email sign-in logic here
      console.log("Signing in with email:", email);
      
      const signInData={
        "username":email,
        "password":password
      }
      const result = await fetchToken(
              signInData,null
            ).then((response)=>{
              if (response.status === 200) {
                console.log("Successfully connected")
              }
              else if (response.status ===401) {
                console.error("Wrong credantials")
              }
            })
    } catch (error) {
      setError("Sign-in failed. Please try again.");
    }
  };

  const handleEmailSignUp = async () => {
    try {
      // Implement email sign-up logic here
      console.log("Signing up with email:", email);
    } catch (error) {
      setError("Sign-up failed. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    setView("forgotPassword");
  };

  const handleGoToSignUp = () => {
    setView("signUp");
  };

  const handleGoToSignIn = () => {
    setView("login");
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        {(view === "forgotPassword" || view === "emailSignIn") && (
          <button className={styles.backButton} onClick={handleGoToSignIn}>
            &larr;
          </button>
        )}
        {view === "login" && (
          <>
            <h1 className={styles.title}>Login</h1>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.buttons}>
              <button
                className={`${styles.button} ${styles.google}`}
                onClick={() => handleSignIn("google")}
              >
                Sign in with Google
              </button>
              <button
                className={`${styles.button} ${styles.facebook}`}
                onClick={() => handleSignIn("facebook")}
              >
                Sign in with Facebook
              </button>
              <button
                className={`${styles.button} ${styles.apple}`}
                onClick={() => handleSignIn("apple")}
              >
                Sign in with Apple
              </button>
              <div className={styles.emailSection}>
                <p className={styles.emailLabel}>Or use your email</p>
                <div className={styles.actionButtons}>
                  <button
                    className={`${styles.button} ${styles.signUp}`}
                    onClick={handleGoToSignUp}
                  >
                    Sign Up
                  </button>
                  <button
                    className={`${styles.button} ${styles.signIn}`}
                    onClick={() => setView("emailSignIn")}
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.terms}>
              <p>
                By using Seftly, you agree to <a href="/terms" className={styles.link}>Seftly's Terms of Service</a> and <a href="/privacy" className={styles.link}>Privacy Policy</a>.
              </p>
            </div>
          </>
        )}
        {view === "emailSignIn" && (
          <>
            <h1 className={styles.title}>Sign In</h1>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.emailSection}>
              <p className={styles.emailLabel}>Sign in with Email</p>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                className={styles.emailInput}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                className={styles.passwordInput}
              />
              <button
                className={`${styles.button} ${styles.signIn}`}
                onClick={handleEmailSignIn}
              >
                Sign In
              </button>

              <p className={styles.forgotPassword} onClick={handleForgotPassword}>
                Forgot your password?
              </p>
              <p className={styles.switchView}>
                Don't have an account? <span onClick={handleGoToSignUp} className={styles.link}>Register here</span>
              </p>
            </div>
            <div className={styles.terms}>
              <p>
                By using Seftly, you agree to <a href="/terms" className={styles.link}>Seftly's Terms of Service</a> and <a href="/privacy" className={styles.link}>Privacy Policy</a>.
              </p>
            </div>
          </>
        )}
        {view === "signUp" && (
          <>
            <h1 className={styles.title}>Sign Up</h1>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.emailSection}>
              <p className={styles.emailLabel}>Sign up with Email</p>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                className={styles.emailInput}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                className={styles.passwordInput}
              />
              <button
                className={`${styles.button} ${styles.signUp}`}
                onClick={handleEmailSignUp}
              >
                Sign Up
              </button>
              <p className={styles.switchView}>
                Already have an account? <span onClick={() => setView("emailSignIn")} className={styles.link}>Sign In</span>
              </p>
            </div>
            <div className={styles.terms}>
              <p>
                By using Seftly, you agree to <a href="/terms" className={styles.link}>Seftly's Terms of Service</a> and <a href="/privacy" className={styles.link}>Privacy Policy</a>.
              </p>
            </div>
          </>
        )}
        {view === "forgotPassword" && (
          <>
            <h1 className={styles.title}>Forgot Password</h1>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.emailSection}>
              <p className={styles.emailLabel}>Enter your email to reset your password</p>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                className={styles.emailInput}
              />
              <button
                className={`${styles.button} ${styles.signIn}`}
                onClick={() => console.log("Resetting password for email:", email)}
              >
                Reset Password
              </button>
              <p className={styles.switchView}>
                Remembered your password? <span onClick={handleGoToSignIn} className={styles.link}>Sign In</span>
              </p>
            </div>
            <div className={styles.terms}>
              <p>
                By using Seftly, you agree to <a href="/terms" className={styles.link}>Seftly's Terms of Service</a> and <a href="/privacy" className={styles.link}>Privacy Policy</a>.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
