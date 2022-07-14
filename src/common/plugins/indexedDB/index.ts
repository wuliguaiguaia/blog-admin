/**
 * 文档内容离线存储
 */

import { DBUtil } from './db'
import { DBStore } from './dbstore'
import { IOStringAny } from '@/common/interface'
import { DBConfig, DBCacheConfig } from './constants'

export const openDB = () => DBUtil.open(
  DBConfig.name,
  DBConfig.version,
  {
    upgrade(request: IDBOpenDBRequest) {
      DBUtil.upgradeDB(request, DBCacheConfig)
    },
    success() {
      console.log('打开数据库')
    },
    error() {
      console.log('打开数据库报错')
    },
    blocked() {
      console.log('上次的数据库未关闭')
    },
  },
)

export const setLocalData = (store: DBStore, data: any) => store.addData({
  data: { ...data, updatedAt: Date.now() },
  success() {
    console.log('数据写入成功')
  },
  error() {
    console.log('数据写入失败')
  },
})

export const putLocalData = (store: DBStore, data: any) => store.putData({
  data: { ...data, updatedAt: Date.now() },
  success() {
    console.log('数据更新成功')
  },
  error() {
    console.log('数据更新失败')
  },
})

export const getLocalData = (store: DBStore, { id, index }:IOStringAny) => store.getData({
  id,
  index,
  success() {
    console.log('数据读取成功')
  },
  error() {
    console.log('数据读取失败')
  },
})

export const getAllLocalData = (store: DBStore, {
  index, query, count,
}: IOStringAny) => store.getAllData({
  index,
  query,
  count,
  success() {
    console.log('数据读取成功')
  },
  error() {
    console.log('数据读取失败')
  },
})

export const getAllLocalDataKeys = (store: DBStore, {
  index, query, count, key,
}:IOStringAny) => store.getAllKeys({
  index,
  query,
  count,
  key,
  success() {
    console.log('主键读取成功')
  },
  error() {
    console.log('主键读取失败')
  },
})

export const deleteLocalData = (store: DBStore, { id }: any) => store.deleteData({
  id,
  success() {
    console.log('数据删除成功')
  },
  error() {
    console.log('数据删除失败')
  },
})
