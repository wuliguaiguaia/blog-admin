import React, {
  FunctionComponent,
  createRef,
  useEffect,
  useCallback,
  useState,
  useMemo,
} from 'react'
import cns from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { renderToString} from 'react-dom/server'
import styles from './index.scss'
import { changeText, Marked, renderer } from '@/common/utils/marked'
import { picUpload, updateDocData, updateEditorState } from '@/store/reducers/editor'
import { RootState } from '@/store/reducers/interface'
import '@/assets/styles/md.scss'
import 'highlight.js/styles/github.css'
import { EditWatchMode, NavList } from '@/common/interface'
import MarkdownNav from '../MarkdownNav'

const marked = Marked()

interface IProps {
}

let timer: NodeJS.Timeout | null = null
const Content: FunctionComponent<IProps> = () => {
  const transEl = createRef<HTMLDivElement>()
  const scrollEl = createRef<HTMLDivElement>()
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


  const list: NavList[] = []
  renderer.heading = (txt: string, level: number) => {
    list.push({ text: txt, level })
    setTimeout(() => {
      setNavList(list)
    })
    const markerContents = renderToString(<div id={txt} className={cns('_artilce-title', 'md-title', `md-title-${level}`)}><a href={`#${txt}`}>{txt}</a></div>)
    return markerContents
  }

  const transFn = () => {
    /* md转化，生成导航 */
    let text = marked.parse(content)
    text = changeText(text)
    setTransContent(text)
    if (!text) {
      setNavList([])
    }
  }
  useEffect(() => {
    transFn()
  }, [id])

  useEffect(() => {
    if (editWatchMode === EditWatchMode.preview) {
      return
    }
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      transFn()
    }, 2000)
  }, [content])

  useEffect(() => {
    if (transEl.current) {
      dispatch(updateEditorState({
        transContentLength: transEl.current.innerText.length,
      }))
    }
  }, [transContent])

  useEffect(() => {
    const el = leftContentEl.current
    if (el) {
      setDivideLineLeft(el.offsetWidth)
    }
  }, [leftContentEl])

  /* 初次监听 */
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true)
  useEffect(() => {
    if (!isFirstRender) return
    if (!scrollEl?.current) return
    const hash = decodeURIComponent(window.location.hash).slice(1)
    if (!hash) return
    const target = document.getElementById(hash)
    if (!target) return
    scrollEl.current.scrollTop = target.offsetTop
    setActiveNav(hash)
    setIsFirstRender(false)
  }, [isFirstRender, scrollEl])

  /* 滚动监听 */
  /*
    每次点击目录跳转的过程中 scroll 事件触发会有抖动
    因为 scrollTop 的修改触发了 scroll 事件
    需要使用 wheel 和 touch 事件进行代替！！！！
  */
  useEffect(() => {
    if (!scrollEl.current) return
    const titles = scrollEl.current.getElementsByClassName('_artilce-title') as HTMLCollectionOf<HTMLElement>
    if (titles.length === 0) return
    const offsetArr: number[] = []
    console.log(offsetArr)
    Array.from(titles).forEach((el) => {
      offsetArr.push(el.offsetTop)
    })
    const handleScroll = (e: any) => {
      let curIndex = 0
      const target = e.currentTarget
      const top: number = target.scrollTop
      offsetArr.forEach((item, index) => {
        if (top >= item) {
          curIndex = index
        }
      })
      if (titles[curIndex]) {
        setActiveNav(titles[curIndex].innerText)
      }
    }
    scrollEl.current.addEventListener('wheel', handleScroll, { passive: true })
    // eslint-disable-next-line consistent-return
    return () => {
      if (scrollEl.current) {
        scrollEl.current.removeEventListener('wheel', handleScroll)
      }
    }
  }, [scrollEl])


  /* useMemo 后隐藏的标题点击后不会再跳回去
    不用的话每次都重新渲染一个新的组件，所以会跳回去
  */
  const Outline = useMemo(() => (
    <div className={cns([styles.outline,
      editWatchMode === EditWatchMode.preview && styles.outlineInPreview])}
    >
      <MarkdownNav
        data={navList}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />
    </div>
  ), [editWatchMode, activeNav, navList])

  return (
    <>
      {
        editWatchMode === EditWatchMode.edit
          ? (
            <div className={cns([styles.container, 'flex'])} ref={scrollEl}>
              <div className={cns([styles.editContent, 'flex', outline ? styles.hasOutline : ''])}>
                <div className={styles.leftContent} ref={leftContentEl}>
                  <pre className={styles.preContent}>{content}</pre>
                  <textarea
                    ref={textAreaEl}
                    value={content}
                    className={styles.textAreaContent}
                    onChange={onTextChange}
                    onPaste={handlePaste}
                    onSelect={handleSelect}
                  />
                </div>
                <div className={styles.divideLine} style={{ left: `${divideLineLeft}px` }} />
                <div
                  ref={transEl}
                  className={cns([styles.rightContent, 'md-wrapper'])}
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: transContent }}
                />
              </div>
              {outline ? Outline : null}
            </div>
          )
          : (
            <div className={cns([styles.previewContainer])} ref={scrollEl}>
              <div>
                <h1 className={styles.bigTitle}>
                  {title}
                </h1>
                <div
                  ref={transEl}
                  className={cns(['md-wrapper'])}
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: transContent }}
                />
              </div>
              {Outline}
              {/* 不使用 useMemo， 这样用 <Outline/ > 会跳 ;
                  直接进行函数调用 Outline() 就不会跳了
                  或者直接用 useMemo 返回一个缓存过的组件就不会跳了
              */}
            </div>
          )
      }
    </>
  )
}

export default Content
