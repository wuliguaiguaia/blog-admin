import { apiPrefix } from '../constants/request'

export const get = {
  getcategorylist: `${apiPrefix}/category/list`,
  getarticlelist: `${apiPrefix}/article/list`,
  getarticle: `${apiPrefix}/article`,
  getcommit: `${apiPrefix}/commit`,
  search: `${apiPrefix}/article/search`,
  getcommentlist: `${apiPrefix}/comment/list/all`,
  getmessagelist: `${apiPrefix}/message/list/all`,
}

export const post = {
  addarticle: `${apiPrefix}/article`,
  addcategory: `${apiPrefix}/category`,
}

export const remove = {
  forcedeletearticle: `${apiPrefix}/article`,
  deletecategory: `${apiPrefix}/category`,
  deletecomment: `${apiPrefix}/comment`,
  deletemessage: `${apiPrefix}/message`,
}

export const put = {
  publisharticle: `${apiPrefix}/article/publish`,
  deletearticle: `${apiPrefix}/article/delete`,
  updatearticle: `${apiPrefix}/article/update`,
  updatecategory: `${apiPrefix}/category`,
  readcomment: `${apiPrefix}/comment/read`,
  readmessage: `${apiPrefix}/message/read`,
}

export const patch = {}

export const head = {}

export const options = {}

export const file = {
  upload: `${apiPrefix}/upload`,
}

export const ws = {}
