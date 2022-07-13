import { IOStringAny} from '../../interface/index'
/* ** 数据表操作 ** */
export class DBStore {
  store: IDBObjectStore

  constructor(name: string, transaction: IDBTransaction) {
    this.store = transaction.objectStore(name)
  }

  addData({ data, success, error }: IOStringAny) {
    return new Promise((resolve, reject) => {
      const request = this.store.add(data)
      request.onsuccess = (event: Event) => {
        success?.(event)
        resolve(true)
      }
      request.onerror = (event: Event) => {
        error?.(event)
        reject()
      }
    })
  }

  putData({ data, success, error }: IOStringAny) {
    return new Promise((resolve, reject) => {
      const request = this.store.put(data)
      request.onsuccess = (event: Event) => {
        success?.(event)
        resolve(true)
      }
      request.onerror = (event: Event) => {
        error?.(event)
        reject()
      }
    })
  }

  getData({
    id, index, success, error,
  }: IOStringAny) {
    return new Promise((resolve: (res: any) => void, reject) => {
      const { store } = this
      let request: IDBRequest<any>
      if (index) {
        request = store.index(index).get(Number(id))
      } else {
        request = store.get(Number(id))
      }
      request.onsuccess = (event) => {
        success?.(event)
        const target = event.target as IDBRequest
        resolve(target.result)
      }
      request.onerror = (event: Event) => {
        error?.(event)
        reject(event)
      }
    })
  }

  deleteData({ id, success, error }: IOStringAny) {
    return new Promise((resolve, reject) => {
      const request = this.store.delete(Number(id))
      request.onsuccess = (event: Event) => {
        success?.(event)
        resolve(true)
      }
      request.onerror = (event: Event) => {
        error?.(event)
        reject()
      }
    })
  }

  getAllData({
    index, query, count, success, error,
  }: IOStringAny) {
    return new Promise((resolve, reject) => {
      const {store} = this
      let request = null
      if (index) {
        request = store.index(index).getAll(query, count)
      } else {
        request = store.getAll(query, count)
      }

      request.onsuccess = (event: Event) => {
        success?.(event)
        const target = event.target as IDBRequest
        resolve(target.result)
      }
      request.onerror = (event: Event) => {
        error?.(event)
        reject(event)
      }
    })
  }

  getAllKeys({
    index, query, count, success, error,
  }: IOStringAny) {
    return new Promise((resolve, reject) => {
      const { store } = this
      let request = null
      if (index) {
        request = store.index(index).getAllKeys(query, count)
      } else {
        request = store.getAllKeys(query, count)
      }

      request.onsuccess = (event: Event) => {
        success?.(event)
        resolve(event)
      }
      request.onerror = (event: Event) => {
        error?.(event)
        reject(event)
      }
    })
  }

  clearData({ success, error }: IOStringAny) {
    return new Promise((resolve, reject) => {
      const request = this.store.clear()
      request.onsuccess = (event: Event) => {
        success?.(event)
        resolve(true)
      }
      request.onerror = (event: Event) => {
        error?.(event)
        reject()
      }
    })
  }

  count({ key, success, error }:IOStringAny) {
    return new Promise((resolve, reject) => {
      const request = this.store.count(key)
      request.onsuccess = (event: Event) => {
        success?.(event)
        resolve(true)
      }
      request.onerror = (event: Event) => {
        error?.(event)
        reject()
      }
    })
  }
}
