import React, {
  useState, useEffect, createRef, FunctionComponent, useCallback,
} from 'react'
import cns from 'classnames'
import {
  Button, Dropdown, Input, Menu, message, Modal,
} from 'antd'
import {
  DeleteOutlined,
  EditOutlined, ExclamationCircleOutlined, MoreOutlined, RollbackOutlined, SendOutlined,
} from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import styles from './index.scss'
import { saveDocData, updateDocData, updateEditorState } from '@/store/reducers/editor'
import { RootState } from '@/store/reducers/interface'
import $http from '@/common/api'
import { EditWatchMode } from '@/common/interface'
import Save from '../Save'
import { formatDate } from '@/common/utils'

const { confirm } = Modal

interface IProps {
  history: any
}

const Header: FunctionComponent<IProps> = ({ history }) => {
  const [isEditTitle, setEditTitle] = useState(false)
  const inputEl = createRef<Input>()
  const {
    editor: {
      transContentLength,
      docData: {
        createTime, updateTime, title, deleted, published, id,
      },
      editWatchMode,
    },
    common: {
      userRole,
      authConfig,
    },
  } = useSelector((state: RootState) => state)
  const [curTitle, setCurTitle] = useState(title)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isEditTitle) {
      inputEl.current?.focus()
    } else {
      inputEl.current?.blur()
    }
  }, [inputEl, isEditTitle])

  useEffect(() => {
    setCurTitle(title)
  }, [title])

  const handleClickEditTitle = () => setEditTitle(true)
  const onTextChange = useCallback((e) => {
    setCurTitle(e.target.value)
  }, [])

  const handleTitleBlur = (e: any) => {
    setEditTitle(false)
    const { value } = e.target
    if (value === title) return
    dispatch(saveDocData({
      title: value,
    }))
    dispatch(updateDocData({
      title: value,
    }))
  }

  const handleDelete = () => {
    const modal = confirm({
      title: '确认删除？',
      icon: <ExclamationCircleOutlined />,
      content: '回收站功能暂未开放，删除后将无法找回！',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        return new Promise((resolve) => {
          $http.deletearticle({ id }).then((res: any) => {
            if (res.errNo === 0) {
              message.success('删除成功, 将在1s后返回文章列表', 1)
              setTimeout(() => {
                history.push('/articlelist')
              }, 1000)
              resolve(true)
            } else {
              message.error('删除失败')
              modal.destroy()
            }
          }).catch(() => {
            message.error('删除失败')
            modal.destroy()
          })
        })
      },
      onCancel() { },
    })
  }
  const handlePublish = () => {
    const modal = confirm({
      title: '确认发布？',
      icon: <ExclamationCircleOutlined />,
      content: '发布后就可以在博客前台看到啦~',
      okText: '确认',
      okType: 'primary',
      cancelText: '取消',
      onOk() {
        return new Promise((resolve) => {
          const value = published === 0 ? 1 : 0
          $http.publisharticle({ id, published: value}).then((res: any) => {
            if (res.errNo === 0) {
              if (editWatchMode === EditWatchMode.edit) {
                message.success('发布成功，将在1s后跳回预览状态', 1)
                setTimeout(() => {
                  dispatch(updateEditorState({
                    editWatchMode: EditWatchMode.preview,
                  }))
                }, 1000)
              }
              dispatch(updateDocData({
                published: value,
              }))
              message.success('发布成功')
              resolve(true)
            } else {
              message.error('发布失败')
              modal.destroy()
            }
          }).catch(() => {
            message.error('发布失败')
            modal.destroy()
          })
        })
      },
      onCancel() { },
    })
  }

  const handleExit = () => {
    history.push('/articlelist')
  }
  const moreOperate = () => (
    <Menu className={styles.operateMenu}>
      <Menu.Item
        className={styles.operateItem}
        icon={<SendOutlined />}
        disabled={!!published || !authConfig.article?.publish?.includes(userRole)}
        onClick={handlePublish}
        key="publish"
      >
        发布
      </Menu.Item>
      <Menu.Item
        className={styles.operateItem}
        icon={<DeleteOutlined />}
        disabled={!!deleted || !authConfig.article?.delete?.includes(userRole)}
        key="delete"
        onClick={handleDelete}
      >
        删除
      </Menu.Item>
      <Menu.Item
        className={styles.operateItem}
        icon={<RollbackOutlined />}
        onClick={handleExit}
        key="exit"
      >
        退出
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item className={styles.details} key="detail">
        <p>
          字数统计：
          {transContentLength}
        </p>
        <p>
          创建于：
          {formatDate(+createTime)}
        </p>
        <p>
          最后编辑于：
          {formatDate(+updateTime)}
        </p>
        <p>
          编辑者：柠檬精
        </p>
      </Menu.Item>
    </Menu>
  )
  const handleEditModeToogle = () => {
    dispatch(updateEditorState({
      editWatchMode: EditWatchMode.edit,
    }))
  }

  return (
    <div className={cns([styles.header, 'edit-page-header', 'jusBetween-alignCenter', editWatchMode === EditWatchMode.preview ? styles.preview : styles.edit])}>
      {
        editWatchMode === EditWatchMode.edit ? (
          <div className="align-center">
            {
              isEditTitle ? (
                <Input
                  ref={inputEl}
                  className={cns([styles.titleInput, 'click-outside'])}
                  placeholder="请输入名称~"
                  value={curTitle}
                  onChange={onTextChange}
                  onBlur={handleTitleBlur}
                  onPressEnter={handleTitleBlur}
                />
              ) : (
                <>
                  <div className={styles.title}>{curTitle}</div>
                  <EditOutlined className={styles.editIcon} onClick={handleClickEditTitle} />
                </>
              )
            }
          </div>
        )
          : <div className={styles.previewTitle}>{curTitle}</div>
      }
      <div className="align-center">
        {editWatchMode === EditWatchMode.edit ? (
          <Save history={history} />
        ) : (
          <>
            <Button
              className={styles.btn}
              size="middle"
              type="primary"
              onClick={handleEditModeToogle}
              disabled={!authConfig.article?.edit?.includes(userRole) || published === 1}
            >
              编辑
            </Button>
          </>
        )}
        <Dropdown
          overlay={moreOperate}
          trigger={['click']}
        >
          <div className={cns([styles.moreOperate, 'jusCenter-alignCenter'])}>
            <MoreOutlined />
          </div>
        </Dropdown>
      </div>
    </div>
  )
}

export default withRouter(Header)
