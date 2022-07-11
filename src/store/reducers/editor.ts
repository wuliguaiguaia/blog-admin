import { AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { message } from 'antd'
import $http from '@/common/api'
import { RootState } from '@/store/reducers/interface'
import ShortcutKey, { IShortcutKey } from '@/common/plugins/shortcutKey'
import HistoryRecord, { IHistoryRecord } from '@/common/plugins/historyRecord'
import {
  IArticle, ICategory, EditWatchMode, EditType, SaveStatus,
} from '@/common/interface'
import {
  UpdateDocData, UpdateEditorState, UpdateEditingStatus, UpdateEditingHelperKeys,
} from '../actionTypes'
import { openDB, putLocalData } from '@/common/plugins/indexedDB'

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
  shortcutKey: IShortcutKey
  getDataLoading: boolean
  helperKeys: any
  backupData: string
  editType: EditType,
  saveStatus: SaveStatus,
  editorScrollTop: number,
  isClickNav: boolean,
  editStatus: {
    outline: boolean,
    preview: boolean
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
    desc: '',
    published: 0,
  }, /* 文档数据 */
  editType: EditType.add,
  categoryList: [], /* 所有分类 */
  getDataLoading: true,
  helperKeys: {},
  backupData: '',
  editWatchMode: EditWatchMode.preview, /* 查看模式: 编辑 or 预览 */
  cursorIndex: {
    start: 0,
    end: 0,
  }, /* 光标位置 */
  transContentLength: 0, /* 内容长度 */
  editorScrollTop: 0,
  isClickNav: false,
  historyRecord: new HistoryRecord(),
  saveStatus: SaveStatus.end, /* 保存状态 */
  shortcutKey: new ShortcutKey(),
  editStatus: {
    outline: true,
    preview: false,
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
          ...state.docData, ...data,
        },
      }
    case UpdateEditingStatus:
      return {
        ...state,
        editStatus: {
          ...state.editStatus, ...data,
        },
      }
    case UpdateEditingHelperKeys:
      return {
        ...state,
        helperKeys: {
          ...state.helperKeys, ...data,
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

export const updateEditingHelperKeys = (data: any) => ({
  type: UpdateEditingHelperKeys,
  data,
})


export const getCategoryList = ():
ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch, getState) => {
  const { categoryList } = getState().editor
  if (categoryList.length !== 0) return
  const res = await $http.getcategorylist()
  const { data: { list } } = res
  dispatch(updateEditorState({categoryList: list || []}))
}

export const getArticleData = (id: number):
ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch, getState) => {
  dispatch(updateEditorState({ getDataLoading: true }))
  const { historyRecord } = getState().editor
  const res = await $http.getarticle({ id })
  const { data } = res
  data.categories = data.categories?.map((item: ICategory) => item.id) || []
  dispatch(updateEditorState({
    docData: data,
    getDataLoading: false,
    backupData: data.content,
  }))
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
  if (file.type.includes('image/')) {
    const editorState = getState().editor
    const { docData: { content }, cursorIndex } = editorState
    const left = content.substr(0, cursorIndex.start)
    const right = content.substr(cursorIndex.end)
    dispatch(updateDocData({ content: `${left}<img src="${filePath}" alt="" class="md-img"/>${right}`}))
  }
}

export const saveDocData = (data: any, cb?: (response?: any) => void):
ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch, getState) => {
  dispatch(updateEditorState({
    saveStatus: SaveStatus.loading,
  }))
  const { docData } = getState().editor
  const { id } = docData

  let idata: { updateTime?: number } = {}

  try {
    const response = await $http.updatearticle({ id, ...data })
    const { errNo, errStr } = response
    idata = response.data
    if (errNo !== 0) {
      message.error(errStr)
    } else {
      if ('content' in data) { // 只有当保存内容时
        dispatch(updateEditorState({
          backupData: data.content,
        }))
      }
      dispatch(updateEditorState({
        saveStatus: SaveStatus.end,
      }))
      dispatch(updateDocData({
        updateTime: idata.updateTime,
      }))
      if (cb) cb(idata)
    }
  } catch (err) {
    message.warning('保存失败，正在暂存到本地...')
    const setLocal = () => {
      // 本地保存完整数据
      ['title', 'desc', 'categories', 'content'].forEach((key) => {
        data[key] = docData[key]
      })
      openDB().then(() => {
        putLocalData({ id, ...data }).then(() => {
          dispatch(updateEditorState({
            backupData: data.content,
            saveStatus: SaveStatus.end,
          }))
          if (cb) cb()
        }).catch(() => {
          message.error('本地保存依旧失败，打点已上传')
        })
      })
    }
    setLocal()
  }
}

export default reducer
