import React, { useState } from 'react'
import styles from './GalleryTemplate.module.scss'
import type { Timestamp } from 'firebase/firestore'
import { usePhotoStore } from '../../../store/photoStore'
import { storeImageInSession } from './GalleryTemplate'

export interface Photo {
  id: string
  title: string
  category?: string
  description?: string
  thumbnailUrl?: string
  thumbnailPath?: string
  fullUrl?: string
  photoDate: Timestamp
  storagePath?: string
  location?: string
  height: number
  width: number
  sequenceNumber: number
}

export default function PhotoThumbnail({
  photo,
  isThumbnailMode,
}: {
  photo: Photo
  isThumbnailMode: boolean
}) {
  const [fullLoaded, setFullLoaded] = useState(false)

  const setSelectedPhoto = usePhotoStore(state => state.setSelectedPhoto)

  return (
    <a
      href={`/photos/${photo.id}`}
      className={styles.card}
      onClick={() => storeImageInSession(photo)}
      data-astro-prefetch='hover'
      onMouseEnter={() => {
        if (photo.fullUrl) {
          const img = new Image()
          img.src = photo.fullUrl
        }
      }}
    >
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
        height={photo.height}
        width={photo.width}
      />
    </a>
  )
}
