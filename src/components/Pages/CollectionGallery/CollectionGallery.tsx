import React from 'react'
import styles from './CollectionGallery.module.scss'

const CollectionGallery = ({ collectionID }: { collectionID: string }) => {
  return (
    <div className={styles.CollectionGallery}>
      <div className='page__inner'>
        <div className={styles.content}></div>
      </div>
    </div>
  )
}

export default CollectionGallery
