import React from 'react'
import styles from './index.scss'

const NoAuth = () => {
  const darta = '暂无权限'
  return <div className={styles.wrapper}>{darta}</div>
}

export default NoAuth
