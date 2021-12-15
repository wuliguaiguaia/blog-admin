
import React, {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react'
import cns from 'classnames'
import {
  Button,
  Input,
  message,
  Popconfirm,
  Table, Tag, Tooltip,
} from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import styles from './Index.scss'
import $http from '@/common/api'

const defaultPerpage = 20
const ArticleList = () => {
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [pagesize, setPagesize] = useState(20)
  const [total, setTotal] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [cates, setCates] = useState<any>([])
  const [columns, setColumns] = useState<any>([])
  const [curCates, setCurCates] = useState([])
  const [sorter, setSorter] = useState({})
  const [published, setPublished] = useState<null | number>(null)

  const fetchData = useCallback(async ({
    page: _page, prepage, categories, sorter: _sorter, type: _type, published: _published,
  }) => {
    setLoading(true)
    const params = {
      page: _page,
      prepage,
      categories,
      published: _published,
      sorter: _sorter,
    }

    let ilist
    let itotal
    let data
    let response

    if (_type === 0 || !searchValue) {
      response = await $http.getarticlelist(params)
      data = response.data
      ilist = data.list
      itotal = data.total
    } else {
      response = await $http.search({...params, words: searchValue, columns: ['title']})
      data = response.data
      // eslint-disable-next-line no-underscore-dangle
      ilist = data.list.map((item: any) => item._source)
      itotal = data.total
    }
    if (itotal !== 0 && ilist.length === 0) {
      /* 处理删除最后一页数据异常 */
      fetchData({
        page: _page - 1, prepage, categories, sorter: _sorter, type: _type, published: _published,
      })
      setPage(_page - 1)
    } else {
      setTotal(itotal)
      setList(ilist)
      setLoading(false)
    }
  }, [searchValue])

  useEffect(() => {
    const fetch = async () => {
      const response:any = await $http.getcategorylist()
      const data = response.data.list.map(({ id, name }) => ({ text: name, value: id }))
      setCates(data)
    }
    fetch()
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
        dataIndex: 'title',
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
        title: '所属分类',
        dataIndex: 'categories',
        width: 140,
        filters: cates,
        render: (categories: any[]) => (
          <span>
            {categories.map((item, index) => {
              const color = 'green'
              return (
                <Tag color={color} key={index} className={styles.categories}>
                  {item.name.toUpperCase()}
                </Tag>
              )
            })}
          </span>
        ),
      },
      {
        title: '发布',
        dataIndex: 'published',
        className: styles.small,
        width: 80,
        filterMultiple: false,
        filters: [
          {
            text: '是',
            value: 1,
          },
          {
            text: '否',
            value: 0,
          },
        ],
        render: (_published: number | undefined) => (_published ? '是' : '否'),
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        className: styles.small,
        width: 150,
        sorter: (a, b) => a - b,
        render: (updateTime: string) => updateTime.replace(/-/g, '/').replace('T', ' ').replace(/Z|T/, '').slice(0, -4),
      },
      {
        title: '操作',
        width: 160,
        render: (_, record: any) => {
          const handlePublish = async () => {
            try {
              const data = await $http.publish({ id: record.id })
              console.log(data, '')

              if (data.errNo === 0) {
                message.success('发布成功！')
              } else {
                message.error('发布失败！')
              }
            } catch (e) {
              message.error('发布失败！')
              fetchData({
                page,
                prepage: pagesize,
                categories: curCates,
                sorter,
                published,
              })
            }
          }
          const handleDelete = async () => {
            try {
              const data = await $http.delete({ id: record.id })
              console.log(data, '')

              if (data.errNo === 0) {
                message.success('删除成功！')
              } else {
                message.error('删除失败！')
              }
            } catch (e) {
              message.error('删除失败！')
              fetchData({
                page,
                prepage: pagesize,
                categories: curCates,
                sorter,
                published,
              })
            }
          }
          return (
            <div className={styles.operateContent}>
              <span className={styles.operate}><Link to={`/editor/${record.id}`}>修改</Link></span>
              {!record.published ? (
                <Popconfirm
                  title="请再次确认是否发布？"
                  onConfirm={handlePublish}
                  okText="是"
                  cancelText="否"
                >
                  <span className={styles.operate}>发布</span>
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
    ])
  }, [cates, curCates, fetchData, page, pagesize, published, sorter])


  useEffect(() => {
    fetchData({
      page: 1, prepage: defaultPerpage, categories: null, sorter: null, type: 0, published: null,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleTableChange = (
    pagination: any,
    filters: any,
    { field, order }: {field: string, order: null | 'string'},
    extra: {
      currentDataSource: [],
      action: 'paginate'/* : paginate | sort | filter */
    },
  ) => {
    const convertSorter = field ? { [field]: { order: order?.slice(0, -3) } } : {}
    fetchData({
      type: 0,
      page: pagination.current,
      prepage: pagination.pageSize,
      categories: filters.categories,
      sorter: convertSorter,
      published: filters.published ? filters.published[0] : null,
    })
    setPage(pagination.current)
    setPagesize(pagination.pageSize)
    setCurCates(filters.categories)
    setSorter(convertSorter)
    setPublished(filters.published ? filters.published[0] : null)
    console.log(pagination, filters, field, order, extra)
  }
  const handleInputEnter = () => {
    if (!searchValue) return
    fetchData({
      page,
      prepage: pagesize,
      categories: curCates,
      published,
      sorter,
    })
    setPage(1)
  }
  const handleValueChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value.trim()
    setSearchValue(value)
  }
  const handleReset = () => window.location.reload()

  return (
    <div className={cns([styles.articlelist])}>
      <div className={styles.header}>
        <Button type="primary">
          <PlusOutlined />
          <span className={styles.addBtn}>添加文章</span>
        </Button>
        <div className="flex">
          <Input
            placeholder="请输入..."
            value={searchValue}
            onChange={handleValueChange}
            suffix={<SearchOutlined style={{ cursor: 'pointer' }} onClick={handleInputEnter} />}
            onPressEnter={handleInputEnter}
          />
          <Button className={styles.resetBtn} type="primary" onClick={handleReset} size="middle">重置</Button>
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
  )
}

export default ArticleList
