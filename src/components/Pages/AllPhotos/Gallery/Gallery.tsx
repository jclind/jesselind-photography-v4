import React, { useState, useEffect, useRef, useCallback } from 'react'
import styles from './Gallery.module.scss'
import { db } from '../../../../lib/firebase'
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  type DocumentData,
  QueryDocumentSnapshot,
  Query,
} from 'firebase/firestore'
import PhotoCard, { type Photo } from './PhotoCard'
import { LayoutGrid, LayoutList, PanelsTopLeft } from 'lucide-react'
import PhotoRows from './PhotoRows'

export type PhotoRowsType = {
  rowPhotos: Photo[]
  height: number
}

const PAGE_SIZE = 10

const Gallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [formattedPhotos, setFormattedPhotos] = useState<PhotoRowsType[]>([])

  const [loading, setLoading] = useState(false)
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const [isThumbnailMode, setIsThumbnailMode] = useState(false)

  // Ref for the scroll listener to debounce it
  const scrollListener = useRef<any>(null)

  // Fetch photos page by page
  const fetchPhotos = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)

    try {
      const photosRef = collection(db, 'photos')

      let q: Query<DocumentData>

      if (lastDoc) {
        q = query(
          photosRef,
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(PAGE_SIZE)
        )
      } else {
        q = query(photosRef, orderBy('createdAt', 'desc'), limit(PAGE_SIZE))
      }

      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        setHasMore(false)
        setLoading(false)
        return
      }

      const newPhotos: Photo[] = snapshot.docs.map(doc => {
        const data = doc.data() as Photo
        return data
      })
      setPhotos(prev => [...prev, ...newPhotos])
      setLastDoc(snapshot.docs[snapshot.docs.length - 1])
      setLoading(false)
      console.log('fetching more photos AFTER 3', newPhotos)
    } catch (err) {
      console.error('Error fetching photos:', err)
      setLoading(false)
    }
  }, [lastDoc, loading, hasMore])

  // Scroll event handler for infinite scroll
  useEffect(() => {
    const onScroll = () => {
      // console.log('innerHeight', window.innerHeight)
      // console.log('offsetHeight', window.scrollY)
      // console.log('scrollHeight', document.documentElement.scrollHeight)
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 100 && // give a bit more buffer
        !loading &&
        hasMore
      ) {
        fetchPhotos()
      }
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [fetchPhotos, loading, hasMore])

  const calcAspectRatio = (photo: Photo): number => {
    return photo.width / photo.height
  }

  useEffect(() => {
    // Function to calculate the optimal height and number of photos to place in gallery row
    const calculatePhotosRows = (originalPhotos: Photo[]) => {
      console.log('originalPhotos', originalPhotos)
      const MAX_ROW_HEIGHT = 500

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
            height: rowHeight > MAX_ROW_HEIGHT ? MAX_ROW_HEIGHT : rowHeight,
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

  // Initial load
  useEffect(() => {
    fetchPhotos()
  }, [])

  return (
    <div
      className={`${styles.Gallery} ${
        isThumbnailMode ? styles.thumbnail_mode : styles.full_img_mode
      }`}
    >
      <button
        className={styles.toggle_mode_btn}
        onClick={() => setIsThumbnailMode(prev => !prev)}
      >
        {isThumbnailMode ? <LayoutGrid /> : <PanelsTopLeft />}
      </button>
      <div className={styles.content}>
        <div className={styles.grid}>
          {isThumbnailMode ? (
            photos.map((photo: Photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isThumbnailMode={isThumbnailMode}
              />
            ))
          ) : (
            <PhotoRows photos={formattedPhotos} />
          )}
        </div>
        {loading && <p>Loading more photos...</p>}
        {!hasMore && <p>No more photos to load.</p>}
      </div>
    </div>
  )
}

export default Gallery
