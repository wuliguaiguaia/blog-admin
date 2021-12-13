import { getDateCount } from '@/common/utils'
import React from 'react'
import styles from './Index.scss'

const CalandarGraph = () => {
  const year = 2021
  const datesMap = []
  const firstWeekday = new Date(2021, 0, 1).getDay()
  let tempCount = firstWeekday
  for (let i = 0; i < 12; i++){
    const count = getDateCount(year, i + 1)
    datesMap.push({ count, tempCount, index: 0 })
    tempCount += count
  }
  for (let i = 0; i < datesMap.length; i++){
    const map = datesMap[i]
    const index = Math.floor(map.tempCount / 7)
    datesMap[i].index = index
  }
  const colCount = Math.ceil(tempCount / 7)

  return (
    <div classNames={styles.graphOverview}>
      <ul>
        {
          Array(colCount).map(item => {
            return <li className={styles.col}>
              {
                Array(7).map(_item => {
                  return <i className={styles.ic}></i>
                })
              }
            </li>
          })
        }
      </ul>
    </div>
  )
}

export default CalandarGraph
