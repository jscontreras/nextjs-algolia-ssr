import React from 'react';
import { InstantSearchBasicApp } from '../../components/instantSearchBasicApp';
import { InstantSearchSSRProvider, getServerState } from 'react-instantsearch';
import { renderToString } from 'react-dom/server';
import singletonRouter from 'next/router';
import { createInstantSearchRouterNext } from 'react-instantsearch-router-nextjs';
import { searchClient } from '../../lib/common';
import crypto from 'crypto';


const indexName = "instant_search";
export default function SearchPage({ serverState, serverUrl, clientUserToken = null }) {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <InstantSearchBasicApp
        searchClient={searchClient}
        indexName={indexName}
        routing={{ router: createInstantSearchRouterNext({ singletonRouter, serverUrl: serverUrl }) }}
        clientUserToken={clientUserToken}
      />
    </InstantSearchSSRProvider>
  );
}

export async function getServerSideProps({ req, res }) {
  const protocol = req.headers.referer?.split('://')[0] || 'https';
  const serverUrl = `${protocol}://${req.headers.host}${req.url}`;

  const serverState = await getServerState(<SearchPage serverUrl={serverUrl} />, { renderToString });
  let clientUserToken = req.cookies._ALGOLIA || null;

  // Set cookie if not found
  if (clientUserToken === null) {
    clientUserToken = 's__' + crypto.randomUUID();
    res.setHeader('Set-Cookie', `_ALGOLIA=${clientUserToken}; Path=/;`)
  }
  return {
    props: {
      serverState,
      serverUrl,
      clientUserToken,
    },
  };
}
