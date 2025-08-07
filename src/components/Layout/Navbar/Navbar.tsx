import React, { useState } from 'react'
import styles from './Navbar.module.scss'
import { navLinks } from './navData'
import { Twirl as Hamburger } from 'hamburger-react'

interface NavbarProps {
  currentPath: string
}

const Navbar = ({ currentPath }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false)
  console.log(currentPath)
  return (
    <div className={styles.navbar}>
      <button className={styles.hamburger}>
        <span className={`${styles.top}`}></span>
        <span className={`${styles.middle}`}></span>
        <span className={`${styles.bottom}`}></span>
      </button>
    </div>
  )
}

export default Navbar
