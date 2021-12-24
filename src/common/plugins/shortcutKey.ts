import { IOboolean } from '../interface/index'
import { code2KeyMap } from '../constants/keymap'


/*
  快捷键封装
  1 编辑页
*/

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

export interface IShortcutKey {
  readonly init: () => void
  readonly bindEvents: () => void
  destory: () => void
  subscribe: ({ keys, cb }: { keys: string[], cb: () => void}) => void
  unSubscribe: ({ keys, cb }: {keys: string[], cb?: () => void}) => void
}

class ShortcutKey {
  listeners: {[k: string]: any[]} = {}

  constructor() {
    console.log(1)
    this.init()
  }

  init() {
    this.listeners = {}
    this.bindEvents()
  }

  bindEvents() {
    window.addEventListener('keydown', this.onKeyDown.bind(this))
    // window.addEventListener('keyup', this.onKeyUp)
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


  onKeyDown(e) {
    console.log(e, this.listeners)

    const keys = []
    const groupKeys: IOboolean = {
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
    const cbs = this.listeners[keyStr]
    console.log(keyStr, cbs)
    if (!cbs?.length) return
    e.preventDefault()
    cbs.forEach((cb) => {
      cb(e)
    })
  }

  onKeyUp(e: any) {
    console.log(e)
  }

  destory() {
    this.removeEvents()
  }

  removeEvents() {
    window.removeEventListener('keydown', this.onKeyDown)
    // window.removeEventListener('keyup', this.onKeyUp)
  }
}

export default ShortcutKey
