import cns from 'classnames'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Select, Modal, Input, message,
} from 'antd'
import { ICategory } from '@/common/interface'
import {
  getCategoryList,
} from '@/store/reducers/editor'
import styles from './index.scss'
import $http from '@/common/api'

const { Option } = Select

interface IProps {
  modalVisible: boolean,
  setModalVisible: (visible: boolean) => void
}

interface IAddArticle {
  title: string,
  categories: number[]
}
const EditArticleModal: FunctionComponent<IProps> = ({
  modalVisible,
  setModalVisible,
}) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { categoryList } = useSelector((state: any) => state.editor)
  const defaultData = {
    title: '',
    categories: [],
    content: '',
  }
  const [data, setData] = useState<IAddArticle>(defaultData)

  const checkForm = () => {
    if (data.title.trim() === '') {
      message.error('文档名必填')
      return false
    }
    if (data.categories.length === 0) {
      message.error('分类必选')
      return false
    }
    return true
  }

  const handleConfigSubmit = async () => {
    const cansubmit = checkForm()
    if (!cansubmit) return
    setLoading(true)
    const res = await $http.addarticle({...data})
    setTimeout(() => {
      setLoading(false)
      if (res.errNo !== 0) {
        message.error(res.errStr)
      } else {
        setModalVisible(false)
        const {origin} = window.location
        window.open(`${origin}/editor/${res.data.id}`)
      }
    }, 200)
  }


  const handleConfigCancel = () => {
    setData(defaultData)
    setModalVisible(false)
    setLoading(false)
  }
  const handleSelectedCatesChange = (value: number[]) => {
    setData({...data, categories: value})
  }

  const handleTitleChange = (e) => {
    setData({ ...data, title: e.target.value })
  }
  useEffect(() => {
    dispatch(getCategoryList())
  }, [])

  return (
    <Modal
      title="添加文章"
      okText="确定"
      cancelText="取消"
      confirmLoading={loading}
      visible={modalVisible}
      onOk={handleConfigSubmit}
      onCancel={handleConfigCancel}
    >
      <div className={cns([styles.row])}>
        <span className={styles.label}>
          <span className={styles.must}>*</span>
          文档名:
        </span>
        <Input
          className={styles.formItem}
          placeholder="请输入"
          value={data.title}
          maxLength={100}
          onChange={handleTitleChange}
        />
      </div>
      <div className={cns([styles.row])}>
        <span className={styles.label}>
          <span className={styles.must}>*</span>
          分类:
        </span>
        <Select
          className={styles.formItem}
          mode="multiple"
          allowClear
          placeholder="请选择"
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
    </Modal>
  )
}
export default EditArticleModal