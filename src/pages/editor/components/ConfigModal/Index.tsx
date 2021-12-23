import cns from 'classnames'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Select, Modal, message } from 'antd'
import styles from './Index.scss'
import { ICategory } from '@/common/interface'
import {
  getCategoryList, saveDocData, updateDocData, updateEditingStatus,
} from '@/store/reducers/editor'
import { RootState } from '@/store/reducers/interface'

const { Option } = Select

interface IProps {}

const ConfigModal: FunctionComponent<IProps> = () => {
  const {
    docData,
    editStatus: { configModalVisible },
  } = useSelector((state: RootState) => state.editor)
  const dispatch = useDispatch()
  const { categories } = docData
  const [loading, setLoading] = useState(false)
  const { categoryList } = useSelector((state: any) => state.editor)
  const [selectedCates, setSelectedCates] = useState<number[]>(categories)

  const handleConfigSubmit = () => {
    setLoading(true)
    setTimeout(() => {
      function cb() {
        setLoading(false)
        dispatch(updateDocData({ categories: selectedCates }))
        dispatch(updateEditingStatus({ configModalVisible: false }))
        message.success('修改成功')
      }
      dispatch(saveDocData({
        categories: selectedCates,
      }, cb))
    }, 200)
  }

  const handleConfigCancel = () => dispatch(updateEditingStatus({ configModalVisible: false }))
  const handleSelectedCatesChange = (value: number[]) => {
    setSelectedCates(value)
  }

  useEffect(() => {
    dispatch(getCategoryList())
  }, [dispatch])

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
      <div className={cns(['align-center', styles.catesWrapper])}>
        <span className={styles.catesLabel}>分类:</span>
        <Select
          className={styles.catesSelect}
          mode="multiple"
          allowClear
          style={{ width: '70%' }}
          placeholder="Please select"
          value={selectedCates}
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
export default ConfigModal
