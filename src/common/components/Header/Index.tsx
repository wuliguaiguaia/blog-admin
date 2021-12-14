import React from 'react'
import cns from 'classnames'
import styles from './Index.scss'

const Header = () => {
  const a = ''
  return (
    <div className={cns([styles.header, 'jus-between'])}>
      <div className={styles.txt}>
        登录
        { a}
      </div>
    </div>
  )
}

export default Header
