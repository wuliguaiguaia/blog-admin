import cns from 'classnames'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Select, Modal, Input, message,
} from 'antd'
import { EditType, ICategory } from '@/common/interface'
import {
  getCategoryList,
} from '@/store/reducers/editor'
import styles from './index.scss'
import $http from '@/common/api'

const {TextArea} = Input
const { Option } = Select
interface IAddArticle {
  title: string,
  categories: number[],
  id?: 0,
  content?: string
  desc: string
}
interface IProps {
  modalVisible: boolean,
  setModalVisible: (visible: boolean) => void
  type: EditType
  initialData: IAddArticle
  refresh: ({
    page, prepage, categories, sorter, published,
  }: {
    page?: number;
    prepage?: number
    categories?: number[]; sorter?: any; published?: number | null;
  }) => Promise<void>,
}


const EditArticleModal: FunctionComponent<IProps> = ({
  modalVisible,
  setModalVisible,
  type,
  initialData,
  refresh,
}) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { categoryList } = useSelector((state: any) => state.editor)

  const defaultData = {
    title: '',
    categories: [],
    content: '',
    desc: '',
  }
  const [data, setData] = useState<IAddArticle>(defaultData)

  useEffect(() => {
    setData(type === 0 ? defaultData : initialData)
  }, [type, initialData])

  const checkForm = () => {
    if (!data.title) {
      message.error('文档名必填')
      return false
    }
    if (data.categories.length === 0) {
      message.error('分类必选')
      return false
    }
    if (!data.desc) {
      message.error('简介必填')
      return false
    }
    return true
  }

  const handleConfigSubmit = async () => {
    const cansubmit = checkForm()
    if (!cansubmit) return
    setLoading(true)
    const api = type === 0 ? 'addarticle' : 'updatearticle'
    const res = await $http[api]({...data})
    setTimeout(() => {
      setLoading(false)
      if (res.errNo !== 0) {
        message.error(res.errStr)
      } else {
        setModalVisible(false)
        refresh({})
        if (type === 0) {
          const {origin} = window.location
          window.open(`${origin}/article/${res.data.id}`)
        }
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
  const handleTitleChange = (e: { target: { value: string } }) => {
    setData({ ...data, title: e.target.value.trim() })
  }
  const handleDescChange = (e: { target: { value: string } }) => {
    setData({ ...data, desc: e.target.value.trim() })
  }
  useEffect(() => {
    dispatch(getCategoryList())
  }, [])

  return (
    <Modal
      title={type === 0 ? '添加文章' : '修改文章'}
      okText="确定"
      cancelText="取消"
      confirmLoading={loading}
      visible={modalVisible}
      onOk={handleConfigSubmit}
      onCancel={handleConfigCancel}
      className="edit-article-modal"
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
export default EditArticleModal
