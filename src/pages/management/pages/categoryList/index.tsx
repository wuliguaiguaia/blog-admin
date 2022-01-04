import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react'

import cns from 'classnames'
import {
  Button,
  message,
  Popconfirm,
  Table, Tooltip,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import styles from './index.scss'
import $http from '@/common/api'
import { getDateDetail } from '@/common/utils'
import EditCategoryModal from '../../components/EditCategoryModal'

interface IProps {
}

const CategoryList: FunctionComponent<IProps> = () => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [columns, setColumns] = useState<any>([])
  const [addCategoryModalVisible, setAddCategoryModalVisible] = useState(false)


  /*
    Maximum update depth exceeded.
    This can happen when a component calls setState inside useEffect,
    but useEffect either doesn't have a dependency array,
    or one of the dependencies changes on every render.
   */

  const fetchData = useCallback(async () => {
    setLoading(true)
    const response:any = await $http.getcategorylist()
    setList(response.data.list)
    setTotal(response.data.total)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    setColumns([
      {
        title: 'id',
        dataIndex: 'id',
        width: 100,
        className: styles.small,
      },
      {
        title: '名称',
        dataIndex: 'name',
        className: styles.title,
        width: 180,
        onCell: (record: any) => ({
          className: `cell-${record.id}`,
        }),
        render: (title: string) => (
          <Tooltip title={title}>
            <div className={cns([styles.title, 'text-ellipsis'])} style={{ width: 200 }}>
              {title}
            </div>
          </Tooltip>
        ),
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        className: styles.small,
        width: 150,
        sorter: (a: any, b: any) => new Date(a.updateTime).getTime()
          - new Date(b.updateTime).getTime(),
        defaultSortOrder: 'descend',
        render: (updateTime: string) => getDateDetail(updateTime),
      },
      {
        title: '操作',
        width: 160,
        fixed: 'right',
        render: (_, record: any) => {
          const handleDelete = async () => {
            try {
              const data = await $http.deletecategory({ id: record.id })
              if (data.errNo === 0) {
                message.success('删除成功！')
                fetchData()
              } else {
                message.error('删除失败！')
              }
            } catch (e) {
              message.error('删除失败！')
            }
          }
          const handleEdit = async () => {

          }
          return (
            <div className={styles.operateContent}>
              <span className={styles.operate} onClick={handleEdit}>修改</span>
              <Popconfirm
                title="请再次确认是否删除？"
                onConfirm={handleDelete}
                okText="是"
                cancelText="否"
              >
                <span className={styles.operate}>删除</span>
              </Popconfirm>
            </div>
          )
        },
      },
    ])
  }, [fetchData])


  const handleAddCategory = () => setAddCategoryModalVisible(true)

  return (
    <>
      <div className={cns([styles.articlelist])}>
        <div className={styles.header}>
          <div>
            <Button type="primary" onClick={handleAddCategory}>
              <PlusOutlined />
              <span className={styles.addBtn}>添加分类</span>
            </Button>
          </div>
        </div>
        <Table
          className={styles.table}
          dataSource={list}
          loading={loading}
          size="small"
          columns={columns}
          scroll={{ y: '70vh' }}
          rowKey="id"
          pagination={{
            position: ['bottomRight'],
            total,
            showTotal: (_total) => `共 ${_total} 条数据`,
          }}
        />
      </div>
      <EditCategoryModal
        modalVisible={addCategoryModalVisible}
        setModalVisible={setAddCategoryModalVisible}
      />
    </>
  )
}

export default CategoryList

