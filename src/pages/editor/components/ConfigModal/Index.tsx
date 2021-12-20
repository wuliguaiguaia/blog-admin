import React, { FunctionComponent, useEffect, useState } from 'react'
import { Select, Modal } from 'antd'
import cns from 'classnames'
import { IArticle, ICategory } from '@/common/interface'
import styles from './Index.scss'
import $http from '@/common/api'

const { Option } = Select

interface IProps {
  data: IArticle,
  isConfigVisibile: boolean,
  setConfigVisibile: (v: boolean) => void
}

const ConfigModal: FunctionComponent<IProps> = ({ data, isConfigVisibile, setConfigVisibile }) => {
  const [cates, setCates] = useState([])
  const handleConfigSubmit = () => setConfigVisibile(false)
  const handleConfigCancel = () => setConfigVisibile(false)

  useEffect(() => {
    const fetch = async () => {
      const response:any = await $http.getcategorylist()
      const idata = response.data.list.map(({ id: iid, name }: ICategory) => ({id: iid, name }))
      setCates(idata)
    }
    fetch()
  }, [])

  return (
    <Modal
      title="文档配置项"
      visible={isConfigVisibile}
      onOk={handleConfigSubmit}
      okText="确定"
      cancelText="取消"
      onCancel={handleConfigCancel}
    >
      <div className={cns(['align-center', styles.catesWrapper])}>
        <span className={styles.catesLabel}>分类:</span>
        <Select
          className={styles.catesSelect}
          mode="multiple"
          allowClear
          style={{ width: '70%' }}
          placeholder="Please select"
          // value={selectedCates}
          defaultValue={data.categories.map((item) => item.id)}
        >
          {
            cates.map((item: ICategory) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))
          }
        </Select>
      </div>
    </Modal>
  )
}
export default ConfigModal
