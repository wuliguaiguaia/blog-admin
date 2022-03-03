export interface ICategory {
  id?: number;
  name: string;
  articlesLen?: number;
}


export enum LoginType {
  login = 'login',
  register = 'register',
  password_reset = 'password_reset',
}

export interface IOStringAny {
  [k: string]: any
}

export interface IArticle extends IOStringAny{
  id: number;
  title: string;
  content: string;
  keywords?: string;
  createTime: string;
  updateTime: string;
  viewCount: number;
  categories: number[];
  published: number;
  deleted: number;
}

export enum EditWatchMode {
  preview = 0,
  edit = 1,
}

export const IEditWatchMode = {
  [EditWatchMode.preview]: 'preview',
  [EditWatchMode.edit]: 'edit',
}

export enum SaveStatus {
  loading = 0,
  end = 1,
}

export interface NavList {
  level: number;
  text: string;
  children?: NavList[]
}


export interface IHelperKeysValid {
  keys: string[];
  enable: boolean;
}
export interface IHelperKeys extends IHelperKeysValid {
  cb: string;
  title: string;
}

export interface IOStrbool {
  [k: string]: boolean
}
export interface IOany {
  [k: string]: any
}

export interface IONumberAny {
  [k: number]: any
}
export interface IOString {
  [k: string]: string
}


export enum EditType {
  add = 0,
  update = 1,
}


export interface Response {
  data: any
  errNo: number
}


export interface IUser {
  username: string,
  website: string,
  email: string,
}
export interface IMessage extends IUser{
  id?: number
  content: string
  createTime?: string;
}

export interface IComment extends IMessage{
  id?: number,
  articleId?: number
  replyId?: number
  replyToReplyId?: number
  replyInfo?: IComment[]
}


export enum UserStatus {
  Login = 0,
  Logout = -1,
  Register = 1,
  ForgetPassword = 2,
}

export interface IUserLogin {
  username: string;
  password: string
}
