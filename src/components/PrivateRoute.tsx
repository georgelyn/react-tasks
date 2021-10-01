import React, { useContext } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute: React.FunctionComponent<RouteProps> = ({
  component: RouteComponent,
  ...routeProps
}) => {
  const user = useContext(AuthContext);

  return user ? (
    <Route {...routeProps} component={RouteComponent} />
  ) : (
    <Redirect to="/login" />
  );

  // return <Route {...routeProps} component={RouteComponent} />;
  // return (
  //   // <Route
  //   //   {...routeProps}
  //   //   render={(props) => (user ? <Component /> : <Redirect to="/login" />)}
  //   // />
  // );
};

export default PrivateRoute;
