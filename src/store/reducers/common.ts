import { IOStringAny } from '@/common/interface'
import { IONumberString, IRole, IUserInfo } from '../../common/interface/index'
import { UpdateCommonState } from '../actionTypes'
import $http from '@/common/api'
import { localStorage } from '@/common/utils/storage'

export interface IInitialState {
  offline: boolean
  userInfo: IUserInfo | null
  userRole: number
  loginStatus: number
  userRoleList: IRole[],
  authConfig: IOStringAny
}

const initialState:IInitialState = {
  offline: false,
  userInfo: null,
  userRole: 0,
  loginStatus: -100,
  userRoleList: [],
  authConfig: {},
}

const reducer = (state = initialState, action: { type: any; data: any }) => {
  const { type, data } = action
  switch (type) {
    case UpdateCommonState:
      if (data.userInfo) {
        data.userRole = data.userInfo.role
      }
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
        return -1
        // TODO: websocket通知失效
      }
      dispatch(updateCommonState({ loginStatus: 0 }))
      return 0
    }
    dispatch(updateCommonState({ loginStatus: 1 }))
    return 1
  }
  return 1
}

export const getUserRoleList = () => async (dispatch) => {
  const response = await $http.getuserrolelist()
  const {
    data: { authConfig, roleList },
  } = response

  dispatch(updateCommonState({
    userRoleList: Object.keys(roleList).reduce<IONumberString[]>((res, item) => {
      const tem = { value: +item, text: roleList[item] }
      res.push(tem)
      return res
    }, []),
  }))
  dispatch(updateCommonState({authConfig}))
}

export default reducer
