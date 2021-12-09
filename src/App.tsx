import React, { FunctionComponent } from 'react'
import { BrowserRouter as Router, Route} from 'react-router-dom'
import management from './pages/management/Index'

const App: FunctionComponent = () => (
  <div>
    <Router>
      <Route path="/" component={management} />
    </Router>
  </div>
)
export default App
