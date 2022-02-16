import React, { FunctionComponent, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  BrowserRouter as Router, Route, Redirect, Switch,
} from 'react-router-dom'
import Editor from './pages/editor'
import LoginPage from './pages/loginPage'
import Management from './pages/management'
import { updateCommonState } from './store/reducers/common'

const App: FunctionComponent = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const onlineListener = () => dispatch(updateCommonState({offline: false}))
    const offlineListener = () => dispatch(updateCommonState({offline: true}))
    window.addEventListener('online', onlineListener)
    window.addEventListener('offline', offlineListener)
  }, [])
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/workbench" push />} />
          <Route path="/article/:id/:type" component={Editor} />
          <Route path="/u" component={LoginPage} />
          <Route path="/" component={Management} />
        </Switch>
      </Router>
    </div>
  )
}
export default App
