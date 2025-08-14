import React from 'react'
import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
  where,
  type QueryDocumentSnapshot,
  type DocumentData,
} from 'firebase/firestore'
import GalleryTemplate from '../../Common/GalleryTemplate'
import { db } from '../../../lib/firebase'
import type { Photo } from '../../Common/GalleryTemplate/PhotoThumbnail'

const PAGE_SIZE = 10

const CollectionGallery = ({ collectionID }: { collectionID: string }) => {
  const fetchPhotos = async (lastDoc?: QueryDocumentSnapshot) => {
    const photosRef = collection(db, 'photos')
    console.log('fetchPhotos 1, collectionID:', collectionID)
    // Create the query filtered by category
    const q = lastDoc
      ? query(
          photosRef,
          where('category', '==', collectionID),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(PAGE_SIZE)
        )
      : query(
          photosRef,
          where('category', '==', collectionID),
          orderBy('createdAt', 'desc'),
          limit(PAGE_SIZE)
        )

    const snapshot = await getDocs(q)

    console.log('fetchPhotos 2, snapshot:', collectionID)
    console.log(snapshot)

    if (snapshot.empty) {
      console.log('FetchPhotos 3: its empty?')
      return { photos: [], lastDoc: null }
    }

    const photos: Photo[] = snapshot.docs.map(doc => doc.data() as Photo)
    console.log('FetchPhotos 4, photos:', photos)
    const newLastDoc = snapshot.docs[snapshot.docs.length - 1]

    return { photos, lastDoc: newLastDoc }
  }
  return <GalleryTemplate fetchPhotos={fetchPhotos} pageSize={PAGE_SIZE} />
}

export default CollectionGallery
