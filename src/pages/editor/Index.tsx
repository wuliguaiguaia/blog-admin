import React, { FunctionComponent, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Spin } from 'antd'
import cns from 'classnames'
import styles from './Index.scss'
import ToolBar from './components/Toolbar/Index'
import Content from './components/Content/Index'
import ConfigModal from './components/ConfigModal/Index'
import Header from './components/Header/Index'
import { getArticleData } from '@/store/reducers/editor'
import { RootState } from '@/store/reducers/interface'
import { EditWatchMode } from '@/common/interface'

interface IProps {
  match: {
    params: any
  }
}

const Editor: FunctionComponent<IProps> = ({match: { params }}) => {
  console.log(params.id)
  const { id = 50655683 } = params
  const dispatch = useDispatch()
  const {
    editStatus: {
      configModalVisible,
    },
    getDataLoading,
    editWatchMode,
  } = useSelector((state: RootState) => state.editor)
  useEffect(() => {
    dispatch(getArticleData(id))
  }, [dispatch, id, editWatchMode])

  return (
    <div className={styles.wrapper}>
      <Spin size="large" spinning={getDataLoading} tip="为您加载最新数据中..." className={cns(['absolute-center', styles.loading])} />
      <Header />
      { editWatchMode === EditWatchMode.preview ? null : <ToolBar /> }
      <Content />
      { configModalVisible ? <ConfigModal /> : null}
    </div>
  )
}

export default Editor
