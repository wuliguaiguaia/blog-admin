import React, {
  createRef, FunctionComponent, useCallback, useEffect, useState,
} from 'react'
import {
  Tooltip, Switch, Popover,
} from 'antd'
import {
  PictureOutlined,
  RollbackOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import cns from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import styles from './Index.scss'
import { picUpload, updateDocData, updateEditingStatus } from '@/store/reducers/editor'
import { RootState } from '@/store/reducers/interface'
import Help from '../Help/Index'

interface IProps {}

const ToolBar: FunctionComponent<IProps> = () => {
  const fileEl = createRef<HTMLInputElement>()
  const helpPopoverEl = createRef<HTMLDivElement>()
  const {
    editStatus: { preview },
    historyRecord,
    shortcutKey,
  } = useSelector((state: RootState) => state.editor)
  const [helpPopoverVisible, setHelpPopoverVisible] = useState(false)
  const dispatch = useDispatch()

  const handleClickPic = useCallback(() => {
    fileEl.current?.click()
  }, [fileEl])

  const handlePreviewChange = useCallback(() => {
    console.log(preview, '-----')
    dispatch(updateEditingStatus({
      preview: !preview,
    }))
  }, [dispatch, preview])

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0]
    dispatch(picUpload(file))
  }, [dispatch])
  const handleUndo = useCallback(() => {
    console.log('undo')
    historyRecord.undo((data: string) => {
      dispatch(updateDocData({
        content: data,
      }))
    })
  }, [dispatch, historyRecord])
  const handleRedo = useCallback(() => {
    console.log('redo')
    historyRecord.redo((data: string) => {
      dispatch(updateDocData({
        content: data,
      }))
    })
  }, [dispatch, historyRecord])
  const handleConfigClick = useCallback(() => {
    dispatch(updateEditingStatus({
      configModalVisible: true,
    }))
  }, [dispatch])
  const handleClickHelp = useCallback(() => {
    setHelpPopoverVisible(!helpPopoverVisible)
  }, [helpPopoverVisible])

  useEffect(() => {
    shortcutKey.subscribe({ keys: ['ctrl', 'y'], cb: handleRedo })
    shortcutKey.subscribe({ keys: ['ctrl', 'z'], cb: handleUndo })
    shortcutKey.subscribe({ keys: ['ctrl', 'shift', 'z'], cb: handleRedo })
    shortcutKey.subscribe({ keys: ['alt', 'p'], cb: handleClickPic })
    shortcutKey.subscribe({ keys: ['alt', 'v'], cb: handlePreviewChange })
    shortcutKey.subscribe({ keys: ['alt', 'q'], cb: handleConfigClick })
    shortcutKey.subscribe({ keys: ['alt', 'h'], cb: handleClickHelp })
    return () => {
      shortcutKey.unSubscribe({ keys: ['ctrl', 'y'], cb: handleRedo })
      shortcutKey.unSubscribe({ keys: ['ctrl', 'z'], cb: handleUndo })
      shortcutKey.unSubscribe({ keys: ['ctrl', 'shift', 'z'], cb: handleRedo })
      shortcutKey.unSubscribe({ keys: ['alt', 'p'], cb: handleClickPic })
      shortcutKey.unSubscribe({ keys: ['alt', 'v'], cb: handlePreviewChange })
      shortcutKey.unSubscribe({ keys: ['alt', 'q'], cb: handleConfigClick })
      shortcutKey.unSubscribe({ keys: ['alt', 'h'], cb: handleClickHelp })
    }
  }, [handleClickHelp, handleClickPic,
    handleConfigClick, handlePreviewChange, handleRedo, handleUndo, shortcutKey])

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarItem} onClick={handleConfigClick}>
        <span className={styles.toobarLabel}>配置项</span>
        <SettingOutlined className={styles.toobarIcon} />
        <div className={styles.toolarDivider} />
      </div>
      <div className={cns([styles.toolbarItem, styles.toolbarCenter])}>
        <Tooltip placement="bottom" title="撤销">
          <RollbackOutlined
            className={cns([styles.undo, !historyRecord.canUndo && styles.disabled])}
            onClick={handleUndo}
          />
        </Tooltip>
        <Tooltip placement="bottom" title="重做">
          <RollbackOutlined
            className={cns([styles.redo, !historyRecord.canRedo && styles.disabled])}
            onClick={handleRedo}
          />
        </Tooltip>
        <div className={styles.toolarDivider} />
        <Tooltip placement="bottom" title="图片">
          <PictureOutlined onClick={handleClickPic} />
          <input
            type="file"
            name="file"
            accept="image/*"
            className={styles.upload}
            ref={fileEl}
            onChange={handleFileChange}
          />
        </Tooltip>
      </div>
      <div className={styles.toolbarItem}>
        <span className={styles.toobarLabel}>预览</span>
        <Switch size="small" checked={preview} onChange={handlePreviewChange} />
        <div className={styles.toolarDivider} />
        <Popover
          content={<Help />}
          title="编辑说明"
          trigger={['hover', 'focus', 'click']}
          placement="bottom"
          ref={helpPopoverEl}
          visible={helpPopoverVisible}
          onMouseEnter={handleClickHelp}
          onMouseLeave={handleClickHelp}
        >
          <QuestionCircleOutlined />
        </Popover>
      </div>
    </div>
  )
}

export default ToolBar
