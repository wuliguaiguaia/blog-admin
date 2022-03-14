import { IONumberString, IUserInfo } from '../../common/interface/index'
import { UpdateCommonState } from '../actionTypes'
import $http from '@/common/api'
import { localStorage } from '@/common/utils/storage'

export interface IInitialState {
  offline: boolean
  userInfo: IUserInfo | null,
  loginStatus: number,
  userRoleList: IONumberString
}

const initialState:IInitialState = {
  offline: false,
  userInfo: null,
  loginStatus: -100,
  userRoleList: [],
}

const reducer = (state = initialState, action: { type: any; data: any }) => {
  const { type, data } = action
  switch (type) {
    case UpdateCommonState:
      return {...state, ...data }
    default:
      return state
  }
}

export const updateCommonState = (data: any) => ({
  type: UpdateCommonState,
  data,
})

export const getUserInfo = () => async (dispatch, getState) => {
  const { userInfo } = getState().common
  if (!userInfo) {
    const response = await $http.getuserinfo()
    dispatch(updateCommonState({ userInfo: response.data }))
    const isLogin = localStorage.get('islogin') === true
    if (!response.data) {
      if (isLogin) {
        dispatch(updateCommonState({ loginStatus: -1 }))
        // TODO: websocket通知失效
      } else {
        dispatch(updateCommonState({ loginStatus: 0 }))
      }
    } else {
      dispatch(updateCommonState({ loginStatus: 1 }))
    }
    return true
  }
  return true
}

export const getUserRoleList = () => async (dispatch) => {
  const response = await $http.getuserrolelist()
  const { data } = response

  dispatch(updateCommonState({
    userRoleList: Object.keys(data).reduce<IONumberString[]>((res, item) => {
      const tem = { value: +item, text: data[item] }
      res.push(tem)
      return res
    }, []),
  }))
}

export default reducer
