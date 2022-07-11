import { message } from 'antd'
import React, { FunctionComponent, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  BrowserRouter as Router, Route, Redirect, Switch,
} from 'react-router-dom'
import { localStorage } from './common/utils/storage'
import Editor from './pages/editor'
import LoginPage from './pages/loginPage'
import Management from './pages/management'
import { getUserInfo, getUserRoleList, updateCommonState } from './store/reducers/common'
import { RootState } from './store/reducers/interface'

const App: FunctionComponent = () => {
  const dispatch = useDispatch()
  const { loginStatus } = useSelector((state:RootState) => state.common)
  useEffect(() => {
    const onlineListener = () => dispatch(updateCommonState({offline: false}))
    const offlineListener = () => dispatch(updateCommonState({offline: true}))
    window.addEventListener('online', onlineListener)
    window.addEventListener('offline', offlineListener)
    return () => {
      window.removeEventListener('online', onlineListener)
      window.removeEventListener('offline', offlineListener)
    }
  }, [])
  useEffect(() => {
    dispatch(getUserRoleList())
    async function fetchData() {
      const data = await dispatch(getUserInfo())
      const { href } = window.location
      if (!href.includes('/u/') && data !== 1) {
        message.error('未登录无法查看数据')
      }
    }
    fetchData()
  }, [])
  useEffect(() => {
    const {href} = window.location
    if (href.includes('/u/')) {
      // 登录注册页面已登录直接跳转至首页
      if (loginStatus === 1) {
        window.location.href = '/'
      } else if (loginStatus === -1) {
        message.error('登录状态失效，请重新登录')
        localStorage.set('islogin', false)
      }
    } else if (href.includes('/article/')) {
      // 编辑页未登录无失效跳转至首页，有失效跳转至登录页
      if (loginStatus === 0) {
        window.location.href = '/'
      } else if (loginStatus === -1) {
        window.location.href = '/u/login'
      }
    } else if (loginStatus === -1) {
      // 其他页面未登录不变，失效跳转至登录页
      window.location.href = '/u/login'
    }
  }, [loginStatus])
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/workbench" push />} />
          <Route path="/article/:id" component={Editor} />
          <Route path="/u" component={LoginPage} />
          <Route path="/" component={Management} />
        </Switch>
      </Router>
    </div>
  )
}
export default App
