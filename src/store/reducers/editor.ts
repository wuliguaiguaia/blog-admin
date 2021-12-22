import $http from '@/common/api'
import { UpdateDocData, UpdateEditorState } from '../actionTypes'

export const initialState = {
  docData: {a: 1}, /* 文档数据 */
  categoryList: [], /* 所有分类 */
}
const reducer = (state = initialState, action: { type: any; data: any }) => {
  const { type, data } = action
  switch (type) {
    case UpdateEditorState:
      return { ...state, ...data }
    case UpdateDocData:
      return {
        ...state,
        ...{
          docData: {
            ...state.docData, data,
          },
        },
      }
    default:
      return { ...state }
  }
}

export const updateEditorState = (data: any) => ({
  type: UpdateEditorState,
  data,
})

export const updateDocData = (data: any) => ({
  type: UpdateDocData,
  data,
})


export const getCategoryList = () => async (dispatch) => {
  const res = await $http.getcategorylist()
  const { data: { list } } = res
  dispatch(updateEditorState({categoryList: list || []}))
}

export const getArticleData = (id: number) => async (dispatch) => {
  const res = await $http.getarticle({ id })
  const { data } = res
  dispatch(updateEditorState({docData: data}))
}

export default reducer
