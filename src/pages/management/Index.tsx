import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
// import Header from '@/common/components/Header/Index'
import LeftMenu from '@/common/components/LeftMenu/Index'
import Footer from '@/common/components/Footer/Index'
import workbench from './workBench/Index'
import userList from './userList'
import styles from './Index.scss'

const management = () => (
  <>
    <div className="flex">
      {/* <Header /> */}
      <LeftMenu />
      <div className={styles.container}>
        <Router>
          <Route path="/" exact component={workbench} />
          <Route path="/userList/" component={userList} />
        </Router>
      </div>
    </div>
    <Footer />
  </>
)

export default management
