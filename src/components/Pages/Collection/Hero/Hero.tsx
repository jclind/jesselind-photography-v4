import React, { useState } from 'react'
import styles from './Hero.module.scss'

const Hero = () => {
  const [currHoveredName, setCurrHoveredName] = useState<string | null>(null)

  const collections = [
    {
      name: 'Urban',
      imgSrc: '/images/home/1.webp',
      path: '/collections/urban',
    },
    {
      name: 'Nature',
      imgSrc: '/images/home/4.webp',
      path: '/collections/nature',
    },
    {
      name: 'Architecture',
      imgSrc: '/images/home/3.webp',
      path: '/collections/architecture',
    },
    {
      name: 'Night',
      imgSrc: '/images/home/4.webp',
      path: '/collections/night',
    },
    {
      name: 'Street',
      imgSrc: '/images/home/9.webp',
      path: '/collections/street',
    },
    {
      name: 'Minimal',
      imgSrc: '/images/home/6.webp',
      path: '/collections/minimal',
    },
    {
      name: 'Abstract',
      imgSrc: '/images/home/7.webp',
      path: '/collections/abstract',
    },
    {
      name: 'Seascape',
      imgSrc: '/images/home/8.webp',
      path: '/collections/seascape',
    },
    {
      name: 'Seasons',
      imgSrc: '/images/home/9.webp',
      path: '/collections/seasons',
    },
  ]

  const handleMouseOver = (hoveredName: string) => {
    setCurrHoveredName(hoveredName)
  }
  const handleMouseLeave = () => setCurrHoveredName(null)

  return (
    <div className={styles.Hero}>
      <a href='/' className={styles.logo}>
        <img src='/images/logo.webp' />
      </a>
      <div className={styles.content}>
        <a href='' className={styles.my_photos_link}>
          My Photos
        </a>

        <div className={styles.links}>
          {collections.map((collection, index, origArr) => {
            const isAnyHovered = currHoveredName !== null
            const isHovered = currHoveredName === collection.name
            const currClass = !isAnyHovered
              ? ''
              : isHovered
              ? styles.hovered
              : styles.not_hovered

            return (
              <a
                href={collection.path}
                onMouseOver={() => handleMouseOver(collection.name)}
                onMouseLeave={handleMouseLeave}
                className={`${currClass} ${index > 3 ? styles.img_to_top : ''}`}
              >
                {collection.name}
                <div className={styles.image_container}>
                  <img src={collection.imgSrc} />
                </div>
                <div className={styles.line}></div>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Hero
