/*
  文档历史记录
  撤销 重做
*/

export interface IHistoryRecord {
  maxCount: number
  recordTime: number
  historyArr: any[],
  add: (data: any) => void
  addFirst: (data: any) => void
  redo: (cb :(data: any)=> void) => void
  undo: (cb: (data: any) => void) => void
  destroy: () => void,
  setEnable: (val: boolean) => void,
  readonly canUndo: boolean
  readonly canRedo: boolean
  readonly length: number
}

const MAX_COUNT = 100
const RECORD_TIME = 1000

class HistoryRecord implements IHistoryRecord {
  maxCount = 0

  recordTime = 0

  historyArr: any[] = []

  lastTime = 0

  curIndex = -1

  canRecord = false

  constructor(maxCount = MAX_COUNT, recordTime = RECORD_TIME) {
    this.maxCount = maxCount
    this.recordTime = recordTime
    this.lastTime = Date.now()
    this.canRecord = true
  }

  addFirst(data: any) {
    if (!this.canRecord) return
    this.historyArr.push(data)
    this.curIndex += 1
    this.lastTime = Date.now()
  }

  add(data: any) {
    if (!this.canRecord) return
    const now = Date.now()
    const notChanged = data === this.historyArr[this.historyArr.length - 1]
    if (notChanged) return
    const timeValid = now - this.lastTime >= this.recordTime

    if (!timeValid) return
    while (this.curIndex < this.length - 1) {
      this.historyArr.pop()
    }
    this.historyArr.push(data)
    this.curIndex += 1
    this.lastTime = now
    while (this.length > this.maxCount) {
      this.historyArr.shift()
      this.curIndex -= 1
    }
  }

  redo(cb: (data:any) => void) {
    if (this.curIndex >= this.length - 1) return
    this.curIndex += 1
    const data = this.historyArr[this.curIndex]
    cb(data)
  }

  undo(cb: (data: any) => void) {
    if (this.curIndex <= 0) return
    this.curIndex -= 1
    const data = this.historyArr[this.curIndex]
    cb(data)
  }

  get length() {
    return this.historyArr.length
  }

  get canUndo() {
    return this.curIndex > 0
  }

  get canRedo() {
    return this.curIndex >= 0 && this.curIndex < this.length - 1
  }

  setEnable(val: boolean) {
    this.canRecord = val
  }

  destroy() {
    this.historyArr = []
    this.curIndex = -1
    this.canRecord = false
    this.lastTime = 0
  }
}

export default HistoryRecord
