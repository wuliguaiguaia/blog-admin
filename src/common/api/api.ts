import { apiPrefix } from '../constants/request'

export const get = {
  getcategorylist: `${apiPrefix}/category/list`,
  getarticlelist: `${apiPrefix}/article/list`,
  getarticle: `${apiPrefix}/article`,
  getcommit: `${apiPrefix}/commit`,
  search: `${apiPrefix}/article/search`,
  getcommentlist: `${apiPrefix}/comment/list/all`,
  getmessagelist: `${apiPrefix}/message/list/all`,
  getuserinfo: `${apiPrefix}/user/profile`,
  getuserlist: `${apiPrefix}/user/list`,
  getuserrolelist: `${apiPrefix}/user/rolelist`,
}

export const post = {
  addarticle: `${apiPrefix}/article`,
  addcategory: `${apiPrefix}/category`,
  adduser: `${apiPrefix}/user`,
  login: `${apiPrefix}/login`,
  register: `${apiPrefix}/register`,
  webhook: '/webhook/manual?name=blog-admin',
}

export const remove = {
  forcedeletearticle: `${apiPrefix}/article`,
  deletecategory: `${apiPrefix}/category`,
  deletecomment: `${apiPrefix}/comment`,
  deletemessage: `${apiPrefix}/message`,
  deleteuser: `${apiPrefix}/user`,
  logout: `${apiPrefix}/logout`,
}

export const put = {
  publisharticle: `${apiPrefix}/article/publish`,
  deletearticle: `${apiPrefix}/article/delete`,
  updatearticle: `${apiPrefix}/article/update`,
  updatecategory: `${apiPrefix}/category`,
  updateuser: `${apiPrefix}/user`,
  readcomment: `${apiPrefix}/comment/read`,
  readmessage: `${apiPrefix}/message/read`,
  checkcomment: `${apiPrefix}/comment/check`,
  checkmessage: `${apiPrefix}/message/check`,
}

export const patch = {}

export const head = {}

export const options = {}

export const file = {
  upload: `${apiPrefix}/upload`,
}

export const ws = {}
