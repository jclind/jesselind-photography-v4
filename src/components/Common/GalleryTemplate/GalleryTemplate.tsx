import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from './GalleryTemplate.module.scss'
import { LayoutGrid, PanelsTopLeft } from 'lucide-react'
import type { Photo } from './PhotoThumbnail'
import PhotoThumbnail from './PhotoThumbnail'
import PhotoRows from './PhotoRows'

type GalleryProps = {
  fetchPhotos: (
    lastDoc?: any
  ) => Promise<{ photos: Photo[]; lastDoc: any | null }>
  pageSize?: number
}

export const storeImageInSession = (photo: Photo) => {
  sessionStorage.setItem('selectedPhoto', JSON.stringify(photo))
}

export const calcAspectRatio = (photo: Photo): number => {
  return photo.width / photo.height
}

const GalleryTemplate = ({ fetchPhotos, pageSize = 10 }: GalleryProps) => {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [lastDoc, setLastDoc] = useState<any | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [isThumbnailMode, setIsThumbnailMode] = useState(false)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const { photos: newPhotos, lastDoc: newLastDoc } = await fetchPhotos(
        lastDoc
      )
      setPhotos(prev => [...prev, ...newPhotos])
      setLastDoc(newLastDoc)
      if (!newLastDoc) setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [fetchPhotos, lastDoc, loading, hasMore])

  useEffect(() => {
    loadMore()
  }, [])

  // infinite scroll
  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 1000 &&
        !loading &&
        hasMore
      ) {
        loadMore()
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [loadMore, loading, hasMore])

  const handleModeToggle = () => {
    window.scrollTo(0, 0)
    setIsThumbnailMode(prev => !prev)
  }

  return (
    <div
      className={`${styles.Gallery} ${
        isThumbnailMode ? styles.thumbnail_mode : styles.full_img_mode
      }`}
    >
      <button className={styles.toggle_mode_btn} onClick={handleModeToggle}>
        {isThumbnailMode ? <LayoutGrid /> : <PanelsTopLeft />}
      </button>
      <div className={styles.content}>
        <div className={styles.grid}>
          {isThumbnailMode ? (
            photos.map((photo: Photo) => (
              <PhotoThumbnail
                key={photo.id}
                photo={photo}
                isThumbnailMode={isThumbnailMode}
              />
            ))
          ) : (
            <PhotoRows photos={photos} />
          )}
        </div>
      </div>
    </div>
  )
}

export default GalleryTemplate
