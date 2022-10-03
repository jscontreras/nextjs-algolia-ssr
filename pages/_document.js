import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/instantsearch.css@7.0.0/themes/algolia-min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@algolia/autocomplete-theme-classic"
        />
      </Head>
      <body className='bg-slate-400 flex justify-center font-mono'>
        <div className='text-gray-700 bg-white min-h-screen p-8 max-w-screen-xl'>
          <Main />
          <NextScript />
        </div>
      </body>
    </Html>
  )
}