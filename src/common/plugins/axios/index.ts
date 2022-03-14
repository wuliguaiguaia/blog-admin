import axios from 'axios'
import { message } from 'antd'
import { IOString } from '@/common/interface'
import { parseCookie } from '@/common/utils'

/*
  请求封装
*/
axios.defaults.withCredentials = true
axios.interceptors.request.use((config) => {
  if (!config.headers) {
    config.headers = {}
  }
  console.log(document.cookie)
  const cookies: IOString = parseCookie(document.cookie)
  console.log(cookies)
  /* jwt 无法在有效期内使其失效 */
  // config.headers.Authorization = `Bearer ${cookies.lg_token}`
  return config
})
axios.interceptors.response.use((response) => response, (error) => {
  const { data } = error.response
  if (data?.errStr) {
    message.error(data.errStr)
  } else {
    message.error(error.response.errorText)
  }
  return Promise.reject(error)
})


export default axios
