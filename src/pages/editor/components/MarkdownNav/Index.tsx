import React, {
  createRef,
  FunctionComponent,
} from 'react'
import cns from 'classnames'
import { withRouter } from 'react-router-dom'
import { NavList } from '@/common/interface/index'
import styles from './Index.scss'

interface IProps {
  data: NavList[],
  history: any,
  match: any,
}
const MarkdownNavbar: FunctionComponent<IProps> = ({
  history, match, data = [],
}) => {
  const {id} = match.params
  const titlesRef = createRef<HTMLDivElement>()
  const levels = data.map((item) => item.level)
  const maxLevel = Math.min(...levels)
  const handleClickNav = (text: string) => {
    history.push(`/editor/${id}#${encodeURIComponent(text)}`)
  }
  return (
    <div ref={titlesRef} className={styles.wrapper}>
      {data.length ? (
        <ul className={cns(styles.navbar)}>
          {
            data.map((item, index) => {
              const { level, text } = item
              return (
                <li
                  key={index}
                  className={styles['title-wrapper']}
                  onClick={handleClickNav.bind(undefined, text)}
                >
                  <div className={cns(styles[`title-${level - maxLevel + 1}`], styles.title, 'text-ellipsis')}>{text}</div>
                </li>
              )
            })
          }
        </ul>
      )
        : <div className={styles.empty}>标题将在这里展示</div>}
    </div>
  )
}

export default withRouter(MarkdownNavbar)
