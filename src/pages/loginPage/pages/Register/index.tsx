import React from 'react'
import { IUserLogin, UserStatus } from '@/common/interface'
import MyForm from '../../components/MyForm'

const Register = () => {
  const onFinish = (values: IUserLogin) => {
    console.log(values)
  }
  return <MyForm onFinish={onFinish} userStatus={UserStatus.Register} />
}

export default Register
