import React from 'react'
import type { PhotoRowsType } from './Gallery'
import styles from './Gallery.module.scss'

const PhotoRows = ({ photos }: { photos: PhotoRowsType[] }) => {
  if (photos.length <= 0) return null

  return (
    <div className={styles.photos_row}>
      {photos.map(row => {
        return (
          <div className={styles.row} style={{ height: row.height }}>
            {row.rowPhotos.map(photo => (
              <img src={photo.fullUrl} />
            ))}
          </div>
        )
      })}
    </div>
  )
}

export default PhotoRows
