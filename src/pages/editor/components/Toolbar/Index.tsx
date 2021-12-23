import React, { createRef, FunctionComponent } from 'react'
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
  const {
    editStatus: { preview },
    historyRecord,
  } = useSelector((state: RootState) => state.editor)
  const dispatch = useDispatch()

  const handleClickPic = () => {
    fileEl.current?.click()
  }
  const handlePreviewChange = (checked:boolean) => {
    dispatch(updateEditingStatus({
      preview: checked,
    }))
  }
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    dispatch(picUpload(file))
  }
  const handleUndo = () => {
    historyRecord.undo((data: string) => {
      dispatch(updateDocData({
        content: data,
      }))
    })
  }
  const handleRedo = () => {
    historyRecord.redo((data: string) => {
      dispatch(updateDocData({
        content: data,
      }))
    })
  }

  const handleConfigClick = () => {
    dispatch(updateEditingStatus({
      configModalVisible: true,
    }))
  }

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
          <input type="file" name="file" accept="image/*" className={styles.upload} ref={fileEl} onChange={handleFileChange} />
        </Tooltip>
      </div>
      <div className={styles.toolbarItem}>
        <span className={styles.toobarLabel}>预览</span>
        <Switch size="small" defaultChecked={preview} onChange={handlePreviewChange} />
        <div className={styles.toolarDivider} />
        <Popover content={<Help />} title="编辑说明" trigger="hover" placement="bottom">
          <QuestionCircleOutlined />
        </Popover>
      </div>
    </div>
  )
}

export default ToolBar
