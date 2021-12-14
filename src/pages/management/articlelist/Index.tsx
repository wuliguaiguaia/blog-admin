import React, {
  ChangeEventHandler,
  createRef,
  useEffect, useRef, useState,
} from 'react'
import cns from 'classnames'
import {
  Button,
  Input,
  Table, Tag, Tooltip,
} from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import styles from './Index.scss'
import $http from '@/common/api'

const ArticleList = () => {
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [pagesize, setPagesize] = useState(20)
  const [total, setTotal] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [type, setType] = useState(0)
  const [cates, setCates] = useState<any>([])
  const [columns, setColumns] = useState<any>([])
  const [curCates, setCurCates] = useState([])
  const [sorter, setSorter] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const response = await $http.getcategorylist()
      const { data } = response
      const { list } = data
      const _data = list.map(({ id, name }) => ({ text: name, value: id }))
      setCates(_data)
      console.log(_data)
    }
    fetchData()
  }, [])

  useEffect(() => {
    setColumns([
      {
        title: 'id',
        dataIndex: 'id',
        width: 130,
      },
      {
        title: '名称',
        dataIndex: 'title',
        width: 200,
        onCell: (record: any) => ({
          className: `cell-${record.id}`,
        }),
        render: (title: string, record: any) => (
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
        // filterMultiple: true,
        width: 160,
        filters: cates,
        // onFilter: (value, record) => {
        //   console.log(value, record)

        //   return record
        //   // record.name.indexOf(value) === 0
        // },
        render: (categories: any[]) => (
          <span>
            {categories.map((item, index) => {
              const color = 'green'
              return (
                <Tag color={color} key={index}>
                  {item.name.toUpperCase()}
                </Tag>
              )
            })}
          </span>
        ),
      },
      {
        title: '是否发布',
        dataIndex: 'published',
        width: 90,
        render: (published: number | undefined) => (published ? '是' : '否'),
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        width: 180,
        sorter: (a, b) => a - b,
        render: (updateTime: string) => updateTime.replace(/-/g, '/').replace('T', ' ').replace(/Z|T/, '').slice(0, -4),
      },
      {
        title: '操作',
        width: 160,
        render: (_, record) => (
          <div className={styles.operateContent}>
            <a className={styles.operate}>修改</a>
            <a className={styles.operate}>发布</a>
            <a className={styles.operate}>删除</a>
          </div>
        ),
      },
    ])
  }, [cates])

  const fetchData = async () => {
    setLoading(true)
    let response = {}
    const params = {
      page,
      prepage: pagesize,
      categories: curCates,
      sorter,
    }

    if (type === 0) {
      response = await $http.getarticlelist(params)
      const { data } = response
      setTotal(data.total)
      setList(data.list)
    } else {
      response = await $http.search({...params, words: searchValue})
      const { data } = response
      setTotal(data.total)
      setList(data.list.map((item) => item._source))
      setSearchValue('')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleTableChange = ({ pageSize, current }, { categories}, {field, order}, extra: { currentDataSource: [], action/* : paginate | sort | filter */ }) => {
    setPage(current)
    setPagesize(pageSize)
    setCates(categories)
    console.log()
    if (order) {
      setSorter({ [field]: {order: order.slice(0, -3)} })
    }
    fetchData()
    console.log(field, order, extra)
  }
  const handleInputEnter = () => {
    if (!searchValue) return
    setPage(1)
    setType(1)
    fetchData()
  }
  const handleValueChange: ChangeEventHandler<HTMLInputElement> = (e) => setSearchValue(e.target.value)

  return (
    <div className={cns([styles.articlelist])}>
      <div className={styles.header}>
        <Button type="primary">
          <PlusOutlined />
          <span className={styles.addBtn}>添加文章</span>
        </Button>
        <div>
          <Input
            placeholder="请输入..."
            value={searchValue}
            onChange={handleValueChange}
            suffix={<SearchOutlined style={{ cursor: 'pointer' }} onClick={handleInputEnter} />}
            onPressEnter={handleInputEnter}
          />
        </div>
      </div>
      <Table
        className={styles.table}
        dataSource={list}
        loading={loading}
        columns={columns}
        scroll={{ y: '70vh' }}
        rowKey="id"
        onChange={handleTableChange}
        pagination={{
          position: ['bottomRight'],
          total,
          showTotal: (_total) => `共 ${_total} 条数据`,
        }}
      />
    </div>
  )
}

export default ArticleList
