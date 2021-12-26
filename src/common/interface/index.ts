export interface ICategory {
  id: number;
  name: string;
  articlesLen?: number;
}

export interface IArticle {
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

export interface NavList {
  level: number;
  text: string;
  children?: NavList[]
}


export interface IHelperKeysValid{
  keys: string[];
  enable: boolean
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

export interface IOStringAny {
  [k: string]: any
}
