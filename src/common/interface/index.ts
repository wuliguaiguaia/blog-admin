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

export interface IOboolean {
  [k: string]: boolean
}
export interface IOany {
  [k: string]: any
}

export interface IONumberAny {
  [k: number]: any
}
