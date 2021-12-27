import { UpdateCommonState } from '../actionTypes'

export interface IInitialState {
  offline: boolean
}

const initialState:IInitialState = {
  offline: false,
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


export default reducer
