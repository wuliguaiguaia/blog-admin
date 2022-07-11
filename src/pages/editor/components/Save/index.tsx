import { useDispatch, useSelector } from 'react-redux'
import React, {
  FunctionComponent, useCallback, useEffect, useState,
} from 'react'
import { Button, message } from 'antd'
import { RootState } from '@/store/reducers/interface'
import styles from './index.scss'
import {
  saveDocData, updateEditingHelperKeys, updateEditorState,
} from '@/store/reducers/editor'
import { EditWatchMode, SaveStatus } from '@/common/interface'
import { formatDate } from '@/common/utils'

interface IProps {
  history: any
}

const Save: FunctionComponent<IProps> = ({ history}) => {
  const {
    saveStatus,
    docData: { content, updateTime, id },
    backupData,
    editWatchMode,
    historyRecord,
    shortcutKey,
  } = useSelector((state: RootState) => state.editor)

  const { offline } = useSelector((state: RootState) => state.common)
  const dispatch = useDispatch()

  const savehandler = useCallback((callback?: any) => {
    const cb = () => {
      if (callback) callback()
    }
    dispatch(saveDocData({
      content,
    }, cb))
  }, [content, dispatch])

  const handleSave = useCallback((_e?: any, callback?: any) => {
    const notChange = backupData === content
    if (notChange) {
      if (callback) callback()
      return
    }
    // if (saveStatus === SaveStatus.loading) {
    // }
    savehandler(callback)
  }, [backupData, content, saveStatus, savehandler])

  const handlePreview = () => {
    const cb = () => {
      if (offline) {
        message.error('已断网')
        return
      }
      const mode = editWatchMode === EditWatchMode.edit
        ? EditWatchMode.preview : EditWatchMode.edit
      dispatch(updateEditorState({
        editWatchMode: mode,
      }))
      if (mode === EditWatchMode.preview) {
        historyRecord.destroy()
      }
      history.push(`/article/${id}`)
    }
    handleSave(null, cb) /* 保存后退出 */
  }

  const [timer, setTimer] = useState<null | NodeJS.Timeout>(null)
  useEffect(() => {
    // 变化了 5s 后保存
    if (timer) clearTimeout(timer)
    setTimer(setTimeout(() => {
      handleSave()
    }, 5000))
  }, [content])

  useEffect(() => {
    shortcutKey.subscribe({ keys: ['ctrl', 's'], cb: handleSave })
    const keyStr = ['ctrl', 's'].join('+')
    dispatch(updateEditingHelperKeys({ [keyStr]: '保存' }))
    shortcutKey.updateValidList([{ keys: ['ctrl', 's'], enable: true }])
  }, [handleSave])

  useEffect(() => {
    const handleBeforeUnload = (e: any) => {
      e.preventDefault()
      /* 弹出提示框 */
      const isChange = backupData !== content
      if (isChange) {
        message.warning('当前数据未保存，页面关闭或刷新将导致数据丢失!')
        if (!offline || (offline && saveStatus !== SaveStatus.end)) {
          e.returnValue = ''
          return ''
        }
      }
      return false
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [backupData, content, offline, saveStatus])

  return (
    <>
      <p className={styles.updateTime}>
        最后更新于
        {formatDate(+updateTime)}
      </p>
      <Button loading={saveStatus === SaveStatus.loading} className={styles.btn} size="middle" type="primary" onClick={handleSave}>保存</Button>
      <Button className={styles.btn} size="middle" type="default" onClick={handlePreview}>预览</Button>
    </>
  )
}

export default Save


