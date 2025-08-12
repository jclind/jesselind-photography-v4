import React, { useState } from 'react'
import styles from './Gallery.module.scss'

export interface Photo {
  id: string
  title: string
  category?: string
  description?: string
  thumbnailUrl?: string
  thumbnailPath?: string
  fullUrl?: string
  storagePath?: string
}

export default function PhotoCard({
  photo,
  isThumbnailMode,
}: {
  photo: Photo
  isThumbnailMode: boolean
}) {
  const [fullLoaded, setFullLoaded] = useState(false)

  return (
    <div className={styles.card}>
      {/* Blurred thumbnail */}
      {/* <div className={styles.thumbnailWrapper} aria-hidden='true'>
        <img
          className={styles.thumbnail}
          src={photo.thumbnailUrl}
          alt={photo.title}
        />
      </div> */}
      {/* Full-res image */}
      {isThumbnailMode ? (
        <h1>
          {photo.storagePath &&
            photo.storagePath.replace('full/', '').replace('.webp', '')}
        </h1>
      ) : (
        ''
      )}
      <img
        className={`${styles.fullImage} ${fullLoaded ? styles.loaded : ''}`}
        src={isThumbnailMode ? photo.thumbnailUrl : photo.fullUrl}
        alt={photo.title}
        loading='lazy'
        onLoad={() => setFullLoaded(true)}
      />
    </div>
  )
}
