import React, { useState } from 'react'
import styles from './Navbar.module.scss'
import { navLinks } from './navData'
import { Twirl as Hamburger } from 'hamburger-react'

interface NavbarProps {
  currentPath: string
}

const Navbar = ({ currentPath }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleIsOpen = () => setIsOpen(state => !state)
  console.log(currentPath)

  const links = [
    { name: 'Home', src: '/home' },
    { name: 'Projects', src: '/projects' },
    { name: 'Contact', src: '/contact' },
    { name: 'Info', src: '/info' },
    {
      name: 'jesselind.com',
      src: 'https://jesselind.com/',
      shouldOpenInNewTab: true,
    },
  ]
  return (
    <>
      <button className={styles.hamburger} onClick={toggleIsOpen} tabIndex={0}>
        <span
          className={`${styles.top} ${isOpen ? styles.top_open : ''}`}
        ></span>
        <span
          className={`${styles.middle} ${isOpen ? styles.middle_open : ''}`}
        ></span>
        <span
          className={`${styles.bottom} ${isOpen ? styles.bottom_open : ''}`}
        ></span>
      </button>
      <div className={`${styles.navbar} ${isOpen && styles.nav_open}`}>
        <div className={styles.links}>
          {links.map(link => (
            <a
              href={link.src}
              target={link.shouldOpenInNewTab ? '_blank' : '_self'}
              rel={link.shouldOpenInNewTab ? 'noopener noreferrer' : undefined}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </>
  )
}

export default Navbar
