import React, { useState, useEffect } from 'react'
import imageCompression from 'browser-image-compression'
import { db, storage } from '../../../../lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
  runTransaction,
  doc,
} from 'firebase/firestore'
import styles from './AddPhoto.module.scss'
import {
  categories,
  type CollectionType,
} from '../../../../assets/data/categories'
import { projects, type ProjectType } from '../../../../assets/data/projects'

export default function AddPhoto() {
  // Metadata inputs that apply to all files
  const [title, setTitle] = useState('')
  const [photoDate, setPhotoDate] = useState<string>('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const [projectID, setProjectID] = useState('')
  const [description, setDescription] = useState('')

  // Files & previews
  const [files, setFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const [loading, setLoading] = useState(false)

  // Generate previews when files change
  useEffect(() => {
    if (files.length === 0) {
      setPreviewUrls([])
      return
    }

    const urls = files.map(file => URL.createObjectURL(file))
    setPreviewUrls(urls)

    return () => urls.forEach(url => URL.revokeObjectURL(url))
  }, [files])

  async function getImageDimensionsFromFile(
    file: File
  ): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight })
      }
      img.onerror = reject

      const reader = new FileReader()
      reader.onload = e => {
        if (e.target?.result) {
          img.src = e.target.result as string
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (files.length === 0) return alert('Please select files.')

    if (!photoDate) return alert('Please enter a valid date')
    const createdDate = new Date(photoDate)

    setLoading(true)

    try {
      const counterRef = doc(db, 'counters', 'photos')

      await runTransaction(db, async transaction => {
        // Get current last sequence number
        const counterSnap = await transaction.get(counterRef)
        let lastSequenceNumber = 0
        if (counterSnap.exists()) {
          lastSequenceNumber = counterSnap.data().lastSequenceNumber || 0
        } else {
          transaction.set(counterRef, { lastSequenceNumber: 0 })
        }

        for (const file of files) {
          // Generate a sanitized ID from filename
          const id = file.name
            .replace(/\.[^/.]+$/, '')
            .toLowerCase()
            .replace(/\s+/g, '-')

          // Get dimensions
          const { width, height } = await getImageDimensionsFromFile(file)

          // Upload full image
          const fullRef = ref(storage, `full/${file.name}`)
          await uploadBytes(fullRef, file)
          const fullUrl = await getDownloadURL(fullRef)

          // Create and upload thumbnail
          const thumbBlob = await imageCompression(file, {
            maxWidthOrHeight: 300,
            useWebWorker: true,
          })
          const thumbRef = ref(storage, `thumbnails/${file.name}`)
          await uploadBytes(thumbRef, thumbBlob)
          const thumbUrl = await getDownloadURL(thumbRef)

          // Increment sequence number
          lastSequenceNumber++

          // Add photo doc
          const photoRef = doc(collection(db, 'photos'))
          transaction.set(photoRef, {
            id,
            title,
            category,
            description,
            location: location || null,
            storagePath: `full/${file.name}`,
            thumbnailPath: `thumbnails/${file.name}`,
            projectID: projectID || null,
            fullUrl,
            thumbnailUrl: thumbUrl,
            width,
            height,
            createdAt: serverTimestamp(),
            photoDate: createdDate,
            sequenceNumber: lastSequenceNumber,
          })
        }

        // Update the counter with new last sequence number
        transaction.update(counterRef, { lastSequenceNumber })
      })

      alert('All photos uploaded!')
      // Reset form
      setFiles([])
      setTitle('')
      setCategory('')
      setDescription('')
      setLocation('')
      setProjectID('')
      setPhotoDate('')
    } catch (error) {
      console.error(error)
      alert('Error uploading photos.')
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
          <label className={styles.fileInputLabel}>
            {previewUrls.length > 0 ? (
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                {previewUrls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Preview ${i + 1}`}
                    style={{
                      maxWidth: '100px',
                      maxHeight: '100px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                    }}
                  />
                ))}
              </div>
            ) : (
              'Choose images...'
            )}
            <input
              type='file'
              accept='image/*'
              multiple
              onChange={e =>
                setFiles(e.target.files ? Array.from(e.target.files) : [])
              }
            />
          </label>
          <input
            type='text'
            placeholder='Title (optional)'
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
            <option value=''>Select category (optional)</option>
            {categories.map((cat: CollectionType) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            value={projectID}
            onChange={e => setProjectID(e.target.value)}
          >
            <option value=''>Select project (optional)</option>
            {projects.map((proj: ProjectType) => (
              <option key={proj.name} value={proj.name}>
                {proj.name}
              </option>
            ))}
          </select>
          <textarea
            placeholder='Description (optional)'
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <button type='submit' disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Photos'}
          </button>
        </form>
      </div>
    </div>
  )
}
