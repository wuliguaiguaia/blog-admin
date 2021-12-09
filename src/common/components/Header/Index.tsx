import React from 'react'
import cns from 'classnames'
import logo from '../../../assets/imgs/favicon.svg'
import styles from './Index.scss'

import big from '../../../assets/imgs/big.jpg'

const Header = () => {
  const s = ''
  return (
    <div className={cns([styles.header, 'jus-between'])}>
      <div className="left">
        <div className="logo">
          <img src={logo} alt="" />
        </div>
        {s}
        <img src={big} alt="" />
      </div>
      <div className="right">
        <div>登录</div>
      </div>
    </div>
  )
}

export default Header
