import { IDBCacheConfig } from '@/common/interface'

export const DBConfig = {
  name: 'orangeblog',
  version: 1, // 默认为1，修改表和索引需要手动修改
}

export const DBCacheConfig: IDBCacheConfig[] = [
  { // 表名
    name: 'ArticleCache',
    options: {
      keyPath: 'id',
    },
    // 索引
    indexes: [
      {
        name: 'byArticleId',
        attr: 'id',
        options: {
          unique: true,
        },
      },
      {
        name: 'byUpdatedAt',
        attr: 'updateTime',
        options: {
          unique: false,
        },
      },
    ],
    // 每次数据库升级时，超时的15天的删除
    overtime: 1296000,
  },
]
