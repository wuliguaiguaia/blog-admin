import React, {
  useState, useEffect, createRef, FunctionComponent, useCallback,
} from 'react'
import cns from 'classnames'
import {
  Button, Dropdown, Input, Menu,
} from 'antd'
import {
  DeleteOutlined,
  EditOutlined, MoreOutlined, SendOutlined,
} from '@ant-design/icons'
import styles from './Index.scss'
import { IArticle } from '@/common/interface'

interface IProps {
  dataChange: (data: any) => void
  data: IArticle,
  transContentLength: number
}

const Header: FunctionComponent<IProps> = ({
  dataChange, data: {
    title, updateTime, createTime, published, deleted,
  },
  transContentLength,
}) => {
  const [isEditTitle, setEditTitle] = useState(false)
  const inputEl = createRef<Input>()
  const handleClickEditTitle = () => setEditTitle(true)
  const handleTitleBlur = () => setEditTitle(false)
  const onTextChange = useCallback((e) => {
    dataChange({title: e.target.value})
  }, [dataChange])

  useEffect(() => {
    if (isEditTitle) {
      inputEl.current?.focus()
    } else {
      inputEl.current?.blur()
    }
  }, [inputEl, isEditTitle])

  const moreOperate = () => (
    <Menu className={styles.operateMenu}>
      <div className={styles.operates}>
        <Menu.Item className={styles.operateItem} icon={<DeleteOutlined />} disabled={!!deleted}>
          删除
        </Menu.Item>
        <Menu.Item className={styles.operateItem} icon={<SendOutlined />} disabled={!!published}>
          发布
        </Menu.Item>
      </div>
      <div className={styles.menuDivider} />
      <div className={styles.details}>
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
          {new Date(updateTime).toLocaleDateString() }
        </p>
        <p>
          编辑者：柠檬精
        </p>
      </div>
    </Menu>
  )
  return (
    <div className={cns([styles.header, 'jusBetween-alignCenter'])}>
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
      <div className="align-center">
        <p className={styles.updateTime}>
          最后更新于
          {updateTime.replace(/T/, ' ').slice(0, -5)}
        </p>
        <Button className={styles.saveBtn} size="middle" type="primary">保存</Button>
        <Dropdown overlay={moreOperate} trigger={['click']}>
          <div className={cns([styles.moreOperate, 'jusCenter-alignCenter'])}>
            <MoreOutlined />
          </div>
        </Dropdown>
      </div>
    </div>
  )
}

export default Header
