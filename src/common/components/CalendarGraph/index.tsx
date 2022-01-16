import React, { FunctionComponent, useEffect, useState } from 'react'
import cns from 'classnames'
import { getDateCount } from '@/common/utils/index'
import styles from './index.scss'
import { monthAlias } from '@/common/constants'
import $http from '@/common/api'

interface IProps {
  year: number
}

const CalendarGraph: FunctionComponent<IProps> = ({year = 2021}) => {
  const [datas, setDatas] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const response = await $http.getcommit({year})
      const { data } = response
      setDatas(data.reduce((res: { [x: string]: any }, item: { date: string; count: number }) => {
        const changedDate = new Date(item.date).toLocaleDateString()
        res[changedDate] = item.count
        return res
      }, {}))
    }
    fetchData()
  }, [year])
  const datesMap = []
  const firstWeekday = new Date(year, 0, 1).getDay() // 5
  const tempFullDates: string[] = []
  /* 上一年剩余 */
  const lastYearDay = getDateCount(year - 1, 11)
  Array(firstWeekday).fill(' ').forEach((i) => {
    tempFullDates.push(new Date(year - 1, 11, lastYearDay - firstWeekday - i).toLocaleDateString())
  })
  /* 统计日期 */
  let tempCount = firstWeekday
  for (let i = 0; i < 12; i++) {
    const count = getDateCount(year, i)
    datesMap.push({ count, tempCount, index: 0 })
    tempCount += count
    for (let j = 0; j < count; j++) {
      tempFullDates.push(new Date(year, i, j + 1).toLocaleDateString())
    }
  }
  /* 计算索引 */
  for (let i = 0; i < datesMap.length; i++) {
    const map = datesMap[i]
    const index = Math.floor(map.tempCount / 7)
    datesMap[i].index = index
  }

  /* 转化列 */
  const fullDates: { time: string | undefined }[][] = []
  const colCount = Math.ceil(tempCount / 7)
  for (let i = 0; i < colCount; i++) {
    fullDates[i] = []
    for (let j = 0; j < 7; j++) {
      const item = tempFullDates.shift()
      fullDates[i].push({
        value: (datas[item] >= 5 ? 4 : datas[item]) || 0,
        time: item,
      })
    }
  }

  const indexes = datesMap.map(({ index }) => index)

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
          Array(colCount).fill('').map((_, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index} className={cns([styles.col, 'flex-col'])} title="312">
              <li data-level={0}>
                {
                  // eslint-disable-next-line react/no-array-index-key
                  Array(7).fill('').map((_item, j) => (
                    <i
                      className={styles.square}
                      key={j + colCount}
                      data-level={fullDates[index][j].value}
                      title={fullDates[index][j].time}
                    />
                  ))
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
