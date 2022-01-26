import { Select } from 'antd'
import React, { FunctionComponent, useState } from 'react'
import styles from './index.scss'
import CalendarGraph from '@/common/components/CalendarGraph'

const { Option } = Select
const defaultYear = new Date().getFullYear()
const Workbench: FunctionComponent = () => {
  const [year, setYear] = useState(defaultYear)
  const handleChange = (y:number) => setYear(y)
  return (
    <div className="workbench-wrapper">
      <div className={styles.title}>
        <h1>创作指数</h1>
      </div>
      <Select
        className="select-year"
        defaultValue={defaultYear}
        style={{ width: 120 }}
        onChange={handleChange}
      >
        <Option value="2021">2021</Option>
        <Option value="2022">2022</Option>
      </Select>
      <CalendarGraph year={year} />
    </div>
  )
}
export default Workbench
