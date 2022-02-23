
import React, {
  ChangeEventHandler,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import cns from 'classnames'
import {
  Button,
  Input,
  Menu,
  message,
  Modal,
  Popconfirm,
  Table,
  TableColumnsType,
  Tooltip,
} from 'antd'
import {
  SearchOutlined,
} from '@ant-design/icons'
import styles from './index.scss'
import $http from '@/common/api'
import { getDateDetail } from '@/common/utils'
import { IMessage } from '@/common/interface'


// 后端接口 √
// 前台简单展示：
// - tab 切换：message 和 comment
// - 查询文章id下评论
// 增加后端接口
// 前台操作性
// - 标记已读

interface IProps {
}

const defaultPerpage = 20
const CommentList: FunctionComponent<IProps> = () => {
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [pagesize, setPagesize] = useState(20)
  const [total, setTotal] = useState(0)
  const [isRead, setIsRead] = useState(undefined)
  const [columns, setColumns] = useState<any>([])
  const [sorter, setSorter] = useState({})
  const [searchArticleId, setSearchArticleId] = useState<string>('')
  const handleIdChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value.trim()
    setSearchArticleId(value)
  }

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [activeComment, setActiveComment] = useState<IMessage | null>(null)

  const showModal = (data: IMessage) => {
    setIsModalVisible(true)
    setActiveComment(data)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  // 根据 query 设置当前tab
  const [curTab, setCurTab] = useState('comment')
  const handleClick = (e: { key: React.SetStateAction<string> }) => {
    console.log(e.key)
    setCurTab(e.key)
    setIsRead(undefined)
    setPage(1)
    setPagesize(defaultPerpage)
    setSorter({})
    setSearchArticleId('')
  }
  const fetchData = useCallback(async ({
    page: _page = page,
    prepage = pagesize,
    sorter: _sorter = sorter,
    isRead: _isRead = isRead,
  }: {
    page?: number,
    prepage?: number,
    sorter?: any,
    isRead?: number
  }) => {
    setLoading(true)
    let params: any = {
      page: _page,
      prepage,
      isRead: _isRead,
    }
    if (searchArticleId) {
      params = {...params, articleId: searchArticleId}
    }
    if (_sorter.createTime) {
      params = {...params, sort: _sorter.createTime}
    }
    const api = curTab === 'message' ? 'getmessagelist' : 'getcommentlist'
    const response = await $http[api](params)
    const { data } = response
    const ilist = data.list
    const itotal = data.total

    if (itotal !== 0 && ilist.length === 0) {
      /* 处理删除最后一页数据异常 */
      fetchData({
        page: _page - 1, prepage,
      })
      setPage(_page - 1)
    } else {
      setTotal(itotal)
      setList(ilist)
      setLoading(false)
    }
  }, [curTab, searchArticleId, sorter, isRead])

  const handleInputEnter = () => {
    if (!searchArticleId) return
    if (!/\d+/.test(searchArticleId)) {
      message.error('文章id不合法')
      return
    }
    fetchData({
      page,
      prepage: pagesize,
      sorter,
    })
    setPage(1)
  }

  useEffect(() => {
    const curcolumns: TableColumnsType = [
      {
        title: 'id',
        dataIndex: 'id',
        width: 100,
        className: styles.small,
      },
      {
        title: '用户名',
        dataIndex: 'username',
        width: 90,
        render: (_, record: any) => (
          <Tooltip title={record.username}>
            <span className={styles.oneLine}>
              {record.username}
            </span>
          </Tooltip>
        ),
      },
      {
        title: '用户邮箱',
        dataIndex: 'email',
        width: 90,
        render: (_, record: any) => (
          <Tooltip title={record.email}>
            <span className={styles.oneLine}>
              {record.email}
            </span>
          </Tooltip>
        ),
      },
      {
        title: '用户网站',
        dataIndex: 'website',
        width: 100,
        render: (_, record: any) => {
          const {website} = record
          if (!website) return '-'
          return (
            <Tooltip title={record.website}>
              <span className={styles.oneLine}>
                {record.website}
              </span>
            </Tooltip>
          )
        },
      },
      {
        title: '内容',
        dataIndex: 'content',
        width: 150,
        render: (_, record: any) => {
          const { content } = record
          const showDetail = () => {
            showModal(record)
          }
          return (
            <>
              <span className={styles.oneLine} onClick={showDetail}>{content}</span>
            </>
          )
        },
      },
      {
        title: '是否已读',
        dataIndex: 'isRead',
        width: 100,
        filterMultiple: false,
        filters: [{
          text: '已读',
          value: 1,
        },
        {
          text: '未读',
          value: 0,
        }],
        render: (_, record: any) => {
          const value = record.isRead
          return value === 1 ? '是' : '否'
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        className: styles.small,
        width: 150,
        sorter: (a, b) => a - b,
        render: (createTime: string) => getDateDetail(createTime),
      },
      {
        title: '操作',
        width: 130,
        fixed: 'right',
        render: (_, record: any) => {
          const handleRead = async () => {
            const api = curTab === 'message' ? 'readmessage' : 'readcomment'
            try {
              const data = await $http[api]({ id: record.id })
              if (data.errNo === 0) {
                message.success('已读成功！')
                fetchData({
                  page,
                  prepage: pagesize,
                  sorter,
                })
              } else {
                message.error('已读失败！')
              }
            } catch (e) {
              message.error('已读失败！')
            }
          }
          const handleDelete = async () => {
            const api = curTab === 'message' ? 'deletemessage' : 'deletecomment'
            console.log(curTab)

            try {
              const data = await $http[api]({ id: record.id })
              if (data.errNo === 0) {
                message.success('删除成功！')
                setTimeout(() => {
                  fetchData({
                    page,
                    prepage: pagesize,
                    sorter,
                  })
                }, 1000)
              } else {
                message.error('删除失败！')
              }
            } catch (e) {
              message.error('删除失败！')
            }
          }
          return (
            <div className={styles.operateContent}>
              { !record.isRead ? (
                <Popconfirm
                  title="确认已读？"
                  onConfirm={handleRead}
                  okText="是"
                  cancelText="否"
                >
                  <span className={styles.operate}>标记已读</span>
                </Popconfirm>
              ) : null}
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
    ]
    setColumns(() => {
      console.log(curTab, 'fff')

      if (curTab === 'message') {
        return curcolumns
      }
      curcolumns.splice(1, 0, ...[{
        title: '文章Id',
        dataIndex: 'articleId',
        width: 90,
        className: styles.small,
      },
      {
        title: '回复Id',
        dataIndex: 'replyId',
        width: 80,
        className: styles.small,
        render: (_: any, record: any) => {
          const { replyId } = record
          return replyId === 0 ? '-' : replyId
        },
      },
      {
        title: '多次回复Id',
        dataIndex: 'replyToReplyId',
        width: 90,
        className: styles.small,
        render: (_: any, record: any) => {
          const { replyToReplyId } = record
          return replyToReplyId === 0 ? '-' : replyToReplyId
        },
      }])
      return curcolumns
    })
  }, [fetchData, page, pagesize, sorter, curTab])


  useEffect(() => {
    fetchData({
      page: 1, prepage: defaultPerpage, sorter: {},
    })
  }, [curTab])

  const handleTableChange = (
    pagination: any,
    filters: any,
    {field, order}: {field: string, order: string},
  ) => {
    let convertSorter = {}
    if (field === 'createTime') {
      convertSorter = {createTime: order === 'ascend' ? 1 : 0}
    }
    fetchData({
      page: pagination.current,
      prepage: pagination.pageSize,
      sorter: convertSorter,
      isRead: filters.isRead ? filters.isRead[0] : undefined,
    })
    setIsRead(filters.isRead ? filters.isRead[0] : undefined)
    setPage(pagination.current)
    setPagesize(pagination.pageSize)
    setSorter(convertSorter)
  }

  const handleReset = () => window.location.reload()

  return (
    <>
      <div className={cns([styles.commentlist, 'table-list-page'])}>
        <div className={styles.topheader}>
          <Menu
            onClick={handleClick}
            selectedKeys={[curTab]}
            mode="horizontal"
            className={styles.menu}
          >
            <Menu.Item key="message">留言反馈</Menu.Item>
            <Menu.Item key="comment">文章评论</Menu.Item>
          </Menu>
          {curTab === 'comment' ? (
            <div className={styles.search}>
              <Input
                className={styles.searchInput}
                placeholder="可根据文章ID查询"
                value={searchArticleId}
                onChange={handleIdChange}
                suffix={<SearchOutlined style={{ cursor: 'pointer' }} onClick={handleInputEnter} />}
                onPressEnter={handleInputEnter}
              />
              <Button className={styles.resetBtn} type="primary" onClick={handleReset} size="middle">重置</Button>
            </div>
          ) : null}
        </div>
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
            defaultPageSize: pagesize,
            showTotal: (_total) => `共 ${_total} 条数据`,
          }}
        />
      </div>
      <Modal
        title="评论详情"
        visible={isModalVisible}
        onOk={handleOk}
        footer={null}
        onCancel={handleCancel}
      >
        {activeComment?.content}
      </Modal>
    </>
  )
}

export default CommentList
