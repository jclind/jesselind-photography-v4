import React from 'react'
import styles from './PageNotFound.module.scss'
import { ButtonLink } from '../../Common/ButtonLink'

const PageNotFound = () => {
  return (
    <div className={styles.page_not_found}>
      <div className={styles.content}>
        <h1>Page Not Found</h1>
        <a href='../'>Go Back</a>
      </div>
    </div>
  )
}

export default PageNotFound
