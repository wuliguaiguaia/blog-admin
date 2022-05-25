import React, {
  FunctionComponent, useEffect, useState,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Spin } from 'antd'
import cns from 'classnames'
import { RouteComponentProps } from 'react-router-dom'
import styles from './index.scss'
import ToolBar from './components/Toolbar'
import ConfigModal from './components/ConfigModal'
import Header from './components/Header'
import { getArticleData, updateEditorState } from '@/store/reducers/editor'
import { RootState } from '@/store/reducers/interface'
import { EditWatchMode } from '@/common/interface'
import Content from './components/Content'

interface IRouteParams {
  id: string,
  type: 'edit' | 'preview'
}
const Editor: FunctionComponent<RouteComponentProps<IRouteParams>> = ({
  match: {params }, history,
}) => {
  const { id, type = 'preview' } = params
  const [showContent, setShowContent] = useState(false)

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
    dispatch(updateEditorState({ editWatchMode: EditWatchMode[type]}))
  }, [type])
  useEffect(() => {
    dispatch(getArticleData(+id))
    if (editWatchMode === EditWatchMode.edit) {
      shortcutKey.setEnable(true)
    } else {
      shortcutKey.setEnable(false)
    }
  }, [id, editWatchMode])

  useEffect(() => {
    function fetch() {
      import(/* webpackChunkName: "highlightjs" */ 'highlight.js').then((hightlight) => {
        window.highlight = hightlight.default
        setShowContent(true)
      })
    }
    fetch()
  }, [])
  return (
    <div className={styles.wrapper}>
      <Spin size="large" spinning={getDataLoading} tip="为您加载最新数据中..." className={cns(['absolute-center', styles.loading])} />
      <Header />
      { editWatchMode === EditWatchMode.preview ? null : <ToolBar /> }
      { showContent ? <Content history={history} /> : null }
      { configModalVisible ? <ConfigModal /> : null }
    </div>
  )
}

export default Editor
