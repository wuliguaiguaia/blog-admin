import React, {
  FunctionComponent,
  createRef,
  useEffect,
  useCallback,
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
  setCursorIndex: (data: any) => void
  historyRecord: IHistoryRecord
}
const Content: FunctionComponent<IProps> = ({
  picUpload, data, dataChange, setCursorIndex, historyRecord,
}) => {
  const textAreaEl = createRef<HTMLTextAreaElement>()

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
      <div className={styles.containerLine} />
      <div
        className={styles.rightContent}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: marked.parse(data.content) }}
      />
    </div>
  )
}

export default Content
