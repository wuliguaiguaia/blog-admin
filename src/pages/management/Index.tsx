import React from 'react'
import { Route } from 'react-router-dom'
import cns from 'classnames'
import LeftMenu from '@/common/components/LeftMenu'
import Workbench from './pages/WorkBench'
import UserList from './pages/UserList/index'
import styles from './index.scss'
import Analysis from './pages/Analysis/index'
import ArticleList from './pages/ArticleList'
import CategoryList from './pages/CategoryList'
import Header from './components/Header'

const Management = () => (
  <>
    <div className={cns(['flex', styles.wrapper])}>
      <LeftMenu />
      <div className={styles.container}>
        <Header />
        <Route path="/workbench" component={Workbench} />
        <Route path="/articlelist" component={ArticleList} />
        <Route path="/categorylist" component={CategoryList} />
        <Route path="/analysis" component={Analysis} />
        <Route path="/userlist" component={UserList} />
      </div>
    </div>
  </>
)

export default Management
