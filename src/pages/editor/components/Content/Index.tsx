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
import MarkdownNavbar from '../MarkdownNav'

const marked = Marked()

interface IProps {}

const Content: FunctionComponent<IProps> = () => {
  const transEl = createRef<HTMLDivElement>()
  const textAreaEl = createRef<HTMLTextAreaElement>()
  const leftContentEl = createRef<HTMLDivElement>()
  const [transContent, setTransContent] = useState('')
  const [divideLineLeft, setDivideLineLeft] = useState(0)
  const {
    historyRecord,
    docData,
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
    if (textAreaEl.current) {
      textAreaEl.current.value = docData.content
    }
  }, [docData.content, textAreaEl])

  const [navList, setNavList] = useState<NavList[]>([])
  useEffect(() => {
    const text = marked.parse(docData.content)
    setTransContent(text)
    const list:NavList[] = []
    renderer.heading = (txt: string, level) => {
      list.push({ text: txt, level })
      setNavList(list)
      const markerContents = renderToString(<div className={cns('md-title', `md-title-${level}`)}><a id={`#${txt}`} href={`/editor/${docData.id}#${txt}`}>{txt}</a></div>)
      return markerContents
    }
  }, [docData.content, docData.id])

  useEffect(() => {
    if (transEl.current) {
      dispatch(updateEditorState({
        transContentLength: transEl.current.innerText.length,
      }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transContent])

  const Outline = () => (
    <div className={cns([styles.outline,
      editWatchMode === EditWatchMode.preview && styles.outlineWithPadding])}
    >
      <div className={styles.outlineTitle}>大纲</div>
      <MarkdownNavbar data={navList} canClick />
    </div>
  )

  useEffect(() => {
    const el = leftContentEl.current
    if (el) {
      setDivideLineLeft(el.offsetWidth)
    }
  }, [leftContentEl])

  return (
    <>
      {
        editWatchMode === EditWatchMode.edit
          ? (
            <>
              <div className={cns([styles.container, 'flex'])}>
                <div className={cns([styles.editContent, 'flex'])}>
                  <div className={styles.leftContent} ref={leftContentEl}>
                    <pre className={styles.preContent}>{docData.content}</pre>
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
                {docData.title}
              </h1>
              <div className={cns(['flex', styles.previewContent])}>
                <div
                  className={cns([styles.leftPreviewContent])}
                  ref={transEl}
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: transContent }}
                />
                <Outline />
              </div>
            </div>
          )
      }
    </>
  )
}

export default Content
