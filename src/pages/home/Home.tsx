import { logOut } from '../../contexts/AuthContext';
import { Button, Container } from 'react-bootstrap';

export default function Home() {
  const signOut = () => {
    logOut()
      .then(() => {
        console.log('logged out');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Container className="d-flex justify-content-between align-items-center">
      <h1>Home</h1>
      <Button onClick={signOut}>Log Out</Button>
    </Container>
  );
}
