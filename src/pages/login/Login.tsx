import { useState } from 'react';
import './Login.css';
import { Link, useHistory } from 'react-router-dom';
import { login } from '../../contexts/AuthContext';
import { Alert, Button, Container, Form } from 'react-bootstrap';
import { firebaseError, firebaseErrorMap } from '../../utils';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const history = useHistory();

  const validateForm = () => {
    return email.length > 0 && password.length > 0;
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      await login(email, password);
      history.push('/');
    } catch (error: any) {
      const key = firebaseError(error.message);

      if (firebaseErrorMap.has(key)) {
        setError(firebaseErrorMap.get(key));
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <Container className="login d-flex flex-column align-items-center justify-content-center">
      <h1 className="text-center mb-5">Geo-Tasks</h1>
      <Form className="login-form" onSubmit={handleSubmit}>
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
          />
        </Form.Group>
        <Button className="login-btn" type="submit" disabled={!validateForm()}>
          Sign In
        </Button>
        <div className="w-100 text-center mt-2">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </Form>
    </Container>
  );
}
