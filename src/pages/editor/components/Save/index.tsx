import { useDispatch, useSelector } from 'react-redux'
import React, {
  FunctionComponent, useCallback, useEffect, useState,
} from 'react'
import { Button, message } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import cns from 'classnames'
import { RootState } from '@/store/reducers/interface'
import styles from './index.scss'
import {
  saveDocData, updateEditingHelperKeys, updateEditorState,
} from '@/store/reducers/editor'
import { EditWatchMode, SaveStatus } from '@/common/interface'
import { formatDate } from '@/common/utils'
import { autoSaveTime } from '@/common/constants'

interface IProps {
  history: any
}

const Save: FunctionComponent<IProps> = ({ history}) => {
  const {
    saveStatus,
    docData: { content, updateTime, id },
    backupData,
    editWatchMode,
    shortcutKey,
  } = useSelector((state: RootState) => state.editor)

  const { offline } = useSelector((state: RootState) => state.common)
  const dispatch = useDispatch()


  const handleSave = useCallback((_e?: any, callback?: any) => {
    console.log(1111)

    dispatch(saveDocData(['content'], callback))
  }, [content])

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
      history.push(`/article/${id}`)
    }
    handleSave(null, cb) /* 保存后退出 */
  }

  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setTimer(() => {
      if (timer) { clearTimeout(timer) }
      return null
    })
    handleSave()
    setTimer(setTimeout(function fn() {
      handleSave()
      setTimer(setTimeout(fn, autoSaveTime))
    }, autoSaveTime))
  }, [offline])

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
      <Button
        className={cns([styles.btn, saveStatus === SaveStatus.loading && styles.disabled])}
        size="middle"
        type="primary"
        onClick={handleSave}
      >
        {saveStatus === SaveStatus.loading ? <LoadingOutlined /> : '保存'}
      </Button>
      <Button className={styles.btn} size="middle" type="default" onClick={handlePreview}>预览</Button>
    </>
  )
}

export default Save


