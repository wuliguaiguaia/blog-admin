import React, { FunctionComponent } from 'react'
import {
  BrowserRouter as Router, Route, Redirect, Switch,
} from 'react-router-dom'
import Editor from './pages/editor/Index'
import Management from './pages/management/Index'

const App: FunctionComponent = () => (
  <div>
    <Router>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/workbench" push />} />
        <Route path="/editor/" component={Editor} />
        <Route path="/" component={Management} />
      </Switch>
    </Router>
  </div>
)
export default App
