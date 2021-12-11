import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
// import Header from '@/common/components/Header/Index'
import LeftMenu from '@/common/components/LeftMenu/Index'
import Footer from '@/common/components/Footer/Index'
import workbench from './workBench/Index'
import userList from './userList'

const management = () => (
  <div>
    {/* <Header /> */}
    <LeftMenu />
    <Router>
      <Route path="/" exact component={workbench} />
      <Route path="/userList/" component={userList} />
    </Router>
    <Footer />
  </div>
)

export default management
