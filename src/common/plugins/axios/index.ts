import axios from 'axios'
import { IOString } from '@/common/interface'
import { parseCookie } from '@/common/utils'

/*
  请求封装
*/
axios.interceptors.request.use((config) => {
  if (!config.headers) {
    config.headers = {}
  }
  console.log(document.cookie)
  const cookies: IOString = parseCookie(document.cookie)
  console.log(cookies)
  /* jwt 无法在有效期内使其失效 */
  config.headers.Authorization = `Bearer ${cookies.lg_token}`
  return config
})
axios.interceptors.response.use((response) => response)


export default axios
