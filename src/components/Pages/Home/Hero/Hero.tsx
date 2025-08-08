import React from 'react'
import styles from './Hero.module.scss'
import { ButtonLink } from '../../../Common/ButtonLink'
const Hero = () => {
  return (
    <div className={`${styles.hero}`}>
      <div className={styles.content}>
        <img
          src='/images/logo.webp'
          alt='Jesse Lind Photography Logo'
          className={styles.logo}
        />
        <img
          src='/images/home/1.webp'
          alt=''
          tabIndex={0}
          className={`${styles.displayed_img} ${styles.img_1}`}
        />
        <img
          src='/images/home/2.webp'
          alt=''
          tabIndex={0}
          className={`${styles.displayed_img} ${styles.img_2}`}
        />
        <img
          src='/images/home/3.webp'
          alt=''
          tabIndex={0}
          className={`${styles.displayed_img} ${styles.img_3}`}
        />
        <img
          src='/images/home/4.webp'
          alt=''
          tabIndex={0}
          className={`${styles.displayed_img} ${styles.img_4}`}
        />
        <img
          src='/images/home/5.webp'
          alt=''
          tabIndex={0}
          className={`${styles.displayed_img} ${styles.img_5}`}
        />
        <img
          src='/images/home/6.webp'
          alt=''
          tabIndex={0}
          className={`${styles.displayed_img} ${styles.img_6}`}
        />
        <img
          src='/images/home/7.webp'
          alt=''
          tabIndex={0}
          className={`${styles.displayed_img} ${styles.img_7}`}
        />
        <img
          src='/images/home/8.webp'
          alt=''
          tabIndex={0}
          className={`${styles.displayed_img} ${styles.img_8}`}
        />
        <img
          src='/images/home/9.webp'
          alt=''
          tabIndex={0}
          className={`${styles.displayed_img} ${styles.img_9}`}
        />
      </div>
    </div>
  )
}

export default Hero
