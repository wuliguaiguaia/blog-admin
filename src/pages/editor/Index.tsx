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

interface IProps {
  match: {
    params: any
  }
}

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
      setData({
        ...data,
        content: `${data.content}<img src=${testImage} alt="" class="md-img"/>`,
      })
    }
  }
  const dataChange = (changed: any) => {
    setData({
      ...data,
      ...changed,
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

  return (
    <div className={styles.wrapper}>
      <Header
        title={data.title}
        updateTime={data.updateTime}
        dataChange={dataChange}
      />
      <ToolBar
        picUpload={picUpload}
        handleConfigClick={handleConfigClick}
      />
      <Content
        data={data}
        picUpload={picUpload}
        dataChange={dataChange}
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
