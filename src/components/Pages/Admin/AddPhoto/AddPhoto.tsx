import React, { useState } from 'react'
import imageCompression from 'browser-image-compression'
import { db, storage } from '../../../../lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import styles from './AddPhoto.module.scss'
import {
  categories,
  type CollectionType,
} from '../../../../assets/data/categories'

export default function AddPhoto() {
  const [title, setTitle] = useState('')
  const [photoDate, setPhotoDate] = useState<string>('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const [project, setProject] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return alert('Please select a file.')

    setLoading(true)
    try {
      const id = file.name
        .replace(/\.[^/.]+$/, '')
        .toLowerCase()
        .replace(/\s+/g, '-')

      // Upload full-res
      const fullRef = ref(storage, `full/${file.name}`)
      await uploadBytes(fullRef, file)
      const fullUrl = await getDownloadURL(fullRef)

      // Create thumbnail in browser
      const thumbBlob = await imageCompression(file, {
        maxWidthOrHeight: 300,
        useWebWorker: true,
      })

      // Upload thumbnail
      const thumbRef = ref(storage, `thumbnails/${file.name}`)
      await uploadBytes(thumbRef, thumbBlob)
      const thumbUrl = await getDownloadURL(thumbRef)

      const createdDate = photoDate
        ? Timestamp.fromDate(new Date(photoDate))
        : null

      // Add Firestore doc
      await addDoc(collection(db, 'photos'), {
        id,
        title,
        category,
        description,
        location: location || null, // Store null if empty
        storagePath: `full/${file.name}`,
        thumbnailPath: `thumbnails/${file.name}`,
        fullUrl,
        thumbnailUrl: thumbUrl,
        createdAt: serverTimestamp(),
        photoDate: createdDate,
      })

      alert('Photo uploaded successfully!')
      setTitle('')
      setCategory('')
      setDescription('')
      setFile(null)
    } catch (error) {
      console.error(error)
      alert('Error uploading photo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.AddPhoto}>
      <div className={styles.content}>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <input
            type='file'
            accept='image/*'
            onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
          />
          <input
            type='text'
            placeholder='Title'
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <input
            type='date'
            value={photoDate}
            onChange={e => setPhotoDate(e.target.value)}
            placeholder='Date taken (optional)'
          />
          <input
            type='text'
            placeholder='Location (optional)'
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value=''>Select category</option>
            {categories.map((cat: CollectionType) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <select value={project} onChange={e => setProject(e.target.value)}>
            <option value=''>Select project</option>
            {/* {projects.map((proj: ProjectType) => (
              <option key={proj.name} value={proj.name}>
                {proj.name}
              </option>
            ))} */}
          </select>
          <textarea
            placeholder='Description'
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <button type='submit' disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </form>
      </div>
    </div>
  )
}
