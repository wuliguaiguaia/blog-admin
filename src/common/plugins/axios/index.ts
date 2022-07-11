import axios from 'axios'
import { message } from 'antd'

/*
  请求封装
*/
const myAxios = axios.create()
myAxios.defaults.timeout = 30000
myAxios.defaults.withCredentials = true
myAxios.interceptors.request.use((config) => {
  if (!config.headers) {
    config.headers = {}
  }
  /*  console.log(document.cookie)
  const cookies: IOString = parseCookie(document.cookie)
  console.log(cookies)
 */
  /* jwt 无法在有效期内使其失效 */
  // config.headers.Authorization = `Bearer ${cookies.lg_token}`
  return config
})
myAxios.interceptors.response.use((response) => response, (error) => {
  if (!error.response) {
    message.error(error.message)
  } else {
    const { data } = error.response
    if (data?.errStr) {
      message.error(data.errStr)
    } else {
      message.error(error.response.errorText)
    }
  }
  return Promise.reject(error)
})

export default myAxios
