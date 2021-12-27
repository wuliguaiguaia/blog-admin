// import { apiPrefix } from '../constants/request'

export const get = {
  getcategorylist: 'http://127.0.0.1:3009/category/list',
  getarticlelist: 'http://127.0.0.1:3009/article/list',
  getarticle: 'http://127.0.0.1:3009/article',
  getcommit: 'http://localhost:3009/commit',
  search: 'http://localhost:3009/article/search',
}

export const post = {
  comment: 'comment',
  addarticle: 'http://localhost:3009/article',
}

export const remove = {
  forcedeletearticle: 'http://localhost:3009/article',
}

export const put = {
  publisharticle: 'http://localhost:3009/article/publish',
  deletearticle: 'http://localhost:3009/article/delete',
  updatearticle: 'http://localhost:3009/article/update',
}

export const patch = {}

export const head = {}

export const options = {}

export const file = {
  upload: 'http://localhost:3009/upload',
}

export const ws = {}
