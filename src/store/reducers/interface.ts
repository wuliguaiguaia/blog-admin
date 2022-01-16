import { IInitialState as IEditorState } from './editor'
import { IInitialState as ICommonState } from './common'

export interface RootState {
  editor: IEditorState
  common: ICommonState
}
