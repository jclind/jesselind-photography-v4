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

export default function PhotoCard({ photo }: { photo: Photo }) {
  const [fullLoaded, setFullLoaded] = useState(false)

  return (
    <div className={styles.card}>
      {/* Blurred thumbnail */}
      <div className={styles.thumbnailWrapper} aria-hidden='true'>
        <img
          className={styles.thumbnail}
          src={photo.thumbnailUrl || photo.thumbnailPath}
          alt={photo.title}
        />
      </div>
      {/* Full-res image */}
      <img
        className={`${styles.fullImage} ${fullLoaded ? styles.loaded : ''}`}
        src={photo.fullUrl || photo.storagePath}
        alt={photo.title}
        loading='lazy'
        onLoad={() => setFullLoaded(true)}
      />
    </div>
  )
}
