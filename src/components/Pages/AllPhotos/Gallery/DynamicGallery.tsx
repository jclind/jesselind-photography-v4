// import React, { useState, useEffect } from 'react'
// import type { Photo } from './PhotoCard'

// function DynamicGallery({ images }: { images: Photo[] }) {
//   const [rows, setRows] = useState<Photo[]>([])

//   useEffect(() => {
//     // Group images into rows of 2-4 images dynamically
//     // For example, alternate rows between 3 and 4 images
//     const groupedRows = []
//     let i = 0
//     while (i < images.length) {
//       // Random or custom logic to decide row length (between 2 and 4)
//       const rowLength = Math.min(4, images.length - i) // You can tweak this for randomness or pattern
//       groupedRows.push(images.slice(i, i + rowLength))
//       i += rowLength
//     }
//     setRows(groupedRows)
//   }, [images])

//   return (
//     <div style={{ maxHeight: 700, overflow: 'hidden' }}>
//       {rows.map((rowImages, idx) => {
//         const rowCount = rowImages.length

//         // Calculate height based on row count and width - simple formula: max 700px / total rows, or set manually
//         // Here, let’s say max row height is 700px / number of rows, but never more than 700px per row
//         const maxRows = rows.length
//         const rowHeight = Math.min(700 / maxRows, 700)

//         return (
//           <div
//             key={idx}
//             style={{
//               display: 'grid',
//               gridTemplateColumns: `repeat(${rowCount}, 1fr)`,
//               height: rowHeight,
//               gap: 0,
//             }}
//           >
//             {rowImages.map((img, i) => (
//               <img
//                 key={i}
//                 src={img.src}
//                 alt={img.alt}
//                 style={{
//                   width: '100%',
//                   height: '100%',
//                   objectFit: 'cover', // fill container, no gaps
//                 }}
//               />
//             ))}
//           </div>
//         )
//       })}
//     </div>
//   )
// }
