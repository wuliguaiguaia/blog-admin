export const DBConfig = {
  name: 'orangeblog',
  version: 1, // 默认为1，修改表和索引需要手动修改
}

export const DocCacheConfig = {
  // 表名
  name: 'ArticleCache',
  options: {
    /* 不写 keypath，自动生成的主键不在数据体里
     * 写了后数据体传了就以此为准，相同的话就会报错,没传的话如果有自增属性就会自增
     * 没有自增就会报错
     */
    keyPath: 'id',
    autoIncrement: true,
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
}
