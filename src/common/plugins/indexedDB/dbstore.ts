import { IOStringAny} from '../../interface/index'
/* ** 数据表操作 ** */
export class DBStore {
  db: {
    objectStoreNames: string[],
    createObjectStore: any,
    transaction: any
  }

  dbStoreNames: any

  transaction: any

  name: any

  store: any

  constructor(db: any, transaction: any, name: any) {
    this.db = db
    this.dbStoreNames = db.objectStoreNames
    this.name = name
    this.transaction = transaction // 升级使用
  }

  createStore = (options: any) => {
    if (!this.dbStoreNames.contains(this.name)) {
      this.store = this.db.createObjectStore(this.name, options)
    } else {
      this.store = this.transaction.objectStore(this.name)
    }
    return this
  }

  createIndex(indexes: any[]) {
    const names:string[] = []
    // 增加
    indexes.forEach((index) => {
      const { name, attr, options } = index
      names.push(name)
      if (!this.indexNames.contains(name)) {
        this.store.createIndex(name, attr, options)
      }
    })
    // 删除
    Array.from(this.indexNames).forEach((name) => {
      if (!names.includes(name)) {
        this.store.deleteIndex(name)
      }
    })
    return this
  }

  deleteIndex(name: any) {
    if (this.indexNames.contains(name)) {
      this.store.deleteIndex(name)
    }
    return this
  }

  readStore(method?: string | undefined) {
    // 默认 readonly
    return this.db.transaction([this.name], method).objectStore(this.name)
  }

  addData({ data, success, error }: IOStringAny) {
    return new Promise((resolve, reject) => {
      const request = this.readStore('readwrite')
        .add(data)
      request.onsuccess = (event: any) => {
        success?.(event)
        resolve(true)
      }
      request.onerror = (event: any) => {
        error?.(event)
        reject()
      }
    })
  }

  putData({ data, success, error }: IOStringAny) {
    // 默认主键存在与数据内，不提供主键
    return new Promise((resolve, reject) => {
      const request = this.readStore('readwrite')
        .put(data)
      request.onsuccess = (event:any) => {
        success?.(event)
        resolve(true)
      }
      request.onerror = (event:any) => {
        error?.(event)
        reject()
      }
    })
  }

  getData({
    id, index, success, error,
  }: IOStringAny) {
    return new Promise((resolve, reject) => {
      let store = this.readStore()
      if (index) {
        store = store.index(index)
      }
      const request = store.get(Number(id))
      request.onsuccess = (event: any) => {
        success?.(event)
        resolve(event.target.result)
      }
      request.onerror = (event: any) => {
        error?.(event)
        reject(event)
      }
    })
  }

  deleteData({ id, success, error }: IOStringAny) {
    return new Promise((resolve, reject) => {
      const request = this.readStore('readwrite')
        .delete(Number(id))
      request.onsuccess = (event:any) => {
        success?.(event)
        resolve(true)
      }
      request.onerror = (event:any) => {
        error?.(event)
        reject()
      }
    })
  }

  getAllData({
    index, key, query, count, success, error,
  }: IOStringAny) {
    return new Promise((resolve, reject) => {
      let store = this.readStore()
      let request = null
      if (index) { // 通过索引查找
        store = store.index(index)
        request = key ? store.getAll(key, count) : store.getAll(query, count)
      } else {
        request = store.getAll(query, count)
      }

      // query ?
      request.onsuccess = (event:any) => {
        success?.(event)
        resolve(event.target.result)
      }
      request.onerror = (event:any) => {
        error?.(event)
        reject(event)
      }
    })
  }

  getAllKeys({
    index, key, query, count, success, error,
  }: IOStringAny) {
    return new Promise((resolve, reject) => {
      let store = this.readStore()
      let request = null
      if (index) { // 通过索引查找
        store = store.index(index)
        request = key ? store.getAllKeys(key, count) : store.getAllKeys(query, count)
      } else {
        request = store.getAllKeys(query, count)
      }

      // query ?
      request.onsuccess = (event: any) => {
        success?.(event)
        resolve(event.target.result)
      }
      request.onerror = (event: any) => {
        error?.(event)
        reject(event)
      }
    })
  }

  clearData({ success, error }:IOStringAny) {
    return new Promise((resolve, reject) => {
      const request = this.readStore().clear()
      request.onsuccess = (event:any) => {
        success?.(event)
        resolve(true)
      }
      request.onerror = (event:any) => {
        error?.(event)
        reject()
      }
    })
  }

  count({ key, success, error }:IOStringAny) {
    return new Promise((resolve, reject) => {
      const request = this.readStore().count(key)
      request.onsuccess = (event:any) => {
        success?.(event)
        resolve(true)
      }
      request.onerror = (event:any) => {
        error?.(event)
        reject()
      }
    })
  }

  readIndex(name: string) {
    return this.store.index(name)
  }

  get indexNames() {
    return this.store.indexNames
  }

  get primaryKey() {
    return this.store.keyPath
  }

  get autoIncrement() {
    return this.store.autoIncrement
  }
}
