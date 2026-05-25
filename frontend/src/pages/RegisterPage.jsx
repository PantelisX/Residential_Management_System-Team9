import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../styles/LoginRegister.css';

export default function RegisterPage() {
  const navigate = useNavigate();

  // FORM STATE
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');
  const [isTechnician, setIsTechnician] =
    useState(false);

  // UI STATE
  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] =
    useState(false);

  const [touched, setTouched] =
    useState({});

  // VALIDATION

  const validateName = (value) => {
    const nameRegex =
      /^[A-Za-zΑ-Ωα-ωΆ-Ώά-ώ\s]+$/;

    if (!value.trim())
      return 'Name is required';

    if (value.trim().length < 2)
      return 'Minimum 2 characters';

    if (!nameRegex.test(value))
      return 'Only letters allowed';

    return '';
  };

  const validateEmail = (value) => {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value.trim())
      return 'Email is required';

    if (!emailRegex.test(value))
      return 'Invalid email';

    return '';
  };

  const validatePhone = (value) => {
    const phoneRegex = /^[0-9]{10}$/;

    if (!value.trim())
      return 'Phone is required';

    if (!phoneRegex.test(value))
      return 'Must be exactly 10 digits';

    return '';
  };

  const validatePassword = (value) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!value.trim())
      return 'Password is required';

    if (!passwordRegex.test(value))
      return 'Invalid password';

    return '';
  };

  const validateConfirmPassword = (
    value
  ) => {
    if (!value.trim())
      return 'Please confirm password';

    if (value !== password)
      return 'Passwords do not match';

    return '';
  };

  // ERRORS

  const nameError =
    touched.name && validateName(name);

  const emailError =
    touched.email &&
    validateEmail(email);

  const phoneError =
    touched.phone &&
    validatePhone(phone);

  const passwordError =
    touched.password &&
    validatePassword(password);

  const confirmPasswordError =
    touched.confirmPassword &&
    validateConfirmPassword(
      confirmPassword
    );

  // FORM VALIDATION

  const isFormValid =
    !validateName(name) &&
    !validateEmail(email) &&
    !validatePhone(phone) &&
    !validatePassword(password) &&
    !validateConfirmPassword(
      confirmPassword
    );

  // SUBMIT

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    });

    if (!isFormValid) return;

    setLoading(true);
    setError('');

    try {
      await authService.register({
        name,
        email,
        phone,
        password,
        is_technician: isTechnician,
      });

      alert(
        'Registration successful'
      );

      navigate('/login');
    } catch (err) {
      console.error(err);

      setError(
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <h1 className="auth-system-title">
          Residential Maintenance
          Management System
        </h1>

        <p className="auth-subtitle">
          Create your account
        </p>

        <form onSubmit={handleSubmit}>
          {/* FULL NAME */}
          <div className="auth-form-group">
            <label className="auth-label">
              Full Name
            </label>

            <input
              type="text"
              className={`auth-input ${
                nameError
                  ? 'invalid'
                  : ''
              }`}
              placeholder="Enter your full name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              onBlur={() =>
                setTouched(
                  (prev) => ({
                    ...prev,
                    name: true,
                  })
                )
              }
            />

            {nameError && (
              <p className="error-text">
                {nameError}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div className="auth-form-group">
            <label className="auth-label">
              Email
            </label>

            <input
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

          {/* PHONE */}
          <div className="auth-form-group">
            <label className="auth-label">
              Phone Number
            </label>

            <input
              type="tel"
              className={`auth-input ${
                phoneError
                  ? 'invalid'
                  : ''
              }`}
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
              onBlur={() =>
                setTouched(
                  (prev) => ({
                    ...prev,
                    phone: true,
                  })
                )
              }
            />

            {phoneError && (
              <p className="error-text">
                {phoneError}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="auth-form-group">
            <label className="auth-label">
              Password
            </label>

            <div className="password-wrapper">
              <input
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
                placeholder="Create password"
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
                {showPassword ? ( <FaEye />) : ( <FaEyeSlash />)}
              </span>
            </div>

            <ul className="validation-list">
              <li
                className={`validation-item ${
                  password.length >= 8
                    ? 'valid'
                    : ''
                }`}
              >
                • At least 8 characters
              </li>

              <li
                className={`validation-item ${
                  /[A-Z]/.test(
                    password
                  )
                    ? 'valid'
                    : ''
                }`}
              >
                • One uppercase
                letter
              </li>

              <li
                className={`validation-item ${
                  /\d/.test(
                    password
                  )
                    ? 'valid'
                    : ''
                }`}
              >
                • One number
              </li>
            </ul>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="auth-form-group">
            <label className="auth-label">
              Confirm Password
            </label>

            <div className="password-wrapper">
              <input
                type={
                  showConfirmPassword
                    ? 'text'
                    : 'password'
                }
                className={`auth-input ${
                  confirmPasswordError
                    ? 'invalid'
                    : ''
                }`}
                placeholder="Re-enter password"
                value={
                  confirmPassword
                }
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                onBlur={() =>
                  setTouched(
                    (prev) => ({
                      ...prev,
                      confirmPassword:
                        true,
                    })
                  )
                }
              />

              <span
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword ? (<FaEye />) : (<FaEyeSlash />)}
              </span>
            </div>

            {confirmPassword &&
              password !==
                confirmPassword && (
                <p className="error-text">
                  Passwords do not
                  match
                </p>
              )}
          </div>

          {/* CHECKBOX */}
          <div className="auth-checkbox">
            <input
              type="checkbox"
              checked={
                isTechnician
              }
              onChange={(e) =>
                setIsTechnician(
                  e.target.checked
                )
              }
            />

            <span>
              Technician account
            </span>
          </div>

          {/* SERVER ERROR */}
          {error && (
            <p className="error-text">
              {error}
            </p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            className="auth-button"
            disabled={
              !isFormValid ||
              loading
            }
          >
            {loading
              ? 'Creating account...'
              : 'Register'}
          </button>
        </form>

        <p className="auth-link-text">
          Already have an account?{' '}
          <Link
            to="/login"
            className="auth-link"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}