import React, {
  FunctionComponent,
  createRef,
  useEffect,
  useCallback,
  useState,
} from 'react'
import cns from 'classnames'
import styles from './Index.scss'
import { Marked } from '@/common/utils/marked'
import { IArticle } from '@/common/interface'
import { IHistoryRecord } from '@/common/plugins/historyRecord'

const marked = Marked()


interface IProps {
  picUpload: (file: any) => Promise<void>
  dataChange: (data: any) => void
  data: IArticle,
  preview: boolean,
  setCursorIndex: (data: any) => void
  historyRecord: IHistoryRecord,
  getTransContentLength: (num: number) => void
}

const Content: FunctionComponent<IProps> = ({
  picUpload, data, dataChange, setCursorIndex, historyRecord, getTransContentLength,
  preview,
}) => {
  const textAreaEl = createRef<HTMLTextAreaElement>()
  const [transContent, setTransContent] = useState('')
  const transEl = createRef<HTMLDivElement>()

  // https://zh.javascript.info/selection-range#biao-dan-kong-jian-zhong-de-xuan-ze
  const handlePaste = async (e: any) => {
    const file = e.clipboardData?.files?.[0]
    if (file) {
      picUpload(file)
      e.preventDefault()
    }
  }

  const handleSelect = () => {
    const { selectionStart, selectionEnd } = textAreaEl.current
    setCursorIndex({ start: selectionStart, end: selectionEnd })
  }

  const onTextChange = useCallback((e) => {
    const text = e.target.value
    dataChange({ content: text})
    historyRecord.add(text)
  }, [dataChange, historyRecord])

  useEffect(() => {
    if (textAreaEl.current) {
      textAreaEl.current.value = data.content
    }
  }, [data, textAreaEl])

  useEffect(() => {
    const text = marked.parse(data.content)
    if (transEl.current) {
      getTransContentLength(transEl.current.innerText.length)
    }
    setTransContent(text)
  }, [data.content, getTransContentLength, transEl])

  return (
    <div className={cns([styles.container, 'flex'])}>
      <div className={styles.leftContent}>
        <pre className={styles.preContent}>{data.content}</pre>
        <textarea
          ref={textAreaEl}
          className={styles.textAreaContent}
          onChange={onTextChange}
          onPaste={handlePaste}
          onSelect={handleSelect}
        />
      </div>
      {
        preview ? (
          <>
            <div className={styles.containerLine} />
            <div
              ref={transEl}
              className={styles.rightContent}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: transContent}}
            />
          </>
        ) : null
      }

    </div>
  )
}

export default Content
