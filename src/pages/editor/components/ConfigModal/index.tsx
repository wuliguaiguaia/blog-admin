import cns from 'classnames'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Select, Modal, message, Input,
} from 'antd'
import styles from './index.scss'
import { ICategory } from '@/common/interface'
import {
  getCategoryList, saveDocData, updateDocData, updateEditingStatus,
} from '@/store/reducers/editor'
import { RootState } from '@/store/reducers/interface'

const { Option } = Select
const { TextArea } = Input

interface IProps {}

const ConfigModal: FunctionComponent<IProps> = () => {
  const {
    docData,
    editStatus: { configModalVisible },
  } = useSelector((state: RootState) => state.editor)
  const dispatch = useDispatch()
  const { categories, desc } = docData
  const [loading, setLoading] = useState(false)
  const { categoryList } = useSelector((state: any) => state.editor)
  const [data, setData] = useState({
    categories,
    desc,
  })

  const checkForm = () => {
    /* 1 检查是否有变化 */
    if (JSON.stringify(data.categories) === JSON.stringify(categories)
      && data.desc === desc) {
      message.info('无内容变化')
      return false
    }
    /* 2 是否符合条件 */
    if (data.categories.length === 0) {
      message.error('分类必选')
      return false
    }
    if (data.desc === '') {
      message.error('简介必填')
      return false
    }
    return true
  }

  const handleConfigCancel = () => dispatch(updateEditingStatus({ configModalVisible: false }))

  const handleConfigSubmit = () => {
    if (!checkForm()) {
      return
    }
    setLoading(true)
    setTimeout(() => {
      function cb() {
        setLoading(false)
        dispatch(updateDocData(data))
        handleConfigCancel()
      }
      dispatch(saveDocData(data, cb))
    }, 200)
  }


  const handleSelectedCatesChange = (value: number[]) => {
    setData({ ...data, categories: value })
  }

  const handleDescChange = (e: { target: { value: string } }) => {
    setData({ ...data, desc: e.target.value.trim() })
  }
  useEffect(() => {
    dispatch(getCategoryList())
  }, [])

  return (
    <Modal
      title="文档配置项"
      okText="确定"
      cancelText="取消"
      confirmLoading={loading}
      visible={configModalVisible}
      onOk={handleConfigSubmit}
      onCancel={handleConfigCancel}
    >
      <div className={styles.row}>
        <span className={styles.label}>
          <span className={styles.must}>*</span>
          分类:
        </span>
        <Select
          className={styles.formItem}
          mode="multiple"
          allowClear
          placeholder="Please select"
          value={data.categories}
          onChange={handleSelectedCatesChange}
        >
          {
            categoryList.map((item: ICategory) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))
          }
        </Select>
      </div>
      <div className={cns([styles.row, styles.descRow])}>
        <span className={styles.label}>
          <span className={styles.must}>*</span>
          简介:
        </span>
        <TextArea
          className={styles.formItem}
          rows={2}
          placeholder="请输入"
          value={data.desc}
          onChange={handleDescChange}
        />
      </div>
    </Modal>
  )
}
export default ConfigModal
