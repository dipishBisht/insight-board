import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import Input from './input';
import Button from './button';
import PasswordStrength from './password-strenth';

interface AuthFormProps {
  isSignup: boolean;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleAuth: () => void;
  loading: boolean;
  error: string | undefined;
  toggleAuthMode: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  isSignup,
  email,
  setEmail,
  password,
  setPassword,
  handleAuth,
  loading,
  error,
  toggleAuthMode,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Validate email when it changes
  useEffect(() => {
    if (email.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailValid(emailRegex.test(email));
    } else {
      setEmailValid(null);
    }
  }, [email]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuth();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      {error && (
        <div className="flex items-center p-3 mb-1 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          <AlertCircle size={16} className="mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          icon={<Mail size={18} />}
          required
          status={
            emailValid === true
              ? 'success'
              : emailValid === false
              ? 'error'
              : undefined
          }
          statusIcon={
            emailValid === true ? (
              <Check size={18} className="text-green-500" />
            ) : emailValid === false ? (
              <AlertCircle size={18} className="text-red-500" />
            ) : undefined
          }
        />

        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            icon={<Lock size={18} />}
            required
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            endIcon={
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />
          {isSignup && passwordFocused && password.length > 0 && (
            <div className="mt-2">
              <PasswordStrength password={password} />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center text-gray-600 dark:text-gray-400 select-none cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="w-4 h-4 mr-2 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
            />
            Remember me
          </label>

          {!isSignup && (
            <button
              type="button"
              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
            >
              Forgot password?
            </button>
          )}
        </div>

        <Button
          type="submit"
          fullWidth
          loading={loading}
          className="mt-6"
        >
          {loading
            ? isSignup
              ? 'Creating Account...'
              : 'Logging in...'
            : isSignup
            ? 'Create Account'
            : 'Log In'}
        </Button>
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={toggleAuthMode}
            className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
          >
            {isSignup ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </form>
  );
};

export default AuthForm;