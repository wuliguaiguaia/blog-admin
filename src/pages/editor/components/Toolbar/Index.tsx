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
import {
  picUpload, updateDocData, updateEditingHelperKeys, updateEditingStatus,
} from '@/store/reducers/editor'
import { RootState } from '@/store/reducers/interface'
import Helper from '../Helper/Index'
import { IHelperKeys, IOString } from '@/common/interface'


const helperKeysMap: IHelperKeys[] = [
  {
    keys: ['alt', 'q'], cb: 'handleConfigClick', title: '打开配置项', enable: true,
  },
  {
    keys: ['ctrl', 'z'], cb: 'handleUndo', title: '撤销', enable: true,
  },
  {
    keys: ['ctrl', 'y'], cb: 'handleRedo', title: '重做', enable: true,
  },
  {
    keys: ['ctrl', 'shift', 'z'], cb: 'handleRedo', title: '重做', enable: true,
  },
  {
    keys: ['alt', 'p'], cb: 'handleClickPic', title: '插入图片', enable: true,
  },
  {
    keys: ['alt', 'v'], cb: 'handleOutlineChange', title: '大纲切换', enable: true,
  },
  {
    keys: ['alt', 'h'], cb: 'handleClickHelp', title: '切换帮助面板', enable: true,
  },
]

interface IProps { }

const ToolBar: FunctionComponent<IProps> = () => {
  const fileEl = createRef<HTMLInputElement>()
  const helpPopoverEl = createRef<HTMLDivElement>()
  const {
    editStatus: { outline, configModalVisible },
    historyRecord,
    shortcutKey,
  } = useSelector((state: RootState) => state.editor)
  const [helpPopoverVisible, setHelpPopoverVisible] = useState(false)
  const dispatch = useDispatch()

  const handleClickPic = useCallback(() => {
    fileEl.current?.click()
  }, [fileEl])

  const handleOutlineChange = useCallback(() => {
    const status = !outline
    dispatch(updateEditingStatus({
      outline: status,
    }))
    const setValidList = (enable: boolean) => [
      {
        keys: ['alt', 'q'], cb: 'handleConfigClick', title: '打开配置项', enable,
      },
      {
        keys: ['ctrl', 'z'], cb: 'handleUndo', title: '撤销', enable,
      },
      {
        keys: ['ctrl', 'y'], cb: 'handleRedo', title: '重做', enable,
      },
      {
        keys: ['ctrl', 'shift', 'z'], cb: 'handleRedo', title: '重做', enable,
      },
      {
        keys: ['alt', 'p'], cb: 'handleClickPic', title: '插入图片', enable,
      },
    ]
    if (status) {
      shortcutKey.updateValidList(setValidList(false))
    } else {
      shortcutKey.updateValidList(setValidList(true))
    }
  }, [dispatch, outline, shortcutKey])

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0]
    dispatch(picUpload(file))
  }, [dispatch])
  const handleUndo = useCallback(() => {
    historyRecord.undo((data: string) => {
      dispatch(updateDocData({
        content: data,
      }))
    })
  }, [dispatch, historyRecord])
  const handleRedo = useCallback(() => {
    historyRecord.redo((data: string) => {
      dispatch(updateDocData({
        content: data,
      }))
    })
  }, [dispatch, historyRecord])
  const handleConfigClick = useCallback(() => {
    const status = !configModalVisible
    dispatch(updateEditingStatus({
      configModalVisible: status,
    }))
    const setValidList = (enable: boolean) => [
      {
        keys: ['ctrl', 'z'], cb: 'handleUndo', title: '撤销', enable,
      },
      {
        keys: ['ctrl', 'y'], cb: 'handleRedo', title: '重做', enable,
      },
      {
        keys: ['ctrl', 'shift', 'z'], cb: 'handleRedo', title: '重做', enable,
      },
      {
        keys: ['alt', 'p'], cb: 'handleClickPic', title: '插入图片', enable,
      },
      {
        keys: ['alt', 'v'], cb: 'handleOutlineChange', title: '切换预览模式', enable,
      },
    ]
    if (status) {
      shortcutKey.updateValidList(setValidList(false))
    } else {
      shortcutKey.updateValidList(setValidList(true))
    }
  }, [configModalVisible, dispatch, shortcutKey])
  const handleClickHelp = useCallback(() => {
    setHelpPopoverVisible(!helpPopoverVisible)
  }, [helpPopoverVisible])

  useEffect(() => {
    const maps = helperKeysMap.reduce((res: IOString, { keys, title }) => {
      const keyStr = keys.join('+')
      res[keyStr] = title
      return res
    }, {})
    dispatch(updateEditingHelperKeys(maps))
  }, [dispatch])

  useEffect(() => {
    const utils: any = {
      handleConfigClick,
      handleUndo,
      handleRedo,
      handleClickPic,
      handleOutlineChange,
      handleClickHelp,
    }
    helperKeysMap.forEach(({ keys, cb, enable}) => {
      if (utils[cb]) {
        shortcutKey.subscribe({ keys, cb: utils[cb] })
        shortcutKey.updateValidList([{ keys, enable }])
      }
    })

    return () => {
      helperKeysMap.forEach(({ keys, cb }) => {
        if (utils[cb]) {
          shortcutKey.unSubscribe({ keys, cb: utils[cb] })
        }
      })
    }
  }, [handleClickHelp, handleClickPic, handleConfigClick, handleOutlineChange,
    handleRedo, handleUndo, shortcutKey])

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
        <span className={styles.toobarLabel}>大纲</span>
        <Switch size="small" checked={outline} onChange={handleOutlineChange} />
        <div className={styles.toolarDivider} />
        <Popover
          content={<Helper />}
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
