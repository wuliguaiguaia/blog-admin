import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Header from '@/common/components/Header/Index'
import LeftMenu from '@/common/components/LeftMenu/Index'
import Footer from '@/common/components/Footer/Index'
import workbench from './workBench/Index'
import userList from './userList'
import styles from './Index.scss'
import articleList from './articlelist/Index'
import Analysis from './analysis/Index'

const management = () => (
  <>
    <Router>
      <div className="flex">
        <LeftMenu />
        <div className={styles.container}>
          <Header />
          <Route path="/" exact component={workbench} />
          <Route path="/articlelist" component={articleList} />
          <Route path="/analysis" component={Analysis} />
          <Route path="/userlist" component={userList} />
        </div>
      </div>
      <Footer />
    </Router>
  </>
)

export default management
