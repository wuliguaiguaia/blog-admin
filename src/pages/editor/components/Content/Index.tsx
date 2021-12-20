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

const marked = Marked()

interface IProps {
  picUpload: (file: any) => Promise<void>
  dataChange: (data: any) => void
  data: IArticle
}
const Content:FunctionComponent<IProps> = ({picUpload, data, dataChange}) => {
  const textAreaEl = createRef<HTMLTextAreaElement>()
  const handlePaste = async (e: any) => {
    const file = e.clipboardData?.files?.[0]
    if (file) {
      picUpload(file)
    }
    e.preventDefault()
  }

  const onTextChange = useCallback((e) => {
    dataChange({content: e.target.value})
  }, [dataChange])

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
