import React from 'react'
import styles from './Index.scss'

const Help = () => (
  <div>
    <li>
      <div className={styles.title}>快捷键说明</div>
      <ul>
        <li className={styles.li}>撤销：ctrl + Z</li>
        <li className={styles.li}>重做：ctrl + Y</li>
      </ul>
    </li>
  </div>
)
export default Help
