import React, { createRef, FunctionComponent } from 'react'
import { Tooltip } from 'antd'
import { BarsOutlined, PictureOutlined, SettingOutlined } from '@ant-design/icons'
import styles from './Index.scss'


interface IProps {
  handleConfigClick: () => void
  picUpload: (file: any) => Promise<void>
}

const ToolBar:FunctionComponent<IProps> = ({handleConfigClick, picUpload}) => {
  const fileEl = createRef<HTMLInputElement>()
  const handleClickPic = () => {
    fileEl.current?.click()
  }
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    picUpload(file)
  }
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarItem} onClick={handleConfigClick}>
        <span className={styles.toobarLabel}>配置项</span>
        <SettingOutlined className={styles.toobarIcon} />
        <div className={styles.toolarDivider} />
      </div>
      <div className={styles.toolbarCenter}>
        <Tooltip placement="bottom" title="图片">
          <PictureOutlined onClick={handleClickPic} />
          <input type="file" name="file" accept="image/*" className={styles.upload} ref={fileEl} onChange={handleFileChange} />
        </Tooltip>
      </div>
      <div className={styles.toobarlItem}>
        <span className={styles.toobarLabel}>大纲</span>
        <BarsOutlined className={styles.toobarIcon} />
        {/* <div className={styles.toolarDivider} /> */}
      </div>
    </div>
  )
}

export default ToolBar
