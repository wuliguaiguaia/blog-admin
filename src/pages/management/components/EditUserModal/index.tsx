import cns from 'classnames'
import React, { FunctionComponent, useEffect, useState } from 'react'
import {
  Select, Modal, Input, message,
} from 'antd'
import { IRegisterUser, IRole } from '@/common/interface'
import styles from './index.scss'
import $http from '@/common/api'

const { Option } = Select

interface IProps {
  modalVisible: boolean,
  setModalVisible: (visible: boolean) => void
  userRoleList: IRole[],
  initialData: IRegisterUser
  refresh: ({
    page, prepage, categories, sorter, published,
  }: {
    page?: number;
    prepage?: number
    categories?: number[]; sorter?: any; published?: number | null;
  }) => Promise<void>,
}

const EditUserModal: FunctionComponent<IProps> = ({
  modalVisible,
  setModalVisible,
  userRoleList,
  initialData,
  refresh,
}) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<IRegisterUser>(initialData)

  useEffect(() => {
    setData(initialData)
  }, [initialData])

  const checkForm = () => {
    if (data.username.trim() === '') {
      message.error('用户名必填')
      return false
    }
    return true
  }

  const handleConfigSubmit = async () => {
    const cansubmit = checkForm()
    if (!cansubmit) return
    setLoading(true)
    const api = 'updateuser'
    const res = await $http[api]({...data})
    setTimeout(() => {
      setLoading(false)
      if (res.errNo !== 0) {
        message.error(res.errStr)
      } else {
        setModalVisible(false)
        refresh({})
      }
    }, 200)
  }


  const handleConfigCancel = () => {
    setModalVisible(false)
    setLoading(false)
  }
  const handleSelectedRoleChange = (value: number) => {
    setData({...data, role: value})
  }

  const handleNameChange = (e: { target: { value: any } }) => {
    setData({ ...data, username: e.target.value })
  }
  return (
    <Modal
      title="修改用户"
      okText="确定"
      cancelText="取消"
      confirmLoading={loading}
      visible={modalVisible}
      onOk={handleConfigSubmit}
      onCancel={handleConfigCancel}
      className="edit-user-modal"
    >
      <div className={cns([styles.row])}>
        <span className={styles.label}>
          <span className={styles.must}>*</span>
          用户名:
        </span>
        <Input
          className={styles.formItem}
          placeholder="请输入"
          value={data.username}
          maxLength={100}
          onChange={handleNameChange}
        />
      </div>
      <div className={cns([styles.row])}>
        <span className={styles.label}>
          <span className={styles.must}>*</span>
          角色:
        </span>
        <Select
          className={styles.formItem}
          placeholder="请选择"
          value={data.role}
          onChange={handleSelectedRoleChange}
        >
          {
            userRoleList.map((item: IRole) => (
              <Option key={item.value} value={item.value}>
                {item.text}
              </Option>
            ))
          }
        </Select>
      </div>
    </Modal>
  )
}

export default EditUserModal
