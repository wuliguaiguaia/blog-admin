import { useDispatch, useSelector } from 'react-redux'
import React, { FunctionComponent, useCallback, useEffect } from 'react'
import { Button, message } from 'antd'
import { RootState } from '@/store/reducers/interface'
import styles from './index.scss'
import {
  saveDocData, updateDocData, updateEditingHelperKeys, updateEditorState,
} from '@/store/reducers/editor'
import { EditWatchMode, IEditWatchMode, SaveStatus } from '@/common/interface'
import { getDateDetail } from '@/common/utils'
import { getLocalData } from '@/common/plugins/indexedDB'

interface IProps {
  history: any
}

const Save: FunctionComponent<IProps> = ({ history}) => {
  console.log('render')
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
    dispatch(updateEditorState({
      saveStatus: SaveStatus.loading,
    }))
    const cb = (res: any) => {
      const { updateTime: iupdateTime } = res
      if (iupdateTime) {
        console.log('222')
        dispatch(updateDocData({
          updateTime: iupdateTime,
        }))
      }
      dispatch(updateEditorState({
        saveStatus: SaveStatus.end,
      }))
      if (callback) callback()
    }
    dispatch(saveDocData({
      content,
    }, cb, ['title', 'categories']))
  }, [content, dispatch])

  const handleSave = useCallback((_e?: any, callback?: any) => {
    console.log('11111', content === backupData)
    console.log('content', content)
    console.log('backupData', backupData)
    const notChange = backupData === content
    if (notChange || saveStatus === SaveStatus.loading) {
      if (callback) callback()
      return
    }
    savehandler(callback)
  }, [backupData, content, saveStatus, savehandler])

  const handlePreview = () => {
    const cb = () => {
      const mode = editWatchMode === EditWatchMode.edit
        ? EditWatchMode.preview : EditWatchMode.edit
      dispatch(updateEditorState({
        editWatchMode: mode,
      }))
      if (mode === EditWatchMode.preview) {
        historyRecord.destroy()
      }
      const {hash} = window.location
      history.push(`/article/${id}/${IEditWatchMode[0]}${hash}`)
    }
    handleSave(null, cb) /* 保存后退出 */
  }

  useEffect(() => {
    console.log('新增定时器')
    const timer = setTimeout(() => {
      const cb = () => {
        console.log('重启定时器')
        clearTimeout(timer)
        // timer = setTimeout(fn, 5000)
      }
      handleSave(null, cb) /* 保存后加定时器 */
    }, 5000)
    return () => {
      clearTimeout(timer)
    }
  }, [handleSave])
  /*
    只有当handlesave 变化才销毁再重启， 其实就是content 发生变化，5s 后进行保存，
    【5s内不变化才保存，content不变化不会触发保存，只要变化就会重新开启定时器，没法保证定时器不间断？？？？】
    handleSave 有callback时就一定要加到依赖里

    在timeout里再加timeout，为什么每次 backup 得到的都不是更新后的？？？
  */

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
        if (!offline || (offline && saveStatus !== SaveStatus.end)) {
          message.warning('当前数据未保存，页面关闭或刷新将导致数据丢失!')
          return ''
        }
      }
      return false
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
  }, [backupData, content, offline, saveStatus])

  useEffect(() => {
    if (offline && saveStatus !== SaveStatus.end) {
      // message.warning('保存失败，尝试为你存储到本地...')
    }
  }, [offline, saveStatus])

  useEffect(() => {
    if (!id) return
    getLocalData({ id }).then((res) => {
      const { updatedAt } = res
      const curTime = new Date(updateTime).getTime()
      if (Number(updatedAt) <= curTime) return
      savehandler()
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editWatchMode, id])
  return (
    <>
      <p className={styles.updateTime}>
        最后更新于
        {getDateDetail(updateTime)}
      </p>
      <Button loading={saveStatus === SaveStatus.loading} className={styles.btn} size="middle" type="primary" onClick={handleSave}>保存</Button>
      <Button className={styles.btn} size="middle" type="default" onClick={handlePreview}>预览</Button>
    </>
  )
}

export default Save


