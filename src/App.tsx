import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/home/Home';
import TaskDetails from './pages/task/TaskDetails';
import Login from './pages/login/Login';
import SignUp from './pages/register/SignUp';
import CategoryDetails from './pages/category/CategoryDetails';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <>
            <div className="App">
              <PrivateRoute exact path="/" component={Home} />
              <Route path="/signup" component={SignUp} />
              <Route path="/login" component={Login} />
              <PrivateRoute exact path="/task/:id?" component={TaskDetails} />
              <PrivateRoute
                exact
                path="/categories"
                component={CategoryDetails}
              />
            </div>
          </>
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
