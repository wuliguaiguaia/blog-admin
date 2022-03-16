import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/reducers/interface'
import styles from './index.scss'
import NoAuth from '../../components/NoAuth'

const Analysis = () => {
  const { userRole, authConfig } = useSelector((state: RootState) => state.common)
  if (!authConfig.analysis?.includes(userRole)) {
    return <NoAuth />
  }
  const s = ''
  return (
    <div className={styles.analysis}>
      {s}
      {' '}
      analysis
    </div>
  )
}
export default Analysis
