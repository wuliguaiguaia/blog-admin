import React, {
  useState, useEffect, createRef, FunctionComponent, useCallback,
} from 'react'
import cns from 'classnames'
import {
  Button, Input,
} from 'antd'
import {
  EditOutlined,
} from '@ant-design/icons'
import styles from './Index.scss'

interface IProps {
  dataChange: (data: any) => void
  title: string,
  updateTime: string
}

const Header:FunctionComponent<IProps> = ({dataChange, title, updateTime}) => {
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
        <Button size="middle" type="primary">发布</Button>
      </div>
    </div>
  )
}

export default Header
