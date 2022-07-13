/**
 * indexDB 持久与大容量存储
 * https://wangdoc.com/javascript/bom/indexeddb.html
 */

import { IDBCacheConfig, IDBIndexConfig, IOStringAny } from '@/common/interface'

export const DBUtil = {
  open(name: string, version: number, {
    upgrade, success, error, blocked,
  }: IOStringAny) {
    return new Promise((resolve: (value: IDBDatabase) => void, reject) => {
      const request = window.indexedDB.open(name, version)
      request.onupgradeneeded = () => {
        upgrade?.(request)
        console.log('onupgradeneeded')
      }

      request.onsuccess = () => {
        success?.(request)
        resolve(request.result)
        console.log('success')
      }

      request.onerror = (event) => {
        error?.(event)
        reject()
      }

      request.onblocked = (event) => {
        blocked?.(event)
        reject()
      }
    })
  },

  remove(name: string, { success, error }: IOStringAny) {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.deleteDatabase(name)
      request.onsuccess = (event) => {
        success?.(event)
        resolve(true)
      }

      request.onerror = (event) => {
        error?.(event)
        reject()
      }
    })
  },

  upgradeDB(request: IDBOpenDBRequest, config: IDBCacheConfig[]) {
    const { transaction, result } = request
    if (transaction) this.updateStore(result, transaction, config)
  },

  updateStore(db: IDBDatabase, transaction: IDBTransaction, config: IDBCacheConfig[]) {
    const curNames: string[] = []
    const { objectStoreNames } = db

    // 增加
    config.forEach((item: IDBCacheConfig) => {
      const { name, options } = item
      curNames.push(name)
      let store = null
      if (!objectStoreNames.contains(name)) {
        store = this.createStore(db, name, options)
      }
      store = transaction.objectStore(name)
      this.updateIndex(store, item.indexes)
    })

    // 删除
    Array.from(objectStoreNames).forEach((name: string) => {
      if (!curNames.includes(name)) {
        this.deleteStore(db, name)
      }
    })
  },

  createStore(db: IDBDatabase, name: string, options: IDBObjectStoreParameters) {
    return db.createObjectStore(name, options)
  },

  deleteStore(db: IDBDatabase, name: string) {
    return db.deleteObjectStore(name)
  },

  updateIndex(store: IDBObjectStore, indexes: IDBIndexConfig[]) {
    const names: string[] = []
    const { indexNames } = store

    // 增加
    indexes.forEach((config: IDBIndexConfig) => {
      const { name, attr, options } = config
      names.push(name)
      if (!indexNames.contains(name)) {
        this.createIndex(store, { name, attr, options })
      }
    })
    // 删除
    Array.from(indexNames).forEach((name: string) => {
      if (!names.includes(name)) {
        this.deleteIndex(store, name)
      }
    })
  },
  createIndex(store: IDBObjectStore, { name, attr, options }: IDBIndexConfig) {
    store.createIndex(name, attr, options)
  },

  deleteIndex(store: IDBObjectStore, name: string) {
    store.deleteIndex(name)
  },

  createTransaction(db: IDBDatabase, storeNames: string[],
    method?: IDBTransactionMode | undefined) {
    // 默认 readonly
    return db.transaction(storeNames, method)
  },
}

