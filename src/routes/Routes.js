import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { dashboard as dashboardRoutes, auth as authRoutes } from "./index";

import DashboardLayout from "../layouts/Dashboard";
// import AuthLayout from "../layouts/Auth";
import { AuthUserContext } from "../Session";
// const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL

const childRoutes = (Layout, routes) =>
  routes.map(({ children, path, component: Component }, index) =>
    children ? (
      // Route item with children
      children.map(({ path, component: Component }, index) => (
        <Route
          key={index}
          path={path}
          exact
          render={props => (
            <Layout>
              <Component {...props} />
            </Layout>
          )}
        />
      ))
    ) : (
      // Route item without children
      <Route
        key={index}
        path={path}
        exact
        render={props => (
          <Layout>
            <Component {...props} />
          </Layout>
        )}
      />
    )
  );

const Routes = () => (
  <Router>
    <Switch>
      <Route

        render={() => (


          <AuthUserContext.Consumer>
            {authUser => (authUser ? childRoutes(DashboardLayout, dashboardRoutes) : childRoutes(DashboardLayout, authRoutes))}
          </AuthUserContext.Consumer>
        )}
      />
    </Switch>
  </Router>
);

export default Routes;
