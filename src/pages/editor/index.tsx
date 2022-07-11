import React, { FunctionComponent, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { message, Spin } from 'antd'
import { RouteComponentProps } from 'react-router-dom'
import { InfoCircleOutlined } from '@ant-design/icons'
import styles from './index.scss'
import ToolBar from './components/Toolbar'
import ConfigModal from './components/ConfigModal'
import Header from './components/Header'
import {
  getArticleData, saveDocData, updateDocData, updateEditorState,
} from '@/store/reducers/editor'
import { RootState } from '@/store/reducers/interface'
import { EditWatchMode } from '@/common/interface'
import Content from './components/Content'
import { deleteLocalData, getLocalData, openDB } from '@/common/plugins/indexedDB'

interface IRouteParams {
  id: string,
  type: 'edit' | 'preview'
}
const Editor: FunctionComponent<RouteComponentProps<IRouteParams>> = ({
  match: {params },
}) => {
  const { id, type = 'preview' } = params
  const dispatch = useDispatch()
  const {
    editStatus: {
      configModalVisible,
    },
    getDataLoading,
    editWatchMode,
    shortcutKey,
    docData: {
      updateTime,
    },
  } = useSelector((state: RootState) => state.editor)
  const { offline } = useSelector((state: RootState) => state.common)
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
    if (!id || getDataLoading) return
    if (editWatchMode === EditWatchMode.edit) return

    openDB().then(() => {
      getLocalData({ id, index: 'byArticleId' }).then((res: {
        updatedAt?: number;
        title?: string;
        content?: string;
        desc?: string;
        categories?: number[]
      }) => {
        if (!res) return
        const { updatedAt } = res
        const curTime = new Date(updateTime).getTime()
        if (Number(updatedAt) <= curTime) { // 可能有时间差：发起请求的时间 < indexDB 存储的时间
          deleteLocalData({ id }).then(() => {
            message.info('暂存数据过期, 已删除')
          })
          return
        }
        message.info('检测到有暂存数据，正在保存中...')
        const {
          title, content, desc, categories,
        } = res
        dispatch(updateDocData({
          title, content, desc, categories,
        }))
        const cb = () => {
          // deleteLocalData({ id }).then(() => {
          message.info('暂存数据更新完成')
          // })
        }
        dispatch(saveDocData({
          title, content, desc, categories,
        }, cb))
      })
    })
  }, [id, getDataLoading, editWatchMode])
  return (
    <div className={styles.wrapper}>
      {offline && editWatchMode === EditWatchMode.edit && (
        <div className={styles.offline}>
          <InfoCircleOutlined className={styles.icon} />
          检测到网络异常，修改后的数据将被保存到本地！
        </div>
      )}
      <Header />
      {
        getDataLoading ? (
          <div className={styles.loading}>
            <Spin size="large" className={styles.spin} spinning tip="为您加载最新数据中..." />
          </div>
        )
          : (
            <>
              {editWatchMode === EditWatchMode.preview ? null : <ToolBar />}
              <Content />
              {configModalVisible ? <ConfigModal /> : null}
            </>
          )
      }

    </div>
  )
}

export default Editor
