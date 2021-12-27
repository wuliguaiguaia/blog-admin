import { combineReducers } from 'redux'
import editorReducer from './editor'
import commonReducer from './common'

export const reducer = combineReducers({
  editor: editorReducer,
  common: commonReducer,
})


