import React, { FunctionComponent, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Spin } from 'antd'
import cns from 'classnames'
import styles from './index.scss'
import ToolBar from './components/Toolbar'
import ConfigModal from './components/ConfigModal'
import Header from './components/Header'
import { getArticleData } from '@/store/reducers/editor'
import { RootState } from '@/store/reducers/interface'
import { EditWatchMode } from '@/common/interface'
import Content from './components/Content'

interface IProps {
  match: {
    params: any
  },
  history: any
}
const Editor: FunctionComponent<IProps> = ({match: { params }, history}) => {
  const { id = 260251848 } = params
  const dispatch = useDispatch()
  const {
    editStatus: {
      configModalVisible,
    },
    getDataLoading,
    editWatchMode,
    shortcutKey,
  } = useSelector((state: RootState) => state.editor)

  useEffect(() => {
    dispatch(getArticleData(id))
    if (editWatchMode === EditWatchMode.edit) {
      shortcutKey.setEnable(true)
    } else {
      shortcutKey.setEnable(false)
    }
  }, [id, editWatchMode])

  return (
    <div className={styles.wrapper}>
      <Spin size="large" spinning={getDataLoading} tip="为您加载最新数据中..." className={cns(['absolute-center', styles.loading])} />
      <Header />
      { editWatchMode === EditWatchMode.preview ? null : <ToolBar /> }
      <Content history={history} />
      { configModalVisible ? <ConfigModal /> : null}
    </div>
  )
}

export default Editor
