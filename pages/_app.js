import { useEffect, createContext, useState } from 'react';
import '../styles/globals.css'
import Head from 'next/head';


const defaultDescription = '';
const defaultOGURL = '';
const defaultOGImage = '';

let initController = true;


function MyApp(props) {
  const { Component, pageProps } = props;
  const [algoliaUrls, setAlgoliaUrls] = useState([]);
  const [serviceWorkerChannel, setServiceWorkerChannel] = useState({})

  return <>
    <Head>
      <meta charSet="UTF-8" />
      <title>{props.title || ''}</title>
      <meta
        name="description"
        content={props.description || defaultDescription}
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:url" content={props.url || defaultOGURL} />
      <meta property="og:title" content={props.title || ''} />
      <meta
        property="og:description"
        content={props.description || defaultDescription}
      />
      <meta name="twitter:site" content={props.url || defaultOGURL} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={props.ogImage || defaultOGImage} />
      <meta property="og:image" content={props.ogImage || defaultOGImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
    </Head>
    <AlgoliaFetchContext.Provider value={{ payloads: algoliaUrls, channel: serviceWorkerChannel }}>
      <Component {...pageProps} />
    </AlgoliaFetchContext.Provider>
  </>
}

export const AlgoliaFetchContext = createContext()


export default MyApp
