import React from 'react'
import { Route } from 'react-router-dom'
import cns from 'classnames'
import { useSelector } from 'react-redux'
import LeftMenu from '@/common/components/LeftMenu'
import Workbench from './pages/workBench'
import UserList from './pages/userList/index'
import styles from './index.scss'
import Analysis from './pages/analysis'
import ArticleList from './pages/articleList'
import CategoryList from './pages/categoryList'
import Header from './components/Header'
import MessageCenter from './pages/messageCenter'
import CommentList from './pages/commentList'
import { RootState } from '@/store/reducers/interface'

const Management = () => {
  const { loginStatus } = useSelector((state: RootState) => state.common)
  return (
    <>
      <div className={cns(['flex', styles.wrapper])}>
        <LeftMenu />
        <div className={styles.container}>
          <Header />
          {
            loginStatus === 1 ? (
              <>
                <Route path="/workbench" component={Workbench} />
                <Route path="/articlelist" component={ArticleList} />
                <Route path="/categorylist" component={CategoryList} />
                <Route path="/analysis" component={Analysis} />
                <Route path="/commentlist" component={CommentList} />
                <Route path="/messagecenter" component={MessageCenter} />
                <Route path="/userlist" component={UserList} />
              </>
            ) : '未登录'
          }
        </div>
      </div>
    </>
  )
}

export default Management
