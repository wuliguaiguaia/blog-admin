import {Button, message } from 'antd'
import React, { FunctionComponent, useState } from 'react'
import cns from 'classnames'
import styles from './index.scss'
import CalendarGraph from '@/common/components/CalendarGraph'
import $http from '@/common/api'
import { encodePass } from '@/common/utils/decode'


// const { Option } = Select
const secret = process.env.WEBHOOK_SECRET
const defaultYear = new Date().getFullYear()
const Workbench: FunctionComponent = () => {
  const [year] = useState(defaultYear)
  // const handleChange = (y: number) => setYear(y)
  const handleDeploy = async () => {
    try {
      await $http.webhook({
        secret: await encodePass(secret),
        name: 'blog',
      })
    } catch (e) {
      message.error('部署失败')
      console.log('部署失败', e)
    }
  }
  return (
    <div className={styles.wrapper}>
      <div>
        跳转至
        <a href="https://orangesolo.cn" target="_blank" rel="noreferrer">前台</a>
      </div>
      <div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>创作指数</h3>
          {/*  <Select
            className="select-year"
            defaultValue={defaultYear}
            style={{ width: 120 }}
            onChange={handleChange}
          >
            <Option value="2021">2021</Option>
            <Option value="2022">2022</Option>
          </Select> */}
          <div className={styles.calendar}><CalendarGraph year={year} /></div>
        </div>
      </div>
      <div>
        <div className={cns([styles.card, styles.operate])}>
          <h3 className={styles.cardTitle}>前台部署</h3>
          <div className={styles.cardDesc}>
            前台为服务端渲染，采用SSG静态生成，仅在仓库push时自动化部署。所以当内容修改时，需要手动触发 rebuild，使修改内容生效。
          </div>
          <Button className={styles.cardBtn} type="primary" size="small" onClick={handleDeploy}>一键部署</Button>
        </div>
      </div>
    </div>
  )
}
export default Workbench
