import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Photo } from '../components/Pages/AllPhotos/Gallery/PhotoCard'

/**
 * Get a single photo by its "id" field
 */
export async function getPhotoById(photoID?: string): Promise<Photo | null> {
  if (!photoID) return null

  try {
    const photosRef = collection(db, 'photos')
    const q = query(photosRef, where('id', '==', photoID), limit(1))
    const snapshot = await getDocs(q)

    if (snapshot.empty) return null

    return snapshot.docs[0].data() as Photo
  } catch (error) {
    console.error('Error fetching photo by ID:', error)
    return null
  }
}

export async function getNextPhoto(
  sequenceNumber: number
): Promise<Photo | null> {
  const photosRef = collection(db, 'photos')
  const q = query(
    photosRef,
    where('sequenceNumber', '>', sequenceNumber),
    orderBy('sequenceNumber', 'asc'),
    limit(1)
  )
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  return snapshot.docs[0].data() as Photo
}

export async function getPrevPhoto(
  sequenceNumber: number
): Promise<Photo | null> {
  const photosRef = collection(db, 'photos')
  const q = query(
    photosRef,
    where('sequenceNumber', '<', sequenceNumber),
    orderBy('sequenceNumber', 'desc'),
    limit(1)
  )
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  return snapshot.docs[0].data() as Photo
}

/**
 * Preload images for faster next/prev navigation
 */
export function preloadImages(urls: (string | undefined)[]) {
  urls.forEach(url => {
    if (url) {
      const img = new Image()
      img.src = url
    }
  })
}
