import React from 'react'
import cns from 'classnames'
import { Button, Dropdown, Menu } from 'antd'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  DownOutlined, LogoutOutlined,
} from '@ant-design/icons'
import styles from './index.scss'
import { RootState } from '@/store/reducers/interface'
import { localStorage } from '@/common/utils/storage'
import $http from '@/common/api'

const Header = () => {
  const { userInfo } = useSelector((state: RootState) => state.common)
  const handleLogout = async () => {
    await $http.logout()
    console.log(1232131)
    localStorage.set('islogin', false)
    window.location.reload()
  }
  return (
    <div className={cns([styles.header, 'jus-between'])}>
      <div />
      {
        userInfo ? (
          <div className="jusBetween-alignCenter">
            <span className={styles.username}>
              Hi，
              {userInfo.username}
            </span>
            <Dropdown
              overlay={(
                <Menu className={styles.operateMenu}>
                  <Menu.Item
                    className={styles.operateItem}
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                    key="logout"
                  >
                    退出登录
                  </Menu.Item>
                </Menu>
              )}
              trigger={['click']}
            >
              <div className={cns([styles.moreOperate, 'jusCenter-alignCenter'])}>
                <DownOutlined />
              </div>
            </Dropdown>
          </div>
        )
          : (
            <div>
              <Button className={styles.btn}><Link to="/u/login">登录</Link></Button>
              <Button className={styles.btn} type="primary"><Link to="/u/register">快速注册</Link></Button>
            </div>
          )
      }

    </div>
  )
}

export default Header
