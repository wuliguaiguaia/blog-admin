import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react'

import cns from 'classnames'
import {
  message,
  Popconfirm,
  Table, Tooltip,
} from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import styles from './index.scss'
import $http from '@/common/api'
import { getDateDetail } from '@/common/utils'
import EditUserModal from '../../components/EditUserModal'
import { updateEditorState } from '@/store/reducers/editor'
import { RootState } from '@/store/reducers/interface'
import { IRegisterUser } from '@/common/interface'

const defaultPerpage = 20

interface IProps {
  history: any
}

const UserList: FunctionComponent<IProps> = ({ history }) => {
  const { userRole, authConfig } = useSelector((state: RootState) => state.common)
  if (!authConfig.user?.includes(userRole)) {
    history.replace('/')
    return <></>
  }

  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [columns, setColumns] = useState<any>([])
  const [editUserModalVisible, setEditUserModalVisible] = useState(false)
  const [editUser, setEditUser] = useState<IRegisterUser>({
    id: 0,
    username: '',
    role: 0,
  })

  const {userRoleList} = useSelector((state: RootState) => state.common)
  const dispatch = useDispatch()
  const [curPage, setCurPage] = useState<number>(1)
  const [curPageSize, setCurPageSize] = useState<number>(defaultPerpage)
  const [curRole, setCurRole] = useState([])
  /*
    Maximum update depth exceeded.
    This can happen when a component calls setState inside useEffect,
    but useEffect either doesn't have a dependency array,
    or one of the dependencies changes on every render.
   */

  const fetchData = useCallback(async ({
    page = curPage,
    prepage = curPageSize,
    role = [],
  }) => {
    setLoading(true)
    const params = {
      page,
      prepage,
      role,
    }
    const response: any = await $http.getuserlist(params)
    const { errNo, data, errStr } = response
    if (errNo !== 0) {
      message.error(errStr)
      setList([])
      setTotal(0)
      dispatch(updateEditorState({ userList: [] }))
    } else {
      setList(data.list)
      setTotal(data.total)
      dispatch(updateEditorState({ userList: data.list }))
    }
    setLoading(false)
  }, [])

  const handleTableChange = (pagination: any,
    filters: any) => {
    fetchData({
      page: pagination.current,
      prepage: pagination.pageSize,
      role: filters.role,
    })
    setCurRole(filters.role)
    setCurPage(pagination.current)
    setCurPageSize(pagination.pageSize)
  }
  useEffect(() => {
    fetchData({ page: 1, prepage: defaultPerpage })
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
        title: '用户名',
        dataIndex: 'username',
        className: styles.title,
        width: 180,
        onCell: (record: any) => ({
          className: `cell-${record.id}`,
        }),
        render: (title: string) => (
          <Tooltip title={title}>
            <div className={cns([styles.title, 'text-ellipsis'])}>
              {title}
            </div>
          </Tooltip>
        ),
      },
      {
        title: '角色',
        dataIndex: 'role',
        className: styles.small,
        width: 150,
        filters: userRoleList,
        render(role:number) {
          return userRoleList.find((item) => item.value === role)?.text
        },
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
              const data = await $http.deleteuser({}, { data: { id: record.id } })
              if (data.errNo === 0) {
                message.success('删除成功！')
                fetchData({ page: curPage, prepage: curPageSize, role: curRole })
              } else {
                message.error('删除失败！')
              }
            } catch (e) {
              message.error('删除失败！')
            }
          }
          const handleEdit = async () => {
            const { username, id, role} = record
            setEditUser({ username, id, role })
            setEditUserModalVisible(true)
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
  }, [fetchData, userRoleList, curPage, curPageSize, curRole])

  return (
    <>
      <div className={cns([styles.userlist, 'user-list-page '])}>
        <Table
          className={styles.table}
          dataSource={list}
          loading={loading}
          size="small"
          columns={columns}
          scroll={{ y: '70vh' }}
          rowKey="id"
          onChange={handleTableChange}
          pagination={{
            position: ['bottomRight'],
            total,
            showSizeChanger: true,
            defaultPageSize: defaultPerpage,
            showTotal: (_total) => `共 ${_total} 条数据`,
          }}
        />
      </div>
      <EditUserModal
        modalVisible={editUserModalVisible}
        setModalVisible={setEditUserModalVisible}
        refresh={fetchData}
        userRoleList={userRoleList}
        initialData={editUser}
      />
    </>
  )
}

export default withRouter(UserList)

