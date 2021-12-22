import { ThunkAction } from 'redux-thunk'
import { AnyAction } from 'redux'
import { RootState } from '@/store/reducers/interface'
import HistoryRecord, { IHistoryRecord } from '@/common/plugins/historyRecord'
import { IArticle, ICategory, EditWatchMode } from '@/common/interface'
import $http from '@/common/api'
import { UpdateDocData, UpdateEditorState, UpdateEditingStatus } from '../actionTypes'
import testImage from '@/assets/imgs/image.png'

export interface IInitialState {
  docData: IArticle
  categoryList: ICategory[]
  editWatchMode: EditWatchMode,
  cursorIndex: {
    start: number,
    end: number
  }
  transContentLength: number
  historyRecord: IHistoryRecord
  editStatus: {
    preview: boolean
    outline: boolean
    configModalVisible: boolean
  }
}

export const initialState: IInitialState = {
  docData: {
    id: 0,
    viewCount: 0,
    title: '',
    content: '',
    createTime: '',
    updateTime: '',
    categories: [],
    deleted: 0,
    published: 0,
  }, /* 文档数据 */
  categoryList: [], /* 所有分类 */
  editWatchMode: EditWatchMode.preview, /* 查看模式: 编辑 or 预览 */
  cursorIndex: {
    start: 0,
    end: 0,
  }, /* 光标位置 */
  transContentLength: 0, /* 内容长度 */
  historyRecord: new HistoryRecord(),
  editStatus: {
    preview: true,
    outline: false,
    configModalVisible: false,
  },
}

const reducer = (state = initialState, action: { type: any; data: any }) => {
  const { type, data } = action
  switch (type) {
    case UpdateEditorState:
      return { ...state, ...data }
    case UpdateDocData:
      return {
        ...state,
        docData: {
          ...state.docData, data,
        },
      }
    case UpdateEditingStatus:
      return {
        ...state,
        editStatus: {
          ...state.editStatus, data,
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

export const updateEditingStatus = (data: any) => ({
  type: UpdateEditingStatus,
  data,
})


export const getCategoryList = ():
ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
  const res = await $http.getcategorylist()
  const { data: { list } } = res
  dispatch(updateEditorState({categoryList: list || []}))
}

export const getArticleData = (id: number):
ThunkAction<void, RootState, unknown, AnyAction > => async (dispatch, getState) => {
  const { historyRecord } = getState().editor
  const res = await $http.getarticle({ id })
  const { data } = res
  dispatch(updateEditorState({ docData: data }))
  historyRecord.addFirst(data.content)
}

export const picUpload = (file: any):
ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch, getState) => {
  const form = new FormData()
  form.append('file', file)
  const response = await $http.upload(form, {
    headers: {
      'content-type': 'multipart/form-data',
    },
  })
  const { data: { filePath } } = response
  console.log(filePath)
  if (file.type.includes('image/')) {
    const editorState = getState().editor
    const { docData: { content }, cursorIndex } = editorState
    const left = content.substr(0, cursorIndex.start)
    const right = content.substr(cursorIndex.end)
    dispatch(updateDocData({ content: `${left}<img src=${testImage} alt="" class="md-img"/>${right}`}))
  }
}

export const saveDocData = ({ key, value } : {key: string, value: any}):
ThunkAction<void, RootState, unknown, AnyAction> => async (/* dispatch, getState */) => {
  switch (key) {
    case 'title':
    case 'config':
      console.log(value)

      break
    default:
  }
}

export default reducer
