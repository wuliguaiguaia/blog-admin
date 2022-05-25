import React, { lazy, Suspense } from 'react'
import { Route } from 'react-router-dom'
import cns from 'classnames'
import { useSelector } from 'react-redux'
import LeftMenu from '@/common/components/LeftMenu'
import styles from './index.scss'
// import Analysis from './pages/analysis'
// import ArticleList from './pages/articleList'
// import Workbench from './pages/workBench'
// import UserList from './pages/userList/index'
// import CategoryList from './pages/categoryList'
// import MessageCenter from './pages/messageCenter'
// import CommentList from './pages/commentList'
import Header from './components/Header'
import { RootState } from '@/store/reducers/interface'

const Workbench = lazy(() => import(/* webpackChunkName: "workBench" */'./pages/workBench'))
const ArticleList = lazy(() => import(/* webpackChunkName: "articleList" */'./pages/articleList'))
const CategoryList = lazy(() => import(/* webpackChunkName: "categoryList" */'./pages/categoryList'))
const Analysis = lazy(() => import(/* webpackChunkName: "analysis" */'./pages/analysis'))
const CommentList = lazy(() => import(/* webpackChunkName: "commentList" */'./pages/commentList'))
const MessageCenter = lazy(() => import(/* webpackChunkName: "messageCenter" */'./pages/messageCenter'))
const UserList = lazy(() => import(/* webpackChunkName: "userList" */'./pages/userList'))

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
              <Suspense fallback={<div>loading...</div>}>
                <Route path="/workbench" component={Workbench} />
                <Route path="/articlelist" component={ArticleList} />
                <Route path="/categorylist" component={CategoryList} />
                <Route path="/analysis" component={Analysis} />
                <Route path="/commentlist" component={CommentList} />
                <Route path="/messagecenter" component={MessageCenter} />
                <Route path="/userlist" component={UserList} />
              </Suspense>
            ) : '未登录'
          }
        </div>
      </div>
    </>
  )
}

export default Management
