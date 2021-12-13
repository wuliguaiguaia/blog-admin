import React from 'react'
import cns from 'classnames'
import { getDateCount } from '@/common/utils/index'
import styles from './Index.scss'
import { monthAlias } from '@/common/constants'

const CalendarGraph = () => {
  const year = 2021
  const datesMap = []
  const firstWeekday = new Date(2021, 0, 1).getDay()
  let tempCount = firstWeekday
  for (let i = 0; i < 12; i++) {
    const count = getDateCount(year, i + 1)
    datesMap.push({ count, tempCount, index: 0 })
    tempCount += count
  }
  for (let i = 0; i < datesMap.length; i++) {
    const map = datesMap[i]
    const index = Math.floor(map.tempCount / 7)
    datesMap[i].index = index
  }

  const colCount = Math.ceil(tempCount / 7)
  // const fullCount = colCount * 7

  const indexes = datesMap.map(({ index }) => index)
  // 数据 [{date: 2010.10.19, level: 5}]
  // 转化结果 colCount.forEach()

  return (
    <div className={cns([styles.graphOverview, 'flex'])}>
      <div className={cns([styles.week, 'flex-col', 'jus-around'])}>
        <i />
        <i>一</i>
        <i />
        <i>三</i>
        <i />
        <i>五</i>
        <i />
      </div>
      <ul className="flex">
        {
          Array(colCount).fill(' ').map((_, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index} className={cns([styles.col, 'flex-col'])} title="312">
              <li data-level={0}>
                {
                  // eslint-disable-next-line react/no-array-index-key
                  Array(7).fill(' ').map((_item, _index) => <i className={styles.square} key={_index + colCount} />)
                }
              </li>
              {indexes.includes(index)
                && (
                  <i
                    className={styles.monthAlias}
                    key={monthAlias[indexes.findIndex((i) => i === index)]}
                  >
                    {monthAlias[indexes.findIndex((i) => i === index)]}
                  </i>
                )}
            </div>
          ))
        }
      </ul>
    </div>
  )
}

export default CalendarGraph
