import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/reducers/interface'
import styles from './index.scss'

const Helper = () => {
  const { helperKeys } = useSelector((state: RootState) => state.editor)
  return (
    <div>
      <li>

        <div className={styles.title}>
          markdown 语法参考：
        </div>
        <p><a href="https://www.markdown.xyz/basic-syntax/">Markdown 基本语法</a></p>

        <div className={styles.title}>快捷键</div>
        <ul>
          {
            Object.keys(helperKeys).map((key) => {
              const title = helperKeys[key]
              return (
                <li className={styles.li} key={key}>
                  <span className={styles.shortkey}>{key}</span>
                  <span className={styles.shortkeyTitle}>{title}</span>
                </li>
              )
            })
          }
        </ul>
      </li>
    </div>
  )
}
export default Helper
