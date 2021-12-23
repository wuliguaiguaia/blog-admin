import React, {
  useState, useEffect, createRef, FunctionComponent, useCallback,
} from 'react'
import cns from 'classnames'
import {
  Button, Dropdown, Input, Menu, message, Modal,
} from 'antd'
import {
  DeleteOutlined,
  EditOutlined, ExclamationCircleOutlined, MoreOutlined, SendOutlined,
} from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import styles from './Index.scss'
import { saveDocData, updateDocData, updateEditorState } from '@/store/reducers/editor'
import { RootState } from '@/store/reducers/interface'
import $http from '@/common/api'
import { EditWatchMode } from '@/common/interface'

const { confirm } = Modal

interface IProps {
  history: any
}

const Header: FunctionComponent<IProps> = ({ history}) => {
  const [isEditTitle, setEditTitle] = useState(false)
  const inputEl = createRef<Input>()
  const {
    transContentLength,
    docData: {
      createTime, updateTime, title, deleted, published, id,
    },
    editWatchMode,
  } = useSelector((state: RootState) => state.editor)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isEditTitle) {
      inputEl.current?.focus()
    } else {
      inputEl.current?.blur()
    }
  }, [inputEl, isEditTitle])


  const handleClickEditTitle = () => setEditTitle(true)
  const onTextChange = useCallback((e) => {
    dispatch(updateDocData({
      title: e.target.value,
    }))
  }, [dispatch])
  const handleTitleBlur = (e: any) => {
    setEditTitle(false)
    dispatch(saveDocData({
      title: e.target.value,
    }))
  }
  const handleSave = () => {

  }
  const handleEditModeToogle = () => {
    dispatch(updateEditorState({
      editWatchMode: editWatchMode === EditWatchMode.edit
        ? EditWatchMode.preview : EditWatchMode.edit,
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
          $http.publisharticle({ id }).then((res: any) => {
            if (res.errNo === 0) {
              if (editWatchMode === EditWatchMode.edit) {
                message.success('发布成功，将在1s后跳回预览状态', 1)
                setTimeout(() => {
                  dispatch(updateEditorState({
                    editWatchMode: EditWatchMode.preview,
                  }))
                }, 1000)
              }
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
  const moreOperate = () => (
    <Menu className={styles.operateMenu}>
      <Menu.Item
        className={styles.operateItem}
        icon={<DeleteOutlined />}
        disabled={!!deleted}
        key="delete"
        onClick={handleDelete}
      >
        删除
      </Menu.Item>
      <Menu.Item
        className={styles.operateItem}
        icon={<SendOutlined />}
        disabled={!!published}
        onClick={handlePublish}
        key="publish"
      >
        发布
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item className={styles.details} key="detail">
        <p>
          字数统计：
          {transContentLength}
        </p>
        <p>
          创建于：
          {new Date(createTime).toLocaleDateString()}
        </p>
        <p>
          最后编辑于：
          {new Date(updateTime).toLocaleDateString()}
        </p>
        <p>
          编辑者：柠檬精
        </p>
      </Menu.Item>
    </Menu>
  )
  return (
    <div className={cns([styles.header, 'jusBetween-alignCenter', editWatchMode === EditWatchMode.preview ? styles.preview : styles.edit])}>
      {editWatchMode === EditWatchMode.edit ? (
        <div className="align-center">
          {
            isEditTitle ? (
              <Input
                ref={inputEl}
                className={cns([styles.titleInput, 'click-outside'])}
                placeholder="请输入名称~"
                value={title}
                onChange={onTextChange}
                onBlur={handleTitleBlur}
              />
            ) : (
              <>
                <div className={styles.title}>{title}</div>
                <EditOutlined className={styles.editIcon} onClick={handleClickEditTitle} />
              </>
            )
          }
        </div>
      ) : <div />}
      <div className="align-center">
        {editWatchMode === EditWatchMode.edit ? (
          <>
            <p className={styles.updateTime}>
              最后更新于
              {updateTime.replace(/T/, ' ').slice(0, -5)}
            </p>
            <Button className={styles.btn} size="middle" type="primary" onClick={handleSave}>保存</Button>
            <Button className={styles.btn} size="middle" type="default" onClick={handleEditModeToogle}>退出</Button>
          </>
        ) : (
          <>
            <Button className={styles.btn} size="middle" type="primary" onClick={handleEditModeToogle}>编辑</Button>
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
