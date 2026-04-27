import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Stethoscope, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { registerServiceWorker, scheduleLoginNotification } from '../../services/notifications';
import './LoginPage.css';

const DEMO_EMAIL = 'demo@health.com';
const DEMO_PASSWORD = 'Demo@1234';

export function LoginPage() {
  const { signIn, isAuthenticated, authLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    registerServiceWorker();
  }, []);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const validate = (): boolean => {
    let valid = true;
    setEmailError('');
    setPasswordError('');

    if (!email.trim()) {
      setEmailError('Email address is required.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }
    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await signIn(email, password);
      scheduleLoginNotification(user.displayName, 6);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const message = (err as { message?: string }).message ?? 'Login failed.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError('');
    setEmailError('');
    setPasswordError('');
  };

  return (
    <div className="login-page" id="login-page">
      {/* Animated background */}
      <div className="login-bg">
        <div className="login-bg-orb login-bg-orb--1" />
        <div className="login-bg-orb login-bg-orb--2" />
        <div className="login-bg-orb login-bg-orb--3" />
        <div className="login-bg-grid" />
      </div>

      {/* Left Panel */}
      <div className="login-left">
        <div className="login-left-content animate-fade-in">
          <div className="login-brand">
            <div className="login-brand-icon">
              <Stethoscope size={28} />
            </div>
            <div>
              <div className="login-brand-name">HealthOS</div>
              <div className="login-brand-tagline">Enterprise Healthcare Platform</div>
            </div>
          </div>

          <h2 className="login-headline">
            Modern Healthcare<br />
            <span className="gradient-text">Management Simplified</span>
          </h2>
          <p className="login-subtext">
            Streamline patient care, analytics, and clinical operations with the most advanced healthcare SaaS platform.
          </p>

          <div className="login-features">
            {[
              { icon: '🏥', label: 'Patient Management', desc: '20+ integrated modules' },
              { icon: '📊', label: 'Real-time Analytics', desc: 'Live clinical dashboards' },
              { icon: '🔔', label: 'Smart Notifications', desc: 'Push alerts & reminders' },
            ].map((f, i) => (
              <div className="login-feature" key={i}>
                <span className="login-feature-icon">{f.icon}</span>
                <div>
                  <div className="login-feature-label">{f.label}</div>
                  <div className="login-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="login-stats">
            {[
              { value: '50K+', label: 'Patients Managed' },
              { value: '99.9%', label: 'Uptime SLA' },
              { value: '200+', label: 'Hospitals' },
            ].map((s, i) => (
              <div className="login-stat" key={i}>
                <div className="login-stat-value">{s.value}</div>
                <div className="login-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="login-right">
        <div className="login-card animate-scale-in" id="login-card">
          <div className="login-card-header">
            <div className="login-card-icon">
              <Stethoscope size={22} />
            </div>
            <h1 className="login-card-title">Welcome back</h1>
            <p className="login-card-subtitle">Sign in to your HealthOS account</p>
          </div>

          {/* Demo hint */}
          <button
            type="button"
            className="demo-hint"
            onClick={fillDemo}
            id="fill-demo-btn"
          >
            <span>🎯</span>
            <span>Use demo credentials: <strong>{DEMO_EMAIL}</strong> / <strong>{DEMO_PASSWORD}</strong></span>
            <span className="demo-hint-click">Click to fill →</span>
          </button>

          <form onSubmit={handleSubmit} className="login-form" noValidate id="login-form">
            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <div className={`input-wrapper ${emailError ? 'input-wrapper--error' : ''}`}>
                <Mail size={16} className="input-icon" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                  placeholder="doctor@hospital.com"
                  className="form-input"
                  autoComplete="email"
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? 'email-error' : undefined}
                />
              </div>
              {emailError && <div className="form-error" id="email-error"><AlertCircle size={12} />{emailError}</div>}
            </div>

            {/* Password */}
            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label" htmlFor="login-password">Password</label>
                <button type="button" className="form-forgot">Forgot password?</button>
              </div>
              <div className={`input-wrapper ${passwordError ? 'input-wrapper--error' : ''}`}>
                <Lock size={16} className="input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                  placeholder="Enter your password"
                  className="form-input"
                  autoComplete="current-password"
                  aria-invalid={!!passwordError}
                  aria-describedby={passwordError ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  className="input-toggle-eye"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  id="toggle-password-visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordError && <div className="form-error" id="password-error"><AlertCircle size={12} />{passwordError}</div>}
            </div>

            {/* Global error  */}
            {error && (
              <div className="login-alert" id="login-error-alert" role="alert">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
              id="login-submit-btn"
            >
              {loading ? (
                <>
                  <span className="btn-spinner" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <span>Secured by</span>
            <span className="login-footer-brand">🔐 HealthOS Security</span>
            <span>·</span>
            <span>HIPAA Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
