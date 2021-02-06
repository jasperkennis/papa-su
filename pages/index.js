import Head from 'next/head'
import Image from 'next/image'
import axios from 'axios'
import styles from '../styles/Home.module.css'
import { useState } from 'react'

export async function getServerSideProps() {
  let url = ''
  if (process.env.NODE_ENV === 'development') {
    url = 'http://0.0.0.0:3000'
  }

  if (process.env.VERCEL_URL) {
    url = `https://${process.env.VERCEL_URL}`
  }

  const videos = await axios.get(`${url}/api/playlist`).catch((err) => {
    console.error(err)
  })

  return {
    props: {
      videos: videos.data
    },
  }
}

export default function Home({videos}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Papa Su · Tasteful sounds</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Papa Su
        </h1>

        <p className={styles.description}>
          Tasteful sounds for drunk programming.
        </p>

        <p className={styles.description}>One day, we will begin a band. Until that time, <a
            href="https://www.youtube.com/playlist?list=PLe4etrkqQQuttD9tCh4610EaVoUvX5Rco"
            target="_blank">find the lovely playlist here.</a>
        </p>

        <div className={styles.grid}>
          {videos.map(video => (
            <a
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.id}`}
              className={styles.card}>
              <h3>{video.title}</h3>
              <p>{video.channelTitle}</p>
              <span className={styles.imageContainer}>
              <Image
                src={video.thumbnailUrl}
                layout='fill' />
              </span>
            </a>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
