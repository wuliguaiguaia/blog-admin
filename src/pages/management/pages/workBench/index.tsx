import { Select } from 'antd'
import React, { FunctionComponent, useState } from 'react'
import styles from './index.scss'
import CalendarGraph from '@/common/components/CalendarGraph'

const { Option } = Select

const Workbench: FunctionComponent = () => {
  const [year, setYear] = useState(2021)
  const handleChange = (y:number) => setYear(y)
  return (
    <div>
      <div className={styles.title}>
        <h1>创作指数</h1>
      </div>
      <Select
        className={styles.select}
        defaultValue={2021}
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
