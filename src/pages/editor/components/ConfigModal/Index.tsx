import React, { FunctionComponent, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Select, Modal } from 'antd'
import cns from 'classnames'
import { ICategory } from '@/common/interface'
import styles from './Index.scss'
import { getCategoryList, updateEditingStatus } from '@/store/reducers/editor'
import { RootState } from '@/store/reducers/interface'

const { Option } = Select

interface IProps {}

const ConfigModal: FunctionComponent<IProps> = () => {
  const {
    docData, editStatus:
    { configModalVisible },
  } = useSelector((state: RootState) => state.editor)
  const dispatch = useDispatch()

  const handleConfigSubmit = () => dispatch(updateEditingStatus({ configModalVisible: false }))

  const handleConfigCancel = () => dispatch(updateEditingStatus({ configModalVisible: false }))

  const { categoryList } = useSelector((state: any) => state.editor)

  useEffect(() => {
    dispatch(getCategoryList())
  }, [dispatch])

  return (
    <Modal
      title="文档配置项"
      visible={configModalVisible}
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
          defaultValue={docData.categories.map((item: ICategory) => item.id)}
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
