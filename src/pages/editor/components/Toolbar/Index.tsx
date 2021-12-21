import React, { createRef, FunctionComponent } from 'react'
import { Tooltip, Switch } from 'antd'
import {
  PictureOutlined, PushpinFilled, PushpinOutlined, RollbackOutlined, SettingOutlined,
} from '@ant-design/icons'
import cns from 'classnames'
import styles from './Index.scss'
import { IHistoryRecord } from '@/common/plugins/historyRecord'

interface IProps {
  handleConfigClick: () => void
  picUpload: (file: any) => Promise<void>
  historyRecord: IHistoryRecord
  dataChange: (data: any) => void
  preview: boolean
  setPreview: (preview: boolean) => void
}

const ToolBar: FunctionComponent<IProps> = ({
  handleConfigClick, picUpload, historyRecord, dataChange,
  preview, setPreview,
}) => {
  const fileEl = createRef<HTMLInputElement>()
  const handleClickPic = () => {
    fileEl.current?.click()
  }
  const handlePreviewChange = (checked:boolean) => {
    setPreview(checked)
  }
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    picUpload(file)
  }
  const handleUndo = () => {
    historyRecord.undo((data) => {
      dataChange({content: data})
    })
  }
  const handleRedo = () => {
    historyRecord.redo((data) => {
      dataChange({ content: data })
    })
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
        <span className={styles.toobarLabel}>大纲</span>
        <PushpinOutlined className={styles.toobarIcon} />
        <PushpinFilled className={styles.toobarIcon} />
        <div className={styles.toolarDivider} />
        <span className={styles.toobarLabel}>预览</span>
        <Switch size="small" defaultChecked={preview} onChange={handlePreviewChange} />
      </div>
    </div>
  )
}

export default ToolBar
