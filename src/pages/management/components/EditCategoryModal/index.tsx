import cns from 'classnames'
import React, { FunctionComponent, useEffect, useState } from 'react'
import {
  Modal, Input, message,
} from 'antd'
import styles from './index.scss'
import $http from '@/common/api'
import { EditType, ICategory } from '@/common/interface'

interface IProps {
  modalVisible: boolean,
  setModalVisible: (visible: boolean) => void
  refresh: () => void,
  initialData: ICategory,
  type: EditType
}

interface IAddCategory {
  name: string,
}
const EditCategoryModal: FunctionComponent<IProps> = ({
  modalVisible,
  setModalVisible,
  refresh,
  initialData,
  type,
}) => {
  const [loading, setLoading] = useState(false)
  const defaultData = { name: '' }
  const [data, setData] = useState<IAddCategory>(defaultData)

  useEffect(() => {
    setData(type === 0 ? defaultData : initialData)
  }, [initialData, type])

  const checkForm = () => {
    if (!data.name) {
      message.error('名称必填')
      return false
    }
    return true
  }

  const handleConfigSubmit = async () => {
    const cansubmit = checkForm()
    if (!cansubmit) return
    setLoading(true)
    const api = type === 0 ? 'addcategory' : 'updatecategory'
    const res = await $http[api]({...data})
    setTimeout(() => {
      setLoading(false)
      if (res.errNo !== 0) {
        message.error(res.errStr)
      } else {
        setData(defaultData)
        setModalVisible(false)
        refresh()
      }
    }, 200)
  }

  const handleConfigCancel = () => {
    setData(defaultData)
    setModalVisible(false)
    setLoading(false)
  }

  const handleTitleChange = (e: { target: { value: any } }) => {
    setData({ ...data, name: e.target.value.trim() })
  }

  return (
    <Modal
      title={type === 0 ? '添加分类' : '修改分类'}
      okText="确定"
      cancelText="取消"
      confirmLoading={loading}
      visible={modalVisible}
      onOk={handleConfigSubmit}
      onCancel={handleConfigCancel}
      className="edit-category-modal"
    >
      <div className={cns([styles.row])}>
        <span className={styles.label}>
          <span className={styles.must}>*</span>
          名称:
        </span>
        <Input
          className={styles.formItem}
          placeholder="请输入"
          value={data.name}
          maxLength={100}
          onChange={handleTitleChange}
        />
      </div>
    </Modal>
  )
}

export default EditCategoryModal
