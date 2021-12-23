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
import styles from './Index.scss'
import { Marked, renderer } from '@/common/utils/marked'
import { picUpload, updateDocData, updateEditorState } from '@/store/reducers/editor'
import { RootState } from '@/store/reducers/interface'
import '@/assets/styles/md.scss'
import 'highlight.js/styles/github.css'
import { EditWatchMode, NavList } from '@/common/interface'
import MarkdownNavbar from '../MarkdownNav/Index'

const marked = Marked()

interface IProps {}

const Content: FunctionComponent<IProps> = () => {
  const transEl = createRef<HTMLDivElement>()
  const textAreaEl = createRef<HTMLTextAreaElement>()
  const [transContent, setTransContent] = useState('')
  const {
    historyRecord,
    docData,
    editStatus: { preview },
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
  }, [dispatch, historyRecord])

  useEffect(() => {
    if (textAreaEl.current) {
      textAreaEl.current.value = docData.content
    }
  }, [docData.content, textAreaEl])

  const [navList, setNavList] = useState<NavList[]>([])
  useEffect(() => {
    const text = marked.parse(docData.content)
    const list:NavList[] = []
    renderer.heading = (txt: string, level) => {
      list.push({ text: txt, level })
      setNavList(list)
      const markerContents = renderToString(<div className={cns('md-title', `md-title-${level}`)}><a id={`#${txt}`} href={`/editor/${docData.id}#${txt}`}>{txt}</a></div>)
      return markerContents
    }

    if (transEl.current) {
      dispatch(updateEditorState({
        transContentLength: transEl.current.innerText.length,
      }))
    }
    setTransContent(text)
    /* Maximum update depth exceeded.
    This can happen when a component calls setState inside useEffect,
    but useEffect either doesn't have a dependency array,
    or one of the dependencies changes on every render. */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, docData.content])

  const Outline = () => (
    <div className={styles.outline}>
      <div className={styles.outlineTitle}>大纲</div>
      <MarkdownNavbar data={navList} canClick />
    </div>
  )

  return (
    <>
      {
        editWatchMode === EditWatchMode.edit
          ? (
            <>
              <div className={cns([styles.container, 'flex'])}>
                {
                  !preview ? (
                    <div className={styles.leftContent}>
                      <pre className={styles.preContent}>{docData.content}</pre>
                      <textarea
                        ref={textAreaEl}
                        className={styles.textAreaContent}
                        onChange={onTextChange}
                        onPaste={handlePaste}
                        onSelect={handleSelect}
                      />
                    </div>
                  ) : null
                }
                <>
                  <div className={styles.containerLine} />
                  <div
                    ref={transEl}
                    className={styles.rightContent}
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: transContent }}
                  />
                </>
                { preview ? <Outline /> : null}
              </div>
            </>
          )
          : (
            <div className={cns([styles.previewContainer, 'flex'])}>
              <div className={styles.leftPreviewContent}>
                <h1 className={styles.bigTitle}>
                  {docData.title}
                </h1>
                <div
                  ref={transEl}
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: transContent }}
                />
              </div>
              <Outline />
            </div>
          )
      }
    </>
  )
}

export default Content
