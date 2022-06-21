import React from 'react';
import { useSelector } from 'react-redux';

import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
  Navigate,
} from "react-router-dom";

import Home from './Home/home';

import Login from './Login/login';
import NewCustomerForm from './Home/Customers/newCustomer';
import NewUserForm from './Login/newUserForm';
import NewProductForm from './Home/Product/newProduct';
import NewOrderForm from './Home/Order/newOrder';

const Routes = () => {
  const user = useSelector(state => state.user)

  if (!user.logged) {
    return <Router>
      <Switch>
        <Route path="/home/" element={<Login />} />
        <Route path="/create-user/" element={<NewUserForm />} />
        <Route path="*" element={<Navigate to="/home/"  />} />
      </Switch>
    </Router>
  } else {
    return <Router>
      <Switch>
        <Route path="/home/" element={<Home />} />
        <Route path="/home/customers/create/" element={<NewCustomerForm />} />
        <Route path="/home/products/create/" element={<NewProductForm/>} />
        <Route path="/home/orders/create/" element={<NewOrderForm/>} />
        <Route path="*" element={<Navigate to="/home/"  />} />
      </Switch>
    </Router>
  }
}

export default Routes;