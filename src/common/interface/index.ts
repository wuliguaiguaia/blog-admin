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

