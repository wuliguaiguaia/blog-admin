import React, { FunctionComponent, useEffect, useState } from 'react'
import { Button, Input, Select } from 'antd'
import { marked } from 'marked'
import hljs from 'highlight.js'
import cns from 'classnames'
import { EditOutlined } from '@ant-design/icons'
import $http from '@/common/api'
import styles from './Index.scss'
import 'highlight.js/styles/github.css'

// const { Option } = Select

interface IProps {
  match: {
    params: any
  }
}
const { TextArea } = Input
const Editor: FunctionComponent<IProps> = ({match: { params }}) => {
  console.log(params.id)
  const { id = '260251848' } = params
  const [data, setData] = useState({
    title: '',
    content: '',
    updateTime: '',
  })
  // 刷新404了。。。
  useEffect(() => {
    const fetchData = async () => {
      const response = await $http.getarticle({ id })
      console.log(response)
      const { data: idata } = response
      setData(idata)
    }
    fetchData()
  }, [id])
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

  const onTextChange = () => {}
  return (
    <div className={styles.wrapper}>
      <div className={cns([styles.header, 'jusBetween-alignCenter'])}>
        <div className="align-baseline">
          <div className={styles.title}>{data.title}</div>
          <EditOutlined className={styles.editIcon} />
          {/* <LockOutlined className={styles.lockIcon} /> */}
          <p className={styles.updateTime}>
            最后更新于
            {data.updateTime.replace(/T/, ' ').slice(0, -5)}
          </p>
        </div>
        <div className="flex">
          <div className={cns(['align-center', styles.catesWrapper])}>
            <span className={styles.catesLabel}>分类:</span>
            <Select
              className={styles.catesSelect}
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select"
              defaultValue={['a10', 'c12']}
            />
          </div>
          <Button className={styles.saveBtn} size="middle" type="primary">保存</Button>
          <Button size="middle" type="primary">发布</Button>
        </div>
      </div>
      <div className={cns([styles.container, 'flex'])}>
        <div className={styles.leftContent}>
          <TextArea placeholder="请输入..." autoSize bordered={false} value={data.content} onChange={onTextChange} />
        </div>
        <div className={styles.containerLine} />
        <div
          className={styles.rightContent}
          dangerouslySetInnerHTML={{ __html: marked.parse(data.content) }}
        />
      </div>
    </div>
  )
}

export default Editor
