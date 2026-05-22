import React, { useState } from 'react';
import authService from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './LoginRegister.css';

export default function LoginPage() {
  const navigate = useNavigate();

  // FORM STATE
  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  // UI STATE
  const [showPassword,
    setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [touched, setTouched] =
    useState({});

  // VALIDATION

  const validateEmail = (
    value
  ) => {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value.trim())
      return 'Email is required';

    if (!emailRegex.test(value))
      return 'Invalid email';

    return '';
  };

  const validatePassword = (
    value
  ) => {
    if (!value.trim())
      return 'Password is required';

    return '';
  };

  // ERRORS

  const emailError =
    touched.email &&
    validateEmail(email);

  const passwordError =
    touched.password &&
    validatePassword(
      password
    );

  // FORM VALID

  const isFormValid =
    !validateEmail(email) &&
    !validatePassword(
      password
    );

  // LOGIN

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    setTouched({
      email: true,
      password: true,
    });

    if (!isFormValid)
      return;

    setError('');
    setLoading(true);

    try {
      await authService.login({
        email,
        password,
      });

      navigate('/home');
    } catch (err) {
      setError(
        'Invalid email or password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1 className="auth-system-title">
          Residential Maintenance
          Management System
        </h1>

        <p className="auth-subtitle">
          Welcome Back
        </p>

        <form
          onSubmit={handleSubmit}
        >

          {/* EMAIL */}
          <div className="auth-form-group">
            <label
              className="auth-label"
              htmlFor="email"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              className={`auth-input ${
                emailError
                  ? 'invalid'
                  : ''
              }`}
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              onBlur={() =>
                setTouched(
                  (prev) => ({
                    ...prev,
                    email: true,
                  })
                )
              }
            />

            {emailError && (
              <p className="error-text">
                {emailError}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="auth-form-group">
            <label
              className="auth-label"
              htmlFor="password"
            >
              Password
            </label>

            <div className="password-wrapper">
              <input
                id="password"
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                className={`auth-input ${
                  passwordError
                    ? 'invalid'
                    : ''
                }`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                onBlur={() =>
                  setTouched(
                    (prev) => ({
                      ...prev,
                      password:
                        true,
                    })
                  )
                }
              />

              <span
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword ? (
                  <FaEye />
                ) : (
                  <FaEyeSlash />
                )}
              </span>
            </div>

            {passwordError && (
              <p className="error-text">
                {passwordError}
              </p>
            )}
          </div>

          {/* SERVER ERROR */}
          {error && (
            <div className="error-text">
              {error}
            </div>
          )}

          {/* BUTTON */}
          <button
            className="auth-button"
            type="submit"
            disabled={
              !isFormValid ||
              loading
            }
          >
            {loading
              ? 'Logging in...'
              : 'Login'}
          </button>

        </form>

        <div className="auth-link-text">
          Don't have an account?{' '}
          <Link
            className="auth-link"
            to="/register"
          >
            Register here
          </Link>
        </div>

      </div>
    </div>
  );
}