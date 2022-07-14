import { IHelperKeysValid, IOStrbool } from '../../interface/index'
import { code2KeyMap } from '../../constants/keymap'


const sign = '<:::>'
/*
const utils = {
  groupKeys: ['alt', 'ctrl', 'shift'].sort(),
  sortKeys(keys: string[]) {
    return keys
  },
  uniqueArray(arr: string[]) {
    return [...new Set<string>(arr)]
  },
}
 */

/*
  快捷键封装
  组合键、整体/部分禁用
*/
export interface IShortcutKey {
  readonly init: () => void
  readonly enable: boolean
  destory: () => void
  setEnable: (enable: boolean) => void
  updateValidList: (map: IHelperKeysValid[]) => void
  subscribe: ({ keys, cb }: { keys: string[], cb: () => void}) => void
  unSubscribe: ({ keys, cb }: {keys: string[], cb?: () => void}) => void
}

class ShortcutKey {
  listeners: {[k: string]: any[]} = {}

  enable: boolean = false

  validList: IOStrbool = {}

  constructor() {
    this.init()
  }

  init() {
    const fn = this.onKeyDown.bind(this)
    this.listeners = {}
    window.removeEventListener('keydown', fn)
    window.addEventListener('keydown', fn)
  }


  subscribe({ keys, cb }: { keys: string[], cb: () => void}) {
    const keyStr = keys.join(sign)
    if (!this.listeners[keyStr]) {
      this.listeners[keyStr] = []
    }
    this.listeners[keyStr].push(cb)
  }

  unSubscribe({ keys, cb }: {keys: string[], cb?: () => void}) {
    const keyStr = keys.join(sign)
    const cbs = this.listeners[keyStr]
    if (!cbs) return
    if (cb) {
      const index = cbs.findIndex((item) => item === cb)
      if (index > -1) cbs.splice(index, 1)
      this.listeners[keyStr] = cbs
    } else {
      this.listeners[keyStr] = []
    }
  }

  onKeyDown(e: any) {
    if (!this.enable) return
    const keys = []
    const groupKeys: IOStrbool = {
      alt: e.altKey,
      ctrl: e.ctrlKey || e.metaKey,
      shift: e.shiftKey,
    }
    Object.keys(groupKeys).forEach((key: string) => {
      const item = groupKeys[key]
      if (item) {
        keys.push(key)
      }
    })
    const curKey = `${code2KeyMap[e.keyCode]}`
    if (curKey) keys.push(curKey.toLocaleLowerCase())
    const keyStr = keys.join(sign)
    if (!this.validList[keyStr]) return
    const cbs = this.listeners[keyStr]
    if (!cbs?.length) return
    e.preventDefault()
    cbs.forEach((cb) => {
      cb(e)
    })
  }

  destory() {
    this.removeEvents()
    this.validList = {}
    this.listeners = {}
  }

  setEnable(value: boolean) {
    this.enable = value
  }

  updateValidList(map: IHelperKeysValid[]) {
    map.forEach(({keys, enable}) => {
      const keyStr = keys.join(sign)
      this.validList[keyStr] = enable
    })
  }

  removeEvents() {
    window.removeEventListener('keydown', this.onKeyDown)
  }
}

export default ShortcutKey
