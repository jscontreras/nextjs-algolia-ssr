import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Algolia SSR with NextJS Demo</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>

        </h1>
        <h2 className="text-3xl font-bold underline">
          Algolia Isomorphic Render POC
        </h2>


        <div className={styles.grid}>
          <Link href={'/instantsearch'} >
            <a className={styles.card}>
              <h2>InstantSearch &rarr;</h2>
              <p>Server Side rendering using <span className='font-bold'>Algolia Hooks InstantSearch</span> Lib.</p>
            </a>
          </Link>

          <Link href={'/autocomplete-core'}>
              <a className={styles.card}>
                <h2>Autocomplete Core &rarr;</h2>
              <p>Isomprohic rendering using Algolia <span className='font-bold'>autocomplete-core</span> Lib.</p>
              </a>
          </Link>
          <Link href={'/autocomplete-js'}>
            <a className={styles.card}>
              <h2>Autocomplete JS &rarr;</h2>
              <p>Server Side conditional rendering using Algolia <span className='font-bold'>autocomplete-js</span> Lib.</p>
            </a>
          </Link>
          <Link href={'/category_pages'}>
            <a className={styles.card}>
              <h2>Category Pages &rarr;</h2>
              <p>Hierarchy Facets and Category landing Pages.</p>
            </a>
          </Link>
          <Link href={'/debug'}>
            <a className={styles.card}>
              <h2>Debugger &rarr;</h2>
              <p>See Algolia requests parameters from any of the previously listed examples in real time.</p>
            </a>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
