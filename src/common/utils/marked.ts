import { marked } from 'marked'
import highlight from 'highlight.js'

export const renderer = new marked.Renderer()
export const Marked = () => {
  marked.setOptions({
    renderer,
    gfm: true,
    pedantic: false,
    sanitize: false,
    breaks: false,
    smartLists: true,
    smartypants: false,
    highlight(code: string) {
      return highlight.highlightAuto(code).value
    },
  })

  return marked
}

export interface IChangeText {
  (text: string):string
}
export const changeText: IChangeText = (text: string) => text
