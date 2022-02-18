import React, {
  createRef,
  FunctionComponent,
  MouseEventHandler,
  useEffect,
} from 'react'
import cns from 'classnames'
import { NavList } from '@/common/interface/index'
import styles from './index.scss'

interface IProps {
  data: NavList[],
  activeNav: string,
  setActiveNav: (nav: string) => void,
}

const MarkdownNav:FunctionComponent<IProps> = ({
  data = [], activeNav, setActiveNav,
}) => {
  const titlesRef = createRef<HTMLDivElement>()
  const levels = data.map((item) => item.level)
  const maxLevel = Math.min(...levels)
  const handleClickNav: MouseEventHandler = (e) => {
    const target = e.target as HTMLElement
    const { dataset } = target
    if (!dataset) return
    const { hash } = dataset
    if (!hash) return
    window.location.hash = hash
    setActiveNav(hash)
  }

  useEffect(() => {
    const { hash } = window.location
    if (!hash) return
    setActiveNav(decodeURIComponent(hash.slice(1)))
  }, [])
  return (
    <div ref={titlesRef} className={styles.wrapper} onClick={handleClickNav}>
      {data.length ? (
        <ul className={cns(styles.navbar)}>
          {
            data.map((item, index) => {
              const { level, text } = item
              return (
                <li
                  key={index}
                  className={cns([styles['title-wrapper'], activeNav === text && styles.active])}
                >
                  <div
                    className={cns([
                      styles[`title-${level - maxLevel + 1}`],
                      styles.title,
                      'text-ellipsis',
                    ])}
                    data-hash={text}
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
