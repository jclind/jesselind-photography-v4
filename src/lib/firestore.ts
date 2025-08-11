import { db } from './firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'

export async function getAllPhotos() {
  const photosRef = collection(db, 'photos')
  const q = query(photosRef, orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => doc.data())
}
