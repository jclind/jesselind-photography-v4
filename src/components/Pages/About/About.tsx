import React from 'react'
import styles from './About.module.scss'
import LogoButton from '../../Common/LogoButton'

const About = () => {
  const contactLinks = [
    {
      label: 'Email',
      value: 'jesselindphotography@gmail.com',
      link: 'mailto:jesselindphotography@gmail.com',
    },
    {
      label: 'IG',
      value: '@jesselindphotography',
      link: 'https://www.instagram.com/jesselindphotography/',
    },
    { label: 'Github', value: '@jclind', link: 'https://github.com/jclind' },
    {
      label: 'Website',
      value: 'jesselind.com',
      link: 'https://jesselind.com/',
    },
  ]

  return (
    <div className={styles.About}>
      <LogoButton />
      <div className={styles.content}>
        <div className={styles.information}>
          <h1>Information</h1>
          <p>
            I’m Jesse, a hobbyist photographer with 10+ years of shooting
            experience, including two years of the Tookapic daily challenge. I
            work across animals, landscapes, and urban scenes, and keep pushing
            into new genres.
          </p>
          <p>
            Design and visual style have always been part of my life, and I aim
            to keep refining my eye. If you’d like to see more of my creations
            check out my personal website.
          </p>
        </div>
        <div className={styles.contact}>
          <h1>Contact</h1>
          <div className={styles.contact_links}>
            {contactLinks.map(link => (
              <div className={styles.contact_link}>
                <span className={styles.label}>{link.label}</span>
                <a href={link.link} target='_blank' rel='noopener noreferrer'>
                  {link.value}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
