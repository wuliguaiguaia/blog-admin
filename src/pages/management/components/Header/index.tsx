import React from 'react'
import cns from 'classnames'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import styles from './index.scss'

const Header = () => (
  <div className={cns([styles.header, 'jus-between'])}>
    <div />
    <div>
      <Button className={styles.btn}><Link to="/u/login">登录</Link></Button>
      <Button className={styles.btn} type="primary"><Link to="/u/register">快速注册</Link></Button>
    </div>
  </div>
)

export default Header
