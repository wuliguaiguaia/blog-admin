import React, {
  createRef,
  FunctionComponent,
  useEffect,
} from 'react'
import cns from 'classnames'
import { useDispatch } from 'react-redux'
import { NavList } from '@/common/interface/index'
import styles from './index.scss'
import { updateEditorState } from '@/store/reducers/editor'

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
  const dispatch = useDispatch()
  const handleClickNav = (text: string) => {
    setActiveNav(text)
    history.push(`/editor/${id}#${text}`)
    dispatch(updateEditorState({isClickNav: true}))
  }

  useEffect(() => {
    const { hash } = window.location
    setActiveNav(decodeURIComponent(hash.slice(1)))
  }, [])
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
                  className={cns([styles['title-wrapper'], activeNav === text && styles.active])}
                  onClick={handleClickNav.bind(undefined, text)}
                >
                  <div className={cns([
                    styles[`title-${level - maxLevel + 1}`],
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
