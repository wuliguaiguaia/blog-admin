import React from 'react'
import { IUserLogin, UserStatus } from '@/common/interface'
import MyForm from '../../components/MyForm'
import $http from '@/common/api'

const Login = () => {
  const onFinish = async (values: IUserLogin) => {
    console.log(values)
    const data = await $http.login(values)
    console.log(data)
    const token = data.data.access_token
    document.cookie = `lg_token=${token}`
    console.log(token)
  }
  return <MyForm onFinish={onFinish} userStatus={UserStatus.Login} />
}


export default Login
