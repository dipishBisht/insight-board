import { useState } from 'react';
import {
  useSignInWithEmailAndPassword,
  useCreateUserWithEmailAndPassword,
} from 'react-firebase-hooks/auth';
import { auth } from '../../lib/firebase';
import AuthContainer from './auth-container';
import AuthForm from './auth-form';

function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [signInWithEmailAndPassword, , loadingSignIn, errorSignIn] =
    useSignInWithEmailAndPassword(auth);

  const [createUserWithEmailAndPassword, , loadingSignup, errorSignup] =
    useCreateUserWithEmailAndPassword(auth);

  const handleAuth = async () => {
    setErrorMessage(null);
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(email, password);
      } else {
        await signInWithEmailAndPassword(email, password);
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const toggleAuthMode = () => {
    setIsSignup(!isSignup);
    setErrorMessage(null);
  };

  const finalError =
    errorMessage ||
    errorSignIn?.message ||
    errorSignup?.message ||
    (errorSignIn && 'Failed to sign in. Please check your credentials.') ||
    (errorSignup && 'Failed to create account. Please try again.');

  const loading = loadingSignIn || loadingSignup;

  return (
    <AuthContainer
      title={isSignup ? 'Create Your Account' : 'Welcome Back'}
      subtitle={isSignup ? 'Join us today!' : 'Sign in to continue'}
    >
      <AuthForm
        isSignup={isSignup}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleAuth={handleAuth}
        loading={loading}
        error={finalError}
        toggleAuthMode={toggleAuthMode}
      />
    </AuthContainer>
  );
}

export default Auth;
