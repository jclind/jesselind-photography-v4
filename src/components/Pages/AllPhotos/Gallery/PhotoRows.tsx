import React from 'react'
import {
  calcAspectRatio,
  storeImageInSession,
  type PhotoRowsType,
} from './Gallery'
import styles from './Gallery.module.scss'

const PhotoRows = ({ photos }: { photos: PhotoRowsType[] }) => {
  if (photos.length <= 0) return null

  return (
    <div className={styles.photos_row}>
      {photos.map(row => {
        return (
          <div className={styles.row} style={{ height: row.height }}>
            {row.rowPhotos.map(photo => {
              const r = calcAspectRatio(photo)
              const h = row.height
              const w = h * r
              console.log('aspect ratio', r)
              console.log('height', h)
              console.log('width', w)
              // return <img src={photo.fullUrl} />
              return (
                <a
                  href={`/photos/${photo.id}`}
                  onClick={() => storeImageInSession(photo)}
                >
                  <img src={photo.fullUrl} height={h} width={w} />
                </a>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default PhotoRows
