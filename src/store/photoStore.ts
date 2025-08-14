import { create } from 'zustand'
import type { Photo } from '../components/Pages/AllPhotos/Gallery/PhotoThumbnail'

interface PhotoStore {
  selectedPhoto: Photo | null
  setSelectedPhoto: (photo: Photo) => void
}

export const usePhotoStore = create<PhotoStore>(set => ({
  selectedPhoto: null,
  setSelectedPhoto: photo => set({ selectedPhoto: photo }),
}))
