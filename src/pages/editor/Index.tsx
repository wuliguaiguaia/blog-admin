import React, { FunctionComponent, useEffect, useState} from 'react'
import $http from '@/common/api'
import styles from './Index.scss'
import 'highlight.js/styles/github.css'
import { IArticle } from '@/common/interface'
import testImage from '@/assets/imgs/image.png'
import '@/assets/styles/md.scss'
import ToolBar from './components/Toolbar/Index'
import Content from './components/Content/Index'
import ConfigModal from './components/ConfigModal/Index'
import Header from './components/Header/Index'
import HistoryRecord, { IHistoryRecord } from '@/common/plugins/historyRecord'

interface IProps {
  match: {
    params: any
  }
}
const historyRecord: IHistoryRecord = new HistoryRecord()

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
    deleted: 0,
    published: 0,
  })
  // const { docData } = useSelector((state) => state.editor)

  const [cursorIndex, setCursorIndex] = useState({ start: 0, end: 0 })
  const [preview, setPreview] = useState(true)
  const [isConfigVisibile, setConfigVisibile] = useState(false)
  const handleConfigClick = () => setConfigVisibile(true)
  const picUpload = async (file: any) => {
    const form = new FormData()
    form.append('file', file)

    const response = await $http.upload(form, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    const { data: { filePath } } = response
    console.log(filePath)
    if (file.type.includes('image/')) {
      const left = data.content.substr(0, cursorIndex.start)
      const right = data.content.substr(cursorIndex.end)
      setData({
        ...data,
        content: `${left}<img src=${testImage} alt="" class="md-img"/>${right}`,
      })
    }
  }
  const dataChange = (changed: any) => {
    setData({
      ...data,
      ...changed,
    })
  }

  const [transContentLength, setTransContentLength] = useState(0)
  const getTransContentLength = (len: number) => {
    setTransContentLength(len)
  }

  // 刷新404了。。。
  useEffect(() => {
    const fetchData = async () => {
      const response = await $http.getarticle({ id })
      const { data: idata } = response
      setData(idata)
      historyRecord.addFirst(idata.content)
    }
    fetchData()
  }, [id])

  return (
    <div className={styles.wrapper}>
      <Header
        data={data}
        dataChange={dataChange}
        transContentLength={transContentLength}
      />
      <ToolBar
        picUpload={picUpload}
        handleConfigClick={handleConfigClick}
        historyRecord={historyRecord}
        dataChange={dataChange}
        preview={preview}
        setPreview={setPreview}
      />
      <Content
        data={data}
        picUpload={picUpload}
        preview={preview}
        dataChange={dataChange}
        setCursorIndex={setCursorIndex}
        historyRecord={historyRecord}
        getTransContentLength={getTransContentLength}
      />
      <ConfigModal
        data={data}
        isConfigVisibile={isConfigVisibile}
        setConfigVisibile={setConfigVisibile}
      />
    </div>
  )
}

export default Editor
