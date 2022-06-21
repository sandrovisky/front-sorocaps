import React from 'react';
import { useSelector } from 'react-redux';

import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
  Navigate,
} from "react-router-dom";
import CreateUserForm from './Login/NewUser/newUserForm';
import Home from './Home/home';

import Login from './Login/login';
import NewCustomerForm from './Home/Customers/newCustomer';

const Routes = () => {
  const user = useSelector(state => state.user)

  if (!user.logged) {
    return <Router>
      <Switch>
        <Route path="/home/" element={<Login />} />
        <Route path="/create-user/" element={<CreateUserForm />} />
        <Route path="*" element={<Navigate to="/home/"  />} />
      </Switch>
    </Router>
  } else {
    return <Router>
      <Switch>
        <Route path="/home/" element={<Home />} />
        <Route path="/home/customer/create/" element={<NewCustomerForm />} />
        <Route path="*" element={<Navigate to="/home/"  />} />
      </Switch>
    </Router>
  }
}

export default Routes;