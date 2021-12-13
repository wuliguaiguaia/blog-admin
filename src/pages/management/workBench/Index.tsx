import React from 'react'
import { Select } from 'antd'
import CalendarGraph from '@/common/components/CalendarGraph/Index'

const { Option } = Select
const workbench = () => {
  const handleChange = () => { }
  return (
    <div>
      创作指数
      <Select defaultValue="2021" style={{ width: 120 }} onChange={handleChange}>
        <Option value="2021">2021</Option>
        <Option value="2022">2022</Option>
      </Select>
      <CalendarGraph />
    </div>
  )
}
export default workbench
