import React, {
  FunctionComponent,
  createRef,
  useEffect,
  useCallback,
  useState,
} from 'react'
import cns from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { renderToString} from 'react-dom/server'
import styles from './index.scss'
import { Marked, renderer } from '@/common/utils/marked'
import { picUpload, updateDocData, updateEditorState } from '@/store/reducers/editor'
import { RootState } from '@/store/reducers/interface'
import '@/assets/styles/md.scss'
import 'highlight.js/styles/github.css'
import { EditWatchMode, NavList } from '@/common/interface'
import MarkdownNav from '../MarkdownNav'
import { throttle } from '@/common/utils'

const marked = Marked()

interface IProps {
  history: any
}

const Content: FunctionComponent<IProps> = ({ history }) => {
  const transEl = createRef<HTMLDivElement>()
  const textAreaEl = createRef<HTMLTextAreaElement>()
  const leftContentEl = createRef<HTMLDivElement>()
  const [transContent, setTransContent] = useState('')
  const [divideLineLeft, setDivideLineLeft] = useState(0)
  const [activeNav, setActiveNav] = useState('')
  const [navList, setNavList] = useState<NavList[]>([])
  const {
    historyRecord,
    docData: { id, content, title },
    editStatus: { outline },
    editWatchMode,
  } = useSelector((state: RootState) => state.editor)
  const dispatch = useDispatch()
  const handlePaste = async (e: any) => {
    const file = e.clipboardData?.files?.[0]
    if (file) {
      dispatch(picUpload(file))
      e.preventDefault()
    }
  }
  const handleSelect = () => {
    const el: any = textAreaEl.current
    const { selectionStart, selectionEnd } = el
    dispatch(updateEditorState({
      cursorIndex: {
        start: selectionStart,
        end: selectionEnd,
      },
    }))
  }
  // https://zh.javascript.info/selection-range#biao-dan-kong-jian-zhong-de-xuan-ze
  const onTextChange = useCallback((e) => {
    const text = e.target.value
    dispatch(updateDocData({ content: text }))
    historyRecord.add(text)
  }, [historyRecord])


  useEffect(() => {
    const text = marked.parse(content)
    setTransContent(text)
    const list:NavList[] = []
    renderer.heading = (txt: string, level) => {
      console.log('[[[[')

      list.push({ text: txt, level })
      setNavList(list)
      const markerContents = renderToString(<div id={txt} className={cns('md-title', `md-title-${level}`)}><a href={`#${txt}`}>{txt}</a></div>)
      return markerContents
    }
  }, [content, id])

  useEffect(() => {
    if (transEl.current) {
      dispatch(updateEditorState({
        transContentLength: transEl.current.innerText.length,
      }))
    }
  }, [transContent])
  useEffect(() => {
    if (textAreaEl.current) {
      textAreaEl.current.value = content
    }
  }, [content, textAreaEl])
  useEffect(() => {
    const el = leftContentEl.current
    if (el) {
      setDivideLineLeft(el.offsetWidth)
    }
  }, [leftContentEl])

  /*
    react 监听 hash 变化，原生 hashchange 无效？
    初始 active nav 颜色有问题
    https:// www.cnblogs.com/xiaonian8/p/13764821.html
  */
  useEffect(() => {
    const hashchange = () => {
      if (!transEl?.current) return
      const hash = decodeURIComponent(window.location.hash).slice(1)
      const el = document.getElementById(hash)
      if (!el) return
      transEl.current.scrollTop = el.offsetTop
      setActiveNav(hash)
    }
    const UNLISTEN = history.listen(hashchange)
    return () => {
      UNLISTEN()
    }
  }, [history, transEl])

  /*
    每次点击目录跳转的过程中 scroll 事件触发会有抖动
  */
  useEffect(() => {
    if (!transEl.current) return
    const elArr = document.querySelectorAll('.md-title')
    const offsetArr:HTMLDivElement[] = []
    elArr.forEach((el) => {
      offsetArr.push(el.offsetTop)
    })
    const handleScroll = (e: any) => {
      if (!offsetArr.length) return
      let index = 0
      const target = e.currentTarget
      const top = target.scrollTop
      offsetArr.forEach((item, i) => {
        if (top >= item) {
          index = i
        }
      })
      setActiveNav(elArr[index].innerText)
    }
    transEl.current.addEventListener('scroll', throttle(handleScroll, 100))
  }, [transEl])


  /* 隐藏的标题点击后跳回去了 */
  const Outline = () => (
    <div className={cns([styles.outline,
      editWatchMode === EditWatchMode.preview && styles.outlineWithPadding])}
    >
      <div className={styles.outlineTitle}>大纲</div>
      <MarkdownNav
        data={navList}
        id={id}
        canClick
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        history={history}
      />
    </div>
  )

  return (
    <>
      {
        editWatchMode === EditWatchMode.edit
          ? (
            <>
              <div className={cns([styles.container, 'flex'])}>
                <div className={cns([styles.editContent, 'flex'])}>
                  <div className={styles.leftContent} ref={leftContentEl}>
                    <pre className={styles.preContent}>{content}</pre>
                    <textarea
                      ref={textAreaEl}
                      className={styles.textAreaContent}
                      onChange={onTextChange}
                      onPaste={handlePaste}
                      onSelect={handleSelect}
                    />
                  </div>
                  <div className={styles.divideLine} style={{ left: `${divideLineLeft}px`}} />
                  <div
                    ref={transEl}
                    className={styles.rightContent}
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: transContent }}
                  />
                </div>
                { outline ? <Outline /> : null}
              </div>
            </>
          )
          : (
            <div className={cns([styles.previewContainer])}>
              <h1 className={styles.bigTitle}>
                {title}
              </h1>
              <div
                className={cns([styles.previewContent])}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: transContent }}
              />
              <Outline />
            </div>
          )
      }
    </>
  )
}

export default Content
