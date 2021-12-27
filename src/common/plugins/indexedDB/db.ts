/**
 * indexDB 持久与大容量存储
 * https://wangdoc.com/javascript/bom/indexeddb.html
 *
 * 同源限制
 * 数据库升级的时候不允许读写数据, 升级是一个事务
 * 新增与删除表与索引必须在升级版本时进行
 *
 */

import { IOStringAny } from '@/common/interface'

/*
 * 问题：
 * 1、连续读写会多次打开数据库
 * 2、DB 类似 util， DBStore 才是类
 */

export class DB {
  open = (name: string, version: number, {
    upgrade, success, error, blocked,
  }: IOStringAny) => new Promise((resolve, reject) => {
    const request = window.indexedDB.open(name, version)
    request.onupgradeneeded = (event) => {
      const { newVersion, oldVersion, target } = event
      const { result, transaction } = target as any
      upgrade?.(result, oldVersion, newVersion, transaction)
      resolve(true)
      console.log('onupgradeneeded')
    }

    request.onsuccess = (event) => {
      const { target } = event
      const { result } = target as any
      success?.(result)
      resolve(true)
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

  remove = (name: string, { success, error }: IOStringAny) => new Promise((resolve, reject) => {
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
}

