import React, { useState } from 'react';
import { auth } from '../../libs/db';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setMessage('Logged in successfully!');
    } catch (error) {console.log("error is "+ error.code);
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Invalid email or password.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address.');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled.');
          break;
        case 'auth/network-request-failed':
           setError('network request faild.');
           break;  
        case 'auth/invalid-credential':
            setError('Invalid credentials.');
            break; 
        case 'auth/too-many-requests':
          setError('Too many failed login attempts. Please try again later.');
          break;
        default:
          setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        'If an account with this email exists, a password reset email has been sent. Please check your inbox.'
      );
    } catch (error) {
      console.log("Error: " + error.code);
    
      // Handle errors
      switch (error.code) {
        case 'auth/invalid-email':
          setError('Invalid email address.');
          break;
        case 'auth/user-not-found':
          setError('No user found with this email address.');
          break;
        default:
          setError('An error occurred. Please try again.');
      }
    }
     finally {
      setIsLoading(false);
    }
  };

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100'
      }}
    >
      <Box 
        sx={{
          maxWidth: 400,
          width: '100%',
          p: 4,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3
        }}
      >
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          {isResetPassword ? 'Reset Password' : 'Sign in to your account'}
        </Typography>
        <form onSubmit={isResetPassword ? handleResetPassword : handleSignIn}>
          <TextField
            fullWidth
            margin="normal"
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {!isResetPassword && (
            <TextField
              fullWidth
              margin="normal"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (isResetPassword ? 'Reset Password' : 'Sign In')}
          </Button>
        </form>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Link
            component="button"
            variant="body2"
            onClick={() => setIsResetPassword(!isResetPassword)}
          >
            {isResetPassword ? 'Back to Sign In' : 'Forgot password?'}
          </Link>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        {message && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <AlertTitle>Success</AlertTitle>
            {message}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default LoginPage;

