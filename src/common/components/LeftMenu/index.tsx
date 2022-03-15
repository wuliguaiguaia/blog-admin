/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { ReactChild, useEffect, useState } from 'react'
import { Menu } from 'antd'
import {
  AppstoreOutlined,
  ReadOutlined,
  UserOutlined,
  RightOutlined,
  LeftOutlined,
  FolderOpenOutlined,
  TagsOutlined,
  CommentOutlined,
  SoundOutlined,
  AreaChartOutlined,
  EyeOutlined,
  RiseOutlined,
  WarningOutlined,
  LineChartOutlined,
} from '@ant-design/icons'
import cns from 'classnames'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import styles from './index.scss'
import { flatternObj } from '@/common/utils/flattern'
import { RootState } from '@/store/reducers/interface'

const { SubMenu } = Menu

// submenu keys of first level
interface IMenuItem {
  id: string,
  name: string,
  children?: IMenuItem[],
  href?: string,
  icon: ReactChild,
  disabled?: boolean
}

const LeftMenu = () => {
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const onOpenChange = (keys: string[]) => setOpenKeys(keys)
  const [collapsed, setCollapsed] = useState(false)
  const handleCollapsed = () => setCollapsed(!collapsed)
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const handleSelect = ({ selectedKeys: _selectedKeys }:
  { selectedKeys: string[] }) => setSelectedKeys(_selectedKeys)
  const { userRole, userRoleList, authConfig } = useSelector((state: RootState) => state.common)
  const [list, setList] = useState<IMenuItem[]>([])

  useEffect(() => {
    const data = [
      {
        id: '1',
        name: '工作台',
        children: [],
        href: '/workbench',
        icon: <AppstoreOutlined />,
      },
      {
        id: '2',
        name: '文档管理',
        icon: <FolderOpenOutlined />,
        children: [
          {
            id: '2.1',
            name: '文档列表',
            href: '/articlelist',
            icon: <ReadOutlined />,
          },
          {
            id: '2.2',
            name: '分类列表',
            href: '/categorylist',
            icon: <TagsOutlined />,
          },
        ],
      },
      {
        id: '3',
        name: '数据分析',
        icon: <AreaChartOutlined />,
        children: [
          {
            id: '3.1',
            name: '访问统计', /* 浏览数、评论数 */
            href: '/analysis/pv',
            icon: <EyeOutlined />,
          },
          {
            id: '3.2',
            name: '性能统计', /* 访问速度 性能打点 */
            href: '/analysis/performance',
            icon: <RiseOutlined />,
          },
          {
            id: '3.3',
            name: '错误统计', /* sentry 数据爬取列表，跳转到 sentry */
            href: '/analysis/error',
            icon: <WarningOutlined />,
          },
          {
            id: '3.4',
            name: '接口统计', /* 接口访问时长 */
            href: '/analysis/interface',
            icon: <LineChartOutlined />,
          },
        ],
      },
      {
        id: '4',
        name: '留言管理',
        href: '/commentlist',
        icon: <CommentOutlined />,
        disabled: !authConfig?.[userRole]?.comment,
      },
      {
        id: '5',
        name: '消息中心',
        href: '/messagecenter',
        icon: <SoundOutlined />,
        disabled: !authConfig?.[userRole]?.message,
      },
      {
        id: '6',
        name: '用户管理',
        href: '/userlist',
        icon: <UserOutlined />,
        disabled: !authConfig?.[userRole]?.user,
      },
    ]
    setList(data)
    const path = window.location.pathname
    const flatternData = flatternObj(data)
    const menuItem = flatternData.find((item: { href: string }) => item.href === path)
    const {id} = menuItem
    setSelectedKeys([id])
    const arr = id.split('.')
    if (arr.length > 1) {
      setOpenKeys([arr[0]])
    }
  }, [userRole, userRoleList, authConfig])

  return (
    <div className={cns([styles.leftMenu, 'global-left-menu'])}>
      <div
        className={cns(['jusCenter-alignCenter', styles.collapsedIcon])}
        onClick={handleCollapsed}
      >
        {
          collapsed ? <RightOutlined /> : <LeftOutlined />
        }
      </div>
      <Menu
        mode="inline"
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        onOpenChange={onOpenChange}
        onSelect={handleSelect}
        style={{ width: 256 }}
        inlineCollapsed={collapsed}
        className="menu-wrapper"
      >
        {
          list.map(({
            id, name, icon, children = [], href = '', disabled,
          }) => {
            if (children.length && !disabled) {
              return (
                <SubMenu key={id} icon={icon} title={name}>
                  {
                    children.map((item) => (
                      <Menu.Item key={item.id} icon={item.icon}>

                        <Link to={item.href}>{item.name}</Link>
                      </Menu.Item>
                    ))
                  }
                </SubMenu>
              )
            }
            if (!disabled) {
              return (
                <Menu.Item icon={icon} key={id}>
                  <Link to={href}>{name}</Link>
                </Menu.Item>
              )
            }
            return <></>
          })
        }
      </Menu>
    </div>
  )
}

export default LeftMenu
