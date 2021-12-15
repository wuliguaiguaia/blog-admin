import React, { FunctionComponent } from 'react'
import { BrowserRouter as Router, Route} from 'react-router-dom'
import Editor from './pages/editor/Index'
import Management from './pages/management/Index'

const App: FunctionComponent = () => (
  <div>
    <Router>
      <Route path="/" component={Management} />
      <Route path="/editor/:id" component={Editor} />
    </Router>
  </div>
)
export default App
