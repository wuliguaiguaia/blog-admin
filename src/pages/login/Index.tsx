import React from 'react'
import { Route } from 'react-router-dom'
import Login from './pages/Login'
import PasswordReset from './pages/PasswordReset'
import Register from './pages/Register'

const LoginPage = () => (
  <div>
    <Route exact path="/login" component={Login} />
    <Route exact path="/register" component={Register} />
    <Route exact path="/password_reset" component={PasswordReset} />
  </div>
)

export default LoginPage
