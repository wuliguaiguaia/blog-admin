import React from 'react'
import { Route } from 'react-router-dom'
import cns from 'classnames'
import Header from '@/common/components/Header'
import LeftMenu from '@/common/components/LeftMenu'
import Workbench from './pages/workBench'
import UserList from './pages/userList/index'
import styles from './index.scss'
import Analysis from './pages/analysis/index'
import ArticleList from './pages/articleList'
import CategoryList from './pages/categoryList'

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
