import React, { useEffect, useState } from 'react'

import styles from './GalleryTemplate.module.scss'
import { calcAspectRatio, storeImageInSession } from './GalleryTemplate'
import type { Photo } from './PhotoThumbnail'

export type PhotoRowsType = {
  rowPhotos: Photo[]
  height: number
}

const PhotoRows = ({ photos }: { photos: Photo[] }) => {
  const [formattedPhotos, setFormattedPhotos] = useState<PhotoRowsType[]>([])

  useEffect(() => {
    // Function to calculate the optimal height and number of photos to place in gallery row
    const calculatePhotosRows = (originalPhotos: Photo[]) => {
      console.log('originalPhotos', originalPhotos)
      const MAX_ROW_HEIGHT = 700
      const PREFERRED_ROW_HEIGHT = 600

      const photoRows: { rowPhotos: Photo[]; height: number }[] = []
      let currRowIndex = 0
      originalPhotos.map((photo, index, origArr) => {
        const currR = calcAspectRatio(photo)
        const pageW = window.innerWidth
        let rowHeight = 0

        if (currRowIndex >= photoRows.length) {
          rowHeight = pageW / currR
          photoRows.push({
            rowPhotos: [photo],
            height:
              rowHeight > MAX_ROW_HEIGHT ? PREFERRED_ROW_HEIGHT : rowHeight,
          })
        } else {
          const newRowPhotos = [...photoRows[currRowIndex].rowPhotos, photo]
          const currRowRatioSum = newRowPhotos.reduce(
            (sum, rowPhoto) => sum + calcAspectRatio(rowPhoto),
            0
          )
          rowHeight = pageW / currRowRatioSum

          photoRows[currRowIndex] = {
            rowPhotos: newRowPhotos,
            height: rowHeight,
          }
        }

        if (rowHeight <= MAX_ROW_HEIGHT) {
          currRowIndex++
        }
      })

      return photoRows
    }

    const newPhotos = photos.length > 0 ? calculatePhotosRows(photos) : []
    console.log(newPhotos)
    setFormattedPhotos(newPhotos)
  }, [photos])
  if (formattedPhotos.length <= 0) return null

  return (
    <div className={styles.photos_row}>
      {formattedPhotos.map(row => {
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
                  data-astro-prefetch='hover'
                  onMouseEnter={() => {
                    if (photo.fullUrl) {
                      const img = new Image()
                      img.src = photo.fullUrl
                    }
                  }}
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
