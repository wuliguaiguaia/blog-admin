import React, {
  createRef,
  FunctionComponent,
} from 'react'
import cns from 'classnames'
import { NavList } from '@/common/interface/index'
import styles from './index.scss'

interface IProps {
  data: NavList[],
  activeNav: string,
  setActiveNav: (nav: string) => void,
  id: number
  history: any
}

const MarkdownNav:FunctionComponent<IProps> = ({
  data = [], activeNav, setActiveNav, id, history,
}) => {
  const titlesRef = createRef<HTMLDivElement>()
  const levels = data.map((item) => item.level)
  const maxLevel = Math.min(...levels)
  const handleClickNav = (text: string) => {
    setActiveNav(text)
    history.push(`/editor/${id}#${text}`)
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
                  <div className={cns([
                    styles[`title-${level - maxLevel + 1}`],
                    activeNav === text && styles.active,
                    styles.title,
                    'text-ellipsis',
                  ])}
                  >
                    {text}

                  </div>
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

export default MarkdownNav
