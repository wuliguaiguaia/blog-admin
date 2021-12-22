import React, { FunctionComponent, useEffect} from 'react'
import { useDispatch } from 'react-redux'
import styles from './Index.scss'
import ToolBar from './components/Toolbar/Index'
import Content from './components/Content/Index'
import ConfigModal from './components/ConfigModal/Index'
import Header from './components/Header/Index'
import { getArticleData } from '@/store/reducers/editor'

interface IProps {
  match: {
    params: any
  }
}

const Editor: FunctionComponent<IProps> = ({match: { params }}) => {
  console.log(params.id)
  const { id = 260251848 } = params
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getArticleData(id))
  }, [dispatch, id])

  return (
    <div className={styles.wrapper}>
      <Header />
      <ToolBar />
      <Content />
      <ConfigModal />
    </div>
  )
}

export default Editor
