import { marked } from 'marked'
import hljs from 'highlight.js'


export const Marked = () => {
  const renderer = new marked.Renderer()
  marked.setOptions({
    renderer,
    gfm: true,
    pedantic: false,
    sanitize: false,
    breaks: false,
    smartLists: true,
    smartypants: false,
    highlight(code: string) {
      return hljs.highlightAuto(code).value
    },
  })

  return marked
}
