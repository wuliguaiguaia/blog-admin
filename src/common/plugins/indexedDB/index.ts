/**
 * 文档内容离线存储
 */

import { DB } from './db'
import { DBStore } from './dbstore'
import { IOStringAny } from '@/common/interface'
import { DBConfig, DocCacheConfig } from './constants'

const DBUtil = new DB()
let store:any = null
const openDB = () => DBUtil.open(DBConfig.name, DBConfig.version, {
  upgrade(db: any, oldVersion: any, newVersion: any, transaction: any) {
    // 新建表与索引
    store = new DBStore(db, transaction, DocCacheConfig.name)
      .createStore(DocCacheConfig.options)
      .createIndex(DocCacheConfig.indexes)
  },
  success(db:any) {
    store = new DBStore(db, null, DocCacheConfig.name)
    console.log('打开数据库')
  },
  error() {
    console.log('打开数据库报错')
  },
  blocked() {
    console.log('上次的数据库未关闭')
  },
})

export const setLocalData = (data: { id: number }) => openDB().then(() => store.addData({
  data: { ...data, updatedAt: Date.now() },
  success() {
    console.log('数据写入成功')
  },
  error() {
    console.log('数据写入失败')
  },
}))

export const putLocalData = (data: any) => openDB().then(() => store.putData({
  data: { ...data, updatedAt: Date.now() },
  success() {
    console.log('数据更新成功')
  },
  error() {
    console.log('数据更新失败')
  },
}))

export const getLocalData = ({ id, index, key }:
IOStringAny) => openDB().then(() => store.getData({
  id,
  index,
  key,
  success() {
    console.log('数据读取成功')
  },
  error() {
    console.log('数据读取失败')
  },
}))

export const getAllLocalData = ({
  index, query, count, key,
}: IOStringAny) => openDB().then(() => store.getAllData({
  index,
  query,
  count,
  key,
  success() {
    console.log('数据读取成功')
  },
  error() {
    console.log('数据读取失败')
  },
}))

export const getAllLocalDataKeys = ({
  index, query, count, key,
}:IOStringAny) => openDB().then(() => store.getAllKeys({
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
}))

export const deleteLocalData = ({ id }: any) => openDB().then(() => store.deleteData({
  id,
  success() {
    console.log('数据删除成功')
  },
  error() {
    console.log('数据删除失败')
  },
}))
