import { combineReducers } from 'redux'
import editorReducer from './editor'

export const reducer = combineReducers({
  editor: editorReducer,
})


