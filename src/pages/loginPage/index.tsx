import React from 'react'
import { Route } from 'react-router-dom'
import Login from './pages/Login'
import PasswordReset from './pages/PasswordReset'
import Register from './pages/Register'
import styles from './index.scss'

const LoginPage = () => (
  <div className={styles.wrapper}>
    <Route exact path="/u/login" component={Login} />
    <Route exact path="/u/register" component={Register} />
    <Route exact path="/u/password_reset" component={PasswordReset} />
  </div>
)

export default LoginPage
