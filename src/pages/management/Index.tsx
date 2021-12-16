import React from 'react'
import { Route } from 'react-router-dom'
import cns from 'classnames'
import Header from '@/common/components/Header/Index'
import LeftMenu from '@/common/components/LeftMenu/Index'
// import Footer from '@/common/components/Footer/Index'
import Workbench from './workBench/Index'
import UserList from './userList'
import styles from './Index.scss'
import Analysis from './analysis/Index'
import ArticleList from './articleList/Index'

const Management = () => (
  <>
    {/* <Router> */}
    <div className={cns(['flex', styles.wrapper])}>
      <LeftMenu />
      <div className={styles.container}>
        <Header />
        <Route path="/workbench" component={Workbench} />
        <Route path="/articlelist" component={ArticleList} />
        <Route path="/analysis" component={Analysis} />
        <Route path="/userlist" component={UserList} />
      </div>
    </div>
    {/* <Footer /> */}
    {/* </Router> */}
  </>
)

export default Management
