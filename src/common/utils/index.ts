/* TODO：有问题 */
export const getDate = (str: string) => {
  const date = new Date(str)
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  return `${year} 年 ${month} 月 ${day} 日`
}


export const formatDate = (timstamp: number) => new Date(timstamp).toLocaleString()

/*
  节流函数：
  每隔 time 执行一次 cb
*/
export const throttle = (cb: Function, time: number) => {
  let flag = true
  let timer: NodeJS.Timeout | null = null
  return (...arg: any[]) => {
    if (!flag) return
    cb(...arg)
    flag = false
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      flag = true
    }, time)
  }
}

/*
  某年某月有多少天
*/
export const getDateCount = (year: number, month: number) => {
  const date = new Date(year, month - 1, 0)
  return date.getDate()
}


export const parseCookie = (str: string) => {
  const obj = {}
  str.replace(/([^=]+)=([^;]+);?/g, (_, key, val) => {
    obj[key] = val
  })
  return obj
}
