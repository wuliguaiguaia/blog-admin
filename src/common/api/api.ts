import { apiPrefix } from '../constants/request'

export const get = {
  getcategorylist: `${apiPrefix}/category/list`,
  getarticlelist: `${apiPrefix}/article/list`,
  getarticle: `${apiPrefix}/article`,
  getcommit: `${apiPrefix}/commit`,
  search: `${apiPrefix}/article/search`,
}

export const post = {
  comment: `${apiPrefix}/comment`,
  addarticle: `${apiPrefix}/article`,
  addcategory: `${apiPrefix}/category`,
}

export const remove = {
  forcedeletearticle: `${apiPrefix}/article`,
  deletecategory: `${apiPrefix}/category`,
}

export const put = {
  publisharticle: `${apiPrefix}/article/publish`,
  deletearticle: `${apiPrefix}/article/delete`,
  updatearticle: `${apiPrefix}/article/update`,
  updatecategory: `${apiPrefix}/category`,
}

export const patch = {}

export const head = {}

export const options = {}

export const file = {
  upload: `${apiPrefix}/upload`,
}

export const ws = {}
