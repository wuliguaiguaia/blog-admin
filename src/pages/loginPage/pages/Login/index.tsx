import React, { FunctionComponent } from 'react'
import { message } from 'antd'
import { useDispatch } from 'react-redux'
import { IUserLogin, UserStatus } from '@/common/interface'
import MyForm from '../../components/MyForm'
import $http from '@/common/api'
import { localStorage } from '@/common/utils/storage'
import { updateCommonState } from '@/store/reducers/common'

interface IProps {
  history: any
}
const Login: FunctionComponent<IProps> = ({ history }) => {
  const dispatch = useDispatch()
  const onFinish = async (values: IUserLogin) => {
    const response = await $http.login(values)
    if (response.errNo !== 0) {
      message.error(response.errStr)
    } else {
      localStorage.set('islogin', true)
      dispatch(updateCommonState({
        userInfo: response.data,
      }))
      history.push('/')
    }
    /* jwt 测试：
      const token = data.data.access_token
      document.cookie = `lg_token=${token}`
    */
  }
  return <MyForm onFinish={onFinish} userStatus={UserStatus.Login} type={1} />
}


export default Login
