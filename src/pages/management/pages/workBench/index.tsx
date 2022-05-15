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
  const [canDeploy, setCanDeploy] = useState(true)

  const genUseTime = (curTime: number) => {
    let diffTime = (Date.now() - curTime) / 1000
    diffTime = Number(diffTime.toFixed(0))
    console.log('部署时间：', diffTime)
    const seconds = diffTime % 60
    const minutes = diffTime / 60
    return `${minutes.toFixed(0)} 分 ${seconds} 秒`
  }

  const handleDeploy = async () => {
    const curTime = Date.now()
    setCanDeploy(false)
    try {
      message.info('正在启动部署，需要大约3到5分钟，具体还得看当前网络状况')
      await $http.webhook({
        secret: await encodePass(secret),
        name: 'blog',
      }, {
        timeout: 600000,
      })
      const useTime = genUseTime(curTime)
      message.success(`部署成功，用时 ${useTime}`)
      setCanDeploy(true)
    } catch (e) {
      const useTime = genUseTime(curTime)
      message.error(`部署失败， 用时 ${useTime}`)
      console.log('部署失败', e)
      setCanDeploy(true)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div>
        跳转至 1111
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
            前台为服务端渲染，采用SSG静态生成，仅在仓库push时自动化部署，所以当文章等内容修改时并不会及时更新，需要手动触发 rebuild，使修改内容生效。
          </div>
          <Button
            className={cns([styles.cardBtn, styles.deployBtn])}
            type="primary"
            size="small"
            onClick={handleDeploy}
            loading={!canDeploy}
          >
            一键部署
          </Button>
        </div>
      </div>
    </div>
  )
}
export default Workbench
