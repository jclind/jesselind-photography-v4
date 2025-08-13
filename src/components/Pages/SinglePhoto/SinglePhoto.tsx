import React, { useEffect, useState } from 'react'
import styles from './SinglePhoto.module.scss'
import type { Photo } from '../AllPhotos/Gallery/PhotoCard'
import {
  getPhotoById,
  getNextPhoto,
  getPrevPhoto,
  preloadImages,
} from '../../../services/photoService'
import { LayoutGrid, MoveLeft, MoveRight } from 'lucide-react'

const SinglePhoto = ({ photoID }: { photoID: string | undefined }) => {
  const [photo, setPhoto] = useState<Photo | null>(null)
  const [nextPhoto, setNextPhoto] = useState<Photo | null>(null)
  const [prevPhoto, setPrevPhoto] = useState<Photo | null>(null)

  useEffect(() => {
    async function loadPhotos() {
      const current = await getPhotoById(photoID)
      setPhoto(current)

      const next = await getNextPhoto(current?.sequenceNumber || 0)
      setNextPhoto(next)

      const prev = await getPrevPhoto(current?.sequenceNumber || 0)
      setPrevPhoto(prev)

      if (next) preloadImages([next.fullUrl])

      console.log(current, next, prev)
      console.log(photoID)
    }

    loadPhotos()
  }, [photoID])

  const handleClickNext = async () => {
    if (!nextPhoto) return

    // Step 1: update current photo
    setPhoto(nextPhoto)

    // Step 2: fetch new next/previous photos
    const newNext1 = await getNextPhoto(nextPhoto.sequenceNumber)
    const newNext2 = newNext1
      ? await getNextPhoto(newNext1.sequenceNumber)
      : null
    const newNext3 = newNext2
      ? await getNextPhoto(newNext2.sequenceNumber)
      : null
    const newPrev = await getPrevPhoto(nextPhoto.sequenceNumber)

    setNextPhoto(newNext1)
    setPrevPhoto(newPrev)

    // Step 3: preload the next 3 images
    preloadImages([newNext1?.fullUrl, newNext2?.fullUrl, newNext3?.fullUrl])
  }

  const handleClickPrev = async () => {
    if (!prevPhoto) return

    // Step 1: update current photo
    setPhoto(prevPhoto)

    // Step 2: fetch new next/previous photos
    const newNext = await getNextPhoto(prevPhoto.sequenceNumber)
    const newPrev1 = await getPrevPhoto(prevPhoto.sequenceNumber)
    const newPrev2 = newPrev1
      ? await getPrevPhoto(newPrev1.sequenceNumber)
      : null
    const newPrev3 = newPrev2
      ? await getPrevPhoto(newPrev2.sequenceNumber)
      : null

    setNextPhoto(newNext)
    setPrevPhoto(newPrev1)

    // Step 3: preload the next 3 images forward (optional)
    preloadImages([newNext?.fullUrl, newPrev1?.fullUrl, newPrev2?.fullUrl])
  }

  const location = photo && photo.location ? photo.location : null

  return (
    <div className={styles.SinglePhoto}>
      <div className={styles.content}>
        <div className={styles.inner}>
          {photo && <img src={photo.fullUrl} />}
          <button
            onClick={handleClickPrev}
            className={styles.prev_btn}
          ></button>
          <button
            onClick={handleClickNext}
            className={styles.next_btn}
          ></button>
        </div>

        <div className={styles.footer}>
          <div className={styles.controls}>
            <button onClick={handleClickPrev}>
              <MoveLeft size={16} strokeWidth={1} />
            </button>
            <a href='/all-photos'>
              <LayoutGrid size={16} strokeWidth={1} />
            </a>
            <button onClick={handleClickNext}>
              <MoveRight size={16} strokeWidth={1} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SinglePhoto
