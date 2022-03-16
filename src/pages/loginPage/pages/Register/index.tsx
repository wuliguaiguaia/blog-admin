import React, { FunctionComponent } from 'react'
import { message } from 'antd'
import { IUserLogin, UserStatus } from '@/common/interface'
import MyForm from '../../components/MyForm'
import $http from '@/common/api'

interface IProps {
  history: any
}
const Register: FunctionComponent<IProps> = ({ history }) => {
  const onFinish = async (values: IUserLogin) => {
    const response = await $http.register(values)
    if (response.errNo !== 0) {
      message.error(response.errStr)
    } else {
      message.success('注册成功，请登录~')
      history.push('/u/login')
    }
  }
  return <MyForm onFinish={onFinish} userStatus={UserStatus.Register} />
}

export default Register
