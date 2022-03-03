import React, { FunctionComponent } from 'react'
import {
  Form, Input, Button,
} from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import cns from 'classnames'
import styles from './index.scss'
import { IUserLogin, UserStatus } from '@/common/interface'

interface IProps {
  onFinish: (valus:IUserLogin) => void;
  userInfo?:IUserLogin;
  userStatus: UserStatus
}

const MyForm:FunctionComponent<IProps> = ({onFinish, userInfo, userStatus}) => {
  const onSubmit = (values: IUserLogin) => {
    console.log('Received values of form: ', values)
    onFinish(values)
  }
  return (
    <Form
      name="normal_login"
      className={styles.loginForm}
      initialValues={userInfo}
      onFinish={onSubmit}
    >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: '请输入用户名！',
          },
        ]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: '请输入密码!',
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="密码"
        />
      </Form.Item>
      <Form.Item>
        <div className={cns(['jusBetween-alignCenter', 'bottom'])}>
          <Button type="primary" htmlType="submit" className={styles.submitBtn}>{userStatus === UserStatus.Login ? '登录' : '注册'}</Button>
          <div className={styles.bottomAction}>
            {
              userStatus === UserStatus.Login ? (
                <>
                  <a href="/u/register">注册</a>
                  {' '}
                  <div className={styles.divide} />
                  {' '}
                  <a href="/u/password_reset">忘记密码</a>
                </>
              )
                : <a href="/u/login">登录</a>
            }
          </div>
        </div>

      </Form.Item>
    </Form>
  )
}

MyForm.defaultProps = {
  userInfo: {
    username: '',
    password: '',
  },
}

export default MyForm
