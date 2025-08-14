import React, { useEffect, useState } from 'react'
import styles from './SinglePhoto.module.scss'
import type { Photo } from '../AllPhotos/Gallery/PhotoThumbnail'
import {
  getPhotoById,
  getNextPhoto,
  getPrevPhoto,
  preloadImages,
  getLastPhoto,
  getFirstPhoto,
  timeoutFetch,
} from '../../../services/photoService'
import { Info, LayoutGrid, MoveLeft, MoveRight, X } from 'lucide-react'
import { formatTimestampDate } from '../../../util/date'
import { usePhotoStore } from '../../../store/photoStore'

const SinglePhoto = ({ photoID }: { photoID: string | undefined }) => {
  const storePhoto = usePhotoStore(state => state.selectedPhoto)
  const [photo, setPhoto] = useState(storePhoto)
  const [displayedPhoto, setDisplayedPhoto] = useState<Photo | null>(storePhoto)

  const [nextPhoto, setNextPhoto] = useState<Photo | null>(null)
  const [prevPhoto, setPrevPhoto] = useState<Photo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [timeoutMessage, setTimeoutMessage] = useState<string | null>(null)
  const [isInfoOpen, setIsInfoOpen] = useState(false)

  useEffect(() => {
    async function loadPhotos() {
      let current: null | Photo = photo
      console.log('VALUES:', current, photo, storePhoto)
      if (!current) {
        const saved = sessionStorage.getItem('selectedPhoto')
        if (saved) {
          const parsedSaved = JSON.parse(saved)
          console.log('Saved img:', saved, 'Parsed:', parsedSaved)
          current = parsedSaved
        } else {
          console.log('I shouldnt be here in !current')
          setIsLoading(true)
          await getPhotoById(photoID).then(fetched => {
            if (fetched) {
              current = fetched
            }
          })
        }
        setPhoto(current)
        setDisplayedPhoto(current)
        // fallback if user came directly to the page
      }

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

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (isLoading || isFetching) {
      // Only show loader if loading takes longer than 200ms
      timer = setTimeout(() => setShowLoader(true), 200)
    } else {
      setShowLoader(false)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [isLoading, isFetching])

  useEffect(() => {
    setIsLoading(true)
  }, [photo])

  const handleClickNext = async () => {
    setIsFetching(true)
    setIsLoading(true) // show spinner immediately

    let targetPhoto: Photo | null = nextPhoto

    try {
      if (!nextPhoto) {
        // Loop back to first photo if at the last one
        targetPhoto = await timeoutFetch(getFirstPhoto())
      }

      if (!targetPhoto) {
        console.warn('Failed to fetch target photo within timeout.')
        setIsFetching(false)
        setIsLoading(false)

        setTimeoutMessage(
          'Photo failed to load. Please check your network connection.'
        )
        return
      }

      // Update current photo immediately
      setPhoto(targetPhoto)

      // Fetch upcoming and previous photos for preloading/navigation
      const newNext1 = await timeoutFetch(
        getNextPhoto(targetPhoto.sequenceNumber)
      )
      const newNext2 = newNext1
        ? await timeoutFetch(getNextPhoto(newNext1.sequenceNumber))
        : null
      const newNext3 = newNext2
        ? await timeoutFetch(getNextPhoto(newNext2.sequenceNumber))
        : null
      const newPrev = await timeoutFetch(
        getPrevPhoto(targetPhoto.sequenceNumber)
      )

      setNextPhoto(newNext1)
      setPrevPhoto(newPrev)

      // Preload the next 3 images ahead
      preloadImages([newNext1?.fullUrl, newNext2?.fullUrl, newNext3?.fullUrl])
    } catch (error) {
      console.error('Error navigating to next photo:', error)
    } finally {
      setIsFetching(false)
    }
  }

  const handleClickPrev = async () => {
    setIsFetching(true)
    setIsLoading(true) // show spinner immediately

    let targetPhoto: Photo | null = prevPhoto

    try {
      if (!prevPhoto) {
        // Loop back to last photo if at the first one
        targetPhoto = await timeoutFetch(getLastPhoto())
      }

      if (!targetPhoto) {
        console.warn('Failed to fetch target photo within timeout.')
        setIsFetching(false)
        setIsLoading(false)

        setTimeoutMessage(
          'Photo failed to load. Please check your network connection.'
        )
        return
      }

      // Update current photo immediately
      setPhoto(targetPhoto)

      // Fetch next and prev photos with timeout
      const newNext = await timeoutFetch(
        getNextPhoto(targetPhoto.sequenceNumber)
      )
      const newPrev1 = await timeoutFetch(
        getPrevPhoto(targetPhoto.sequenceNumber)
      )
      const newPrev2 = newPrev1
        ? await timeoutFetch(getPrevPhoto(newPrev1.sequenceNumber))
        : null
      const newPrev3 = newPrev2
        ? await timeoutFetch(getPrevPhoto(newPrev2.sequenceNumber))
        : null

      setNextPhoto(newNext)
      setPrevPhoto(newPrev1)

      preloadImages([newNext?.fullUrl, newPrev1?.fullUrl, newPrev2?.fullUrl])
    } catch (error) {
      console.error('Error navigating to previous photo:', error)
    } finally {
      setIsFetching(false)
    }
  }

  const location = photo && photo.location ? photo.location : null
  console.log(photo?.photoDate)
  const dateCaptured =
    photo && photo.photoDate ? formatTimestampDate(photo.photoDate) : null

  // Handler for when new photo image finishes loading
  const handleImageLoad = () => {
    setIsLoading(false)
    setDisplayedPhoto(photo)
  }

  return (
    <div className={styles.SinglePhoto}>
      <div className={styles.content}>
        <div className={styles.inner}>
          {displayedPhoto && (
            <>
              {showLoader && <div className={styles.spinner}>Loading...</div>}
              {timeoutMessage && (
                <div className={styles.errorMessage}>{timeoutMessage}</div>
              )}
              <img
                src={displayedPhoto.fullUrl}
                className={`${styles.photo} ${
                  isLoading ? styles.fadeOut : styles.fadeIn
                }`}
                alt={displayedPhoto.title || 'Photo'}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
                draggable={false}
              />
              {photo && photo.fullUrl !== displayedPhoto.fullUrl && (
                <img
                  src={photo.fullUrl}
                  onLoad={handleImageLoad}
                  alt={photo.title || 'Photo'}
                  style={{ display: 'none' }}
                  draggable={false}
                />
              )}
            </>
          )}
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
        <button
          className={`${styles.info_btn} ${isInfoOpen ? styles.open : ''}`}
          onClick={() => setIsInfoOpen(prev => !prev)}
        >
          {isInfoOpen ? (
            <X size={20} strokeWidth={1.2} />
          ) : (
            <Info size={20} strokeWidth={1.2} />
          )}
        </button>
      </div>
      <div
        className={`${styles.info_container} ${
          isInfoOpen ? styles.open : styles.closed
        }`}
      >
        <div className={styles.background}></div>
        {displayedPhoto ? (
          <div className={styles.text_container}>
            <div className={styles.text}>
              <span>Photo ID:</span>
              {displayedPhoto.id}
            </div>
            {location && (
              <div className={styles.text}>
                <span>Location:</span> {location}
              </div>
            )}
            {dateCaptured && (
              <div className={styles.text}>
                <span>Taken:</span> {dateCaptured}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default SinglePhoto
