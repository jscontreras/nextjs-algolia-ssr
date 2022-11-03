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

  useEffect(() => {
    if ("serviceWorker" in navigator) {

      // Check if there is already one working otherwise register and reload
      if (!navigator.serviceWorker.controller) {
        navigator.serviceWorker.register("/sw-algolia.js", {
          scope: '/'
        }).then(
          function (registration) {
            if (initController) {
              initController = false;
              console.log("Interceptor Service Worker registration successful with scope: ", registration.scope);
              location.reload();
            }
          },
          function (err) {
            console.log("Service Worker registration failed: ", err);
          }

        );
      } else {
        // If controller detected then send the message channel
        if (initController) {
          const channel = new BroadcastChannel('app-channel');

          // Listen bardcast channel
          channel.onmessage = function (e) {
            if (e.data.action === 'echoed') {
              console.log('Broadcasted Echo:', e.data.payload);
            }
            else if (e.data.action === 'algolia') {
              setAlgoliaUrls(e.data.payload.payloads)
            }
          };

          initController = false;
          console.log('Service Worker Controller Ready');
          // Register a handler to detect hwen a new or update sercice worker is installed & activate
          navigator.serviceWorker.oncontrollerchange = (ev) => {
            console.log('Service Worker Changed!!!!!!!!!!!!!!!!!!!!')
          }

          navigator.serviceWorker.controller.postMessage({
            action: 'getPreviousUrls',
          });

          setServiceWorkerChannel({
            sendMessage:
            (action, payload = {}) => {
            navigator.serviceWorker.controller.postMessage({
                action,
                payload
            })}
          })
        }
      }
    }
  }, [serviceWorkerChannel])
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
