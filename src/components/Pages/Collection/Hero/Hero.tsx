import React, { useState } from 'react'
import styles from './Hero.module.scss'
import LogoButton from '../../../Common/LogoButton'
import { categories } from '../../../../assets/data/categories'

const Hero = () => {
  const [currHoveredName, setCurrHoveredName] = useState<string | null>(null)

  const handleMouseOver = (hoveredName: string) => {
    setCurrHoveredName(hoveredName)
  }
  const handleMouseLeave = () => setCurrHoveredName(null)

  return (
    <div className={styles.Hero}>
      <LogoButton />
      <div className={styles.content}>
        <a href='' className={styles.my_photos_link}>
          My Photos
        </a>

        <div className={styles.links}>
          {categories.map((category, index, origArr) => {
            const isAnyHovered = currHoveredName !== null
            const isHovered = currHoveredName === category.name
            const currClass = !isAnyHovered
              ? ''
              : isHovered
              ? styles.hovered
              : styles.not_hovered

            return (
              <a
                href={category.path}
                onMouseOver={() => handleMouseOver(category.name)}
                onMouseLeave={handleMouseLeave}
                className={`${currClass} ${index > 3 ? styles.img_to_top : ''}`}
              >
                <span className={styles.left_numbers}>{`0${index + 1}`}</span>
                <span className={styles.name}>{category.name}</span>
                <div className={styles.image_container}>
                  <img src={category.imgSrc} />
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
