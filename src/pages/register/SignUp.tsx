import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import Loader from '../../components/layout/Loader';
import { register } from '../../contexts/AuthContext';
import { firebaseError, firebaseErrorMap } from '../../utils';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(false);

  const history = useHistory();

  const validateForm = () => {
    return (
      email.length > 0 && password.length > 0 && password === confirmPassword
    );
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setShowLoader(true);
    try {
      await register(email, password);
      history.push('/login');
    } catch (error: any) {
      const key = firebaseError(error.message);

      if (firebaseErrorMap.has(key)) {
        setError(firebaseErrorMap.get(key));
      } else {
        setError(error.message);
      }
    } finally {
      setShowLoader(false);
    }
  };

  const handleConfirmPassword = () => {
    if (password && confirmPassword && password !== confirmPassword) {
      setError('The passwords must match.');
    } else {
      if (error) {
        setError('');
      }
    }
  };

  return (
    <>
      <Loader show={showLoader} />
      <Container className="login d-flex flex-column align-items-center justify-content-center">
        <h1 className="text-center mb-5">Geo-Tasks</h1>
        <Form className="login-form " onSubmit={handleSubmit}>
          {error && (
            <Alert variant="warning" onClick={() => setError('')} dismissible>
              {error}
            </Alert>
          )}
          <Form.Group controlId="email">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              autoFocus
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={handleConfirmPassword}
            />
          </Form.Group>
          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm password:</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={handleConfirmPassword}
            />
          </Form.Group>
          <Button
            className="login-btn"
            type="submit"
            disabled={!validateForm()}
          >
            Sign Up
          </Button>
          <div className="w-100 text-center mt-2">
            Already have an account? <Link to="/login">Sign In</Link>
          </div>
        </Form>
      </Container>
    </>
  );
}
