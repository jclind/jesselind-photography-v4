import React from 'react'
import styles from './LogoButton.module.scss'

const LogoButton = () => {
  return (
    <a href='/' className={styles.nav_logo}>
      <img src='/images/logo.webp' />
    </a>
  )
}

export default LogoButton
