import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect } from 'react'
import { Button, message } from 'antd'
import { RootState } from '@/store/reducers/interface'
import styles from './index.scss'
import { saveDocData, updateDocData, updateEditorState } from '@/store/reducers/editor'
import { SaveStatus } from '@/common/interface'

const Save = () => {
  const {
    saveStatus,
    docData: { content, updateTime },
    backupData,
  } = useSelector((state: RootState) => state.editor)
  const { offline } = useSelector((state: RootState) => state.common)
  const dispatch = useDispatch()
  const handleSave = () => {
    dispatch(updateEditorState({
      saveStatus: SaveStatus.loading,
    }))
    const cb = (res: any) => {
      const { updateTime: iupdateTime } = res
      if (iupdateTime) {
        dispatch(updateEditorState({
          backupData: content,
        }))
        dispatch(updateDocData({
          updateTime: iupdateTime,
        }))
      }
      dispatch(updateEditorState({
        saveStatus: SaveStatus.end,
      }))
    }
    dispatch(saveDocData({
      content,
    }, cb, ['title', 'categories']))
  }

  useEffect(() => {
    let timer = setTimeout(function fn() {
      const notChange = backupData === content
      if (notChange) return
      handleSave()
      timer = setTimeout(fn, 5000)
    }, 5000)
    return () => {
      clearTimeout(timer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backupData, content])

  useEffect(() => {
    const handleBeforeUnload = (e: any) => {
      e.preventDefault()
      /* 弹出提示框 */
      const isChange = backupData !== content
      if (isChange) {
        if (!offline || (offline && saveStatus !== SaveStatus.end)) {
          message.warning('当前数据未保存，页面关闭或刷新将导致数据丢失!')
          return ''
        }
      }
      return true
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
  }, [backupData, content, offline, saveStatus])

  useEffect(() => {
    if (offline && saveStatus !== SaveStatus.end) {
      // message.warning('保存失败，尝试为你存储到本地...')
    }
  }, [offline, saveStatus])
  return (
    <>
      <p className={styles.updateTime}>
        最后更新于
        {updateTime.replace(/T/, ' ').slice(0, -5)}
      </p>
      <Button loading={saveStatus === SaveStatus.loading} className={styles.btn} size="middle" type="primary" onClick={handleSave}>保存</Button>
    </>
  )
}

export default Save
