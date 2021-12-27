/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react'
import { Menu } from 'antd'
import {
  AppstoreOutlined,
  ReadOutlined,
  AreaChartOutlined,
  EyeOutlined,
  RiseOutlined,
  WarningOutlined,
  LineChartOutlined,
  UserOutlined,
  RightOutlined,
  LeftOutlined,
} from '@ant-design/icons'
import cns from 'classnames'
import { Link } from 'react-router-dom'
import styles from './index.scss'

const { SubMenu } = Menu

// submenu keys of first level
const rootSubmenuKeys = ['sub1', 'sub2', 'sub4', 'sub5']

const data = [
  {
    id: 1,
    name: '工作台',
    children: [],
    href: '/workbench',
    icon: <AppstoreOutlined />,
  },
  {
    id: 2,
    name: '文档管理', /* 增加、分类、未发布、日期 */
    href: '/articlelist',
    icon: <ReadOutlined />,
  },
  {
    id: 3,
    name: '数据分析',
    icon: <AreaChartOutlined />,
    children: [
      {
        id: 3.1,
        name: '访问统计', /* 浏览数、评论数 */
        href: '/analysis/pv',
        icon: <EyeOutlined />,
      },
      {
        id: 3.2,
        name: '性能统计', /* 访问速度 性能打点 */
        href: '/analysis/performance',
        icon: <RiseOutlined />,
      },
      {
        id: 3.3,
        name: '错误统计', /* sentry 数据爬取列表，跳转到 sentry */
        href: '/analysis/error',
        icon: <WarningOutlined />,
      },
      {
        id: 3.4,
        name: '接口统计', /* 接口访问时长 */
        href: '/analysis/interface',
        icon: <LineChartOutlined />,
      },
    ],
  },
  {
    id: 4,
    name: '用户管理',
    href: '/userlist',
    icon: <UserOutlined />,
  },
]

const LeftMenu = () => {
  const [openKeys, setOpenKeys] = React.useState(rootSubmenuKeys)
  const onOpenChange = (keys: string[]) => {
    setOpenKeys(keys)
  }
  const [collapsed, setCollapsed] = useState(false)
  const handleCollapsed = () => setCollapsed(!collapsed)
  return (
    <div className={styles.leftMenu}>
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
        className={styles.antMenu}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        style={{ width: 256 }}
        inlineCollapsed={collapsed}
      >
        {
          data.map(({
            id, name, icon, children = [], href = '',
          }) => {
            if (children.length) {
              return (
                <SubMenu key={id} icon={icon} title={name} className={styles.antMenuSub}>
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
            return (
              <Menu.Item icon={icon} key={id}>
                <Link to={href}>{name}</Link>
              </Menu.Item>
            )
          })
        }
      </Menu>
    </div>
  )
}

export default LeftMenu
