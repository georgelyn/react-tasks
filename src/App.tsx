import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import PrivateRoute from './components/PrivateRoute';
import TaskDetails from './components/tasks/TaskDetails';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import SignUp from './pages/register/SignUp';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <PrivateRoute exact path="/" component={Home} />
          <Route path="/signup" component={SignUp} />
          <Route path="/login" component={Login} />
          <PrivateRoute exact path="/task/:id?" component={TaskDetails} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
