import React, {
  createRef, FunctionComponent, useEffect, useState,
} from 'react'
import {
  Button, Input, Select, Modal,
} from 'antd'
import { marked } from 'marked'
import hljs from 'highlight.js'
import cns from 'classnames'
import {
  BarsOutlined, EditOutlined, SettingOutlined,
} from '@ant-design/icons'
import $http from '@/common/api'
import styles from './Index.scss'
import 'highlight.js/styles/github.css'
import { IArticle, ICategory } from '@/common/interface'

interface IProps {
  match: {
    params: any
  }
}
const { Option } = Select
const { TextArea } = Input

const Editor: FunctionComponent<IProps> = ({match: { params }}) => {
  console.log(params.id)
  const { id = 50655683 } = params
  const [data, setData] = useState<IArticle>({
    id,
    viewCount: 0,
    title: '',
    content: '',
    createTime: '',
    updateTime: '',
    categories: [],
  })
  const [isEditTitle, setEditTitle] = useState(false)
  const [cates, setCates] = useState([])
  const [isConfigVisibile, setConfigVisibile] = useState(false)
  const inputEl = createRef<Input>()
  // const [selectedCates, setSelectedCates] = useState([])
  const handleConfigSubmit = () => setConfigVisibile(false)
  const handleConfigCancel = () => setConfigVisibile(false)
  const handleConfigClick = () => setConfigVisibile(true)
  const handleClickEditTitle = () => setEditTitle(true)
  const handleTitleBlur = () => setEditTitle(false)

  const handlePaste = async (e) => {
    const file = e.clipboardData.files[0]
    console.log(file)
    e.preventDefault()
  }
  useEffect(() => {
    if (isEditTitle) {
      inputEl.current?.focus()
    } else {
      inputEl.current?.blur()
    }
  }, [inputEl, isEditTitle])
  const handleTitleChange = (e) => {
    setData({
      ...data,
      title: e.target.value,
    })
  }

  // 刷新404了。。。
  useEffect(() => {
    const fetchData = async () => {
      const response = await $http.getarticle({ id })
      const { data: idata } = response
      setData(idata)
    }
    fetchData()
  }, [id])
  useEffect(() => {
    const fetch = async () => {
      const response:any = await $http.getcategorylist()
      const idata = response.data.list.map(({ id: iid, name }) => ({iid, name }))
      setCates(idata)
    }
    fetch()
  }, [])

  const renderer = new marked.Renderer()
  marked.setOptions({
    renderer,
    gfm: true,
    pedantic: false,
    sanitize: false,
    breaks: false,
    smartLists: true,
    smartypants: false,
    highlight(code: string) {
      return hljs.highlightAuto(code).value
    },
  })
  const onTextChange = (e) => {
    setData({
      ...data,
      content: e.target.value,
    })
  }

  return (
    <div className={styles.wrapper}>
      <div className={cns([styles.header, 'jusBetween-alignCenter'])}>
        <div className="align-center">
          {
            isEditTitle ? (
              <Input
                ref={inputEl}
                className={cns([styles.titleInput, 'click-outside'])}
                placeholder="请输入名称~"
                value={data.title}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
              />
            ) : (
              <>
                <div className={styles.title}>{data.title}</div>
                <EditOutlined className={styles.editIcon} onClick={handleClickEditTitle} />
              </>
            )
          }
        </div>
        <div className="align-center">
          <p className={styles.updateTime}>
            最后更新于
            {data.updateTime.replace(/T/, ' ').slice(0, -5)}
          </p>
          <Button className={styles.saveBtn} size="middle" type="primary">保存</Button>
          <Button size="middle" type="primary">发布</Button>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.toobarItem} onClick={handleConfigClick}>
          <span className={styles.toobarLabel}>配置项</span>
          <SettingOutlined className={styles.toobarIcon} />
          <div className={styles.toolarDivider} />
        </div>
        <div className={styles.toobarItem}>
          <span className={styles.toobarLabel}>大纲</span>
          <BarsOutlined className={styles.toobarIcon} />
          {/* <div className={styles.toolarDivider} /> */}
        </div>
      </div>
      <div className={cns([styles.container, 'flex'])}>
        <div className={styles.leftContent}>
          <TextArea
            placeholder="请输入..."
            autoSize
            bordered={false}
            value={data.content}
            onChange={onTextChange}
            onPaste={handlePaste}
          />
        </div>
        <div className={styles.containerLine} />
        <div
          className={styles.rightContent}
          dangerouslySetInnerHTML={{ __html: marked.parse(data.content) }}
        />
      </div>

      <Modal
        title="文档配置项"
        visible={isConfigVisibile}
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
            defaultValue={data.categories.map((item) => item.id)}
          >
            {
              cates.map((item: ICategory) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))
            }
          </Select>
        </div>
      </Modal>
    </div>
  )
}

export default Editor
